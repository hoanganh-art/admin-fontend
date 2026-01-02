// employees-complete.js
// File hoàn chỉnh quản lý nhân viên (API + UI)

// ========= CẤU HÌNH API NHÂN VIÊN =========

const API_BASE_URL = "http://127.0.0.1:6346"; // Đổi port về 8000 (mặc định Laravel)

const API_ENDPOINTS = {
    employees: "/api/employees",
    employeesId: (id) => `/api/employees/${id}`, // Sửa thành function
    employees_statistics: "/api/employees/statistics",
    employees_login: "/api/employees/login",
    employees_password: (id) => `/api/employees/${id}/change-password`,
}

// ========= XỬ LÝ LỖI CHUNG =========
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
    }
}

const handleError = (error) => {
    if (error.response) {
        // Lỗi từ server
        const { data, status } = error.response;
        
        // Nếu data là string (HTML), trích xuất thông báo lỗi
        let errorMessage = 'Đã có lỗi xảy ra';
        if (typeof data === 'string') {
            // Thử trích xuất pesan lỗi từ HTML
            const match = data.match(/<h1[^>]*>([^<]+)<\/h1>/);
            if (match) {
                errorMessage = match[1].trim();
            } else if (data.includes('404')) {
                errorMessage = 'Không tìm thấy tài nguyên (404)';
            } else if (data.includes('500')) {
                errorMessage = 'Lỗi máy chủ (500) - Vui lòng kiểm tra backend logs';
            } else {
                errorMessage = 'Lỗi từ máy chủ - Chi tiết: ' + data.substring(0, 100);
            }
        } else if (data?.message) {
            errorMessage = data.message;
        }
        
        console.warn('[Error Details]', { status, data });
        throw new APIError(errorMessage, status);
    } else if (error.request) {
        // Không nhận được phản hồi
        throw new APIError('Không thể kết nối đến máy chủ', 0);
    } else {
        // Lỗi khác
        throw new APIError(error.message, 500);
    }
};

// ========= HÀM GỌI API CHUNG =========
const apiCall = async (endpoint, method = 'GET', data = null, headers = {}) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    // Thêm token nếu có
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log(`[API Call] ${method} ${API_BASE_URL}${endpoint}`, data ? data : 'no data');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Lấy response text trước để debug
        const responseText = await response.text();
        console.log(`[API Response] Status: ${response.status}, Text length: ${responseText.length}`);
        
        let responseData;

        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('[API Parse Error]', e);
            responseData = { message: responseText || 'Unknown error' };
        }

        if (!response.ok) {
            console.error(`[API Error] ${response.status}:`, responseData);
            throw {
                response: {
                    data: responseData,
                    status: response.status,
                    statusText: response.statusText
                }
            };
        }

        console.log(`[API Success] ${method} ${endpoint}:`, responseData);
        return responseData;
    } catch (error) {
        console.error(`[API Catch Error] ${method} ${endpoint}:`, error);

        // Nếu error đã là APIError thì không cần xử lý lại
        if (error.name === 'APIError') {
            throw error;
        }

        // Xử lý lỗi khác
        throw handleError(error);
    }
};

// ========= API NHÂN VIÊN =========
const EmployeesAPI = {
    // Lấy danh sách nhân viên
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString
            ? `${API_ENDPOINTS.employees}?${queryString}`
            : API_ENDPOINTS.employees;

        return await apiCall(endpoint);
    },

    // Lấy thông tin nhân viên theo ID
    getById: async (id) => {
        return await apiCall(API_ENDPOINTS.employeesId(id));
    },

    // Tạo nhân viên mới
    create: async (employeeData) => {
        return await apiCall(API_ENDPOINTS.employees, 'POST', employeeData);
    },

    // Cập nhật nhân viên
    update: async (id, employeeData) => {
        return await apiCall(API_ENDPOINTS.employeesId(id), 'PUT', employeeData);
    },

    // Xóa nhân viên
    delete: async (id) => {
        return await apiCall(API_ENDPOINTS.employeesId(id), 'DELETE');
    },

    // Đăng nhập
    login: async (credentials) => {
        const result = await apiCall(API_ENDPOINTS.employees_login, 'POST', credentials);

        // Lưu token nếu có
        if (result.data && result.data.token) {
            localStorage.setItem('auth_token', result.data.token);
            localStorage.setItem('employee_info', JSON.stringify(result.data.employee));
        }

        return result;
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('employee_info');
    },

    // Đổi mật khẩu
    changePassword: async (id, passwordData) => {
        return await apiCall(API_ENDPOINTS.employees_password(id), 'POST', passwordData);
    },

    // Lấy thống kê
    getStatistics: async () => {
        return await apiCall(API_ENDPOINTS.employees_statistics);
    },

    // Kiểm tra đăng nhập
    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    },

    // Lấy thông tin nhân viên hiện tại
    getCurrentEmployee: () => {
        const employeeInfo = localStorage.getItem('employee_info');
        return employeeInfo ? JSON.parse(employeeInfo) : null;
    },

    // Lưu thông tin nhân viên
    setCurrentEmployee: (employee) => {
        localStorage.setItem('employee_info', JSON.stringify(employee));
    }
};

// ========= HÀM HELPER =========
const EmployeesHelper = {
    // Định dạng ngày tháng
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },

    // Định dạng tiền tệ
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    // Định dạng vai trò
    formatRole: (role) => {
        const roles = {
            'admin': 'Quản trị viên',
            'employee': 'Nhân viên'
        };
        return roles[role] || role;
    },

    // Định dạng chức vụ (Sửa lại cho khớp với backend)
    formatPosition: (position) => {
        const positions = {
            'staff': 'Nhân viên',
            'Sell': 'Nhân viên bán hàng',
            'Warehouse employee': 'Nhân viên kho',
            'Accountant': 'Kế toán'
        };
        return positions[position] || position;
    },

    // Định dạng trạng thái (Sửa lại cho khớp với backend)
    formatStatus: (status) => {
        const statuses = {
            'active': 'Đang làm việc',
            'inactive': 'Nghỉ việc',
            'take a break': 'Tạm nghỉ',
            'onleave': 'Tạm nghỉ' // Thêm mapping cho onleave
        };
        return statuses[status] || status;
    },

    // Chuyển đổi trạng thái từ frontend sang backend
    convertStatusToBackend: (status) => {
        if (status === 'onleave') return 'take a break';
        return status;
    },

    // Chuyển đổi trạng thái từ backend sang frontend
    convertStatusToFrontend: (status) => {
        if (status === 'take a break') return 'onleave';
        return status;
    },

    // Chuyển đổi chức vụ từ frontend sang backend
    convertPositionToBackend: (position) => {
        const positionMap = {
            'sales': 'Sell',
            'warehouse': 'Warehouse employee',
            'accounting': 'Accountant',
            'staff': 'staff'
        };
        return positionMap[position] || position;
    },

    // Lấy class CSS cho trạng thái
    getStatusClass: (status) => {
        const classes = {
            'active': 'badge bg-success',
            'inactive': 'badge bg-danger',
            'take a break': 'badge bg-warning',
            'onleave': 'badge bg-warning'
        };
        return classes[status] || 'badge bg-secondary';
    }
};

// ========= PHẦN XỬ LÝ UI NHÂN VIÊN =========

// ========= KHỞI TẠO BIẾN TOÀN CỤC =========
let currentPage = 1;
let rowsPerPage = 12;
let totalEmployees = 0;
let currentStaffId = null;
let selectedStaffIds = new Set();
let allEmployees = [];

// ========= DOM ELEMENTS =========
const staffTableBody = document.getElementById('staffTableBody');
const totalCountElement = document.querySelector('.table-info strong');
const selectAllCheckbox = document.getElementById('selectAll');
const addStaffBtn = document.getElementById('addStaffBtn');
const staffModal = document.getElementById('staffModal');
const deleteModal = document.getElementById('deleteModal');
const staffForm = document.getElementById('staffForm');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// ========= HÀM HIỂN THỊ TOAST NOTIFICATION =========
function showToast(type, title, message) {
    // Đặt màu sắc và icon dựa trên loại thông báo
    const icons = {
        success: { icon: 'fa-check', color: 'success' },
        error: { icon: 'fa-times', color: 'error' },
        warning: { icon: 'fa-exclamation', color: 'warning' },
        info: { icon: 'fa-info', color: 'info' }
    };

    const toastType = icons[type] || icons.info;

    // Cập nhật nội dung toast
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Cập nhật icon
    const iconElement = toastIcon.querySelector('i');
    iconElement.className = `fas ${toastType.icon}`;
    toastIcon.className = `toast-icon ${toastType.color}`;

    // Hiển thị toast
    toast.classList.add('show');

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ========= HÀM ĐÓNG TOAST =========
document.getElementById('closeToast')?.addEventListener('click', () => {
    toast.classList.remove('show');
});

// ========= HÀM LẤY DỮ LIỆU NHÂN VIÊN TỪ API =========
// ========= HÀM LẤY DỮ LIỆU NHÂN VIÊN TỪ API =========
async function loadEmployees() {
    try {
        // Hiển thị loading state
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Đang tải dữ liệu...</p>
                </td>
            </tr>
        `;

        // Gọi API để lấy danh sách nhân viên
        const result = await EmployeesAPI.getAll({
            per_page: rowsPerPage,
            page: currentPage
        });

        console.log('API Response:', result); // Debug

        if (result && result.success) {
            // Xử lý cả 2 cấu trúc response có thể có
            if (result.data?.data && Array.isArray(result.data.data)) {
                // Response có pagination: { success: true, data: { data: [], total: 0 } }
                allEmployees = result.data.data;
                totalEmployees = result.data.total || result.data.data.length;
            } else if (Array.isArray(result.data)) {
                // Response trực tiếp: { success: true, data: [] }
                allEmployees = result.data;
                totalEmployees = result.data.length;
            } else {
                allEmployees = [];
                totalEmployees = 0;
            }

            // Cập nhật tổng số nhân viên
            const totalStatElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
            if (totalStatElement) {
                totalStatElement.textContent = totalEmployees;
            }

            // Cập nhật thông tin phân trang
            if (totalCountElement) {
                totalCountElement.textContent = totalEmployees;
            }

            // Hiển thị danh sách nhân viên
            renderEmployees(allEmployees);

            // Cập nhật phân trang
            updatePagination();

            // Cập nhật thống kê
            await updateStatistics();
        } else {
            // Nếu không có dữ liệu
            renderEmployees([]);
            setDefaultStatistics();
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu nhân viên:', error);
        
        // Hiển thị thông báo lỗi thân thiện
        const errorMessage = error.statusCode === 404 
            ? 'Không tìm thấy endpoint API. Vui lòng kiểm tra cấu hình server.'
            : error.message || 'Đã xảy ra lỗi khi tải dữ liệu';
        
        showToast('error', 'Lỗi!', errorMessage);
        
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không thể tải dữ liệu</h3>
                    <p>${errorMessage}</p>
                    <div style="margin-top: 10px;">
                        <button class="btn btn-primary" onclick="loadEmployees()">
                            <i class="fas fa-redo"></i>
                            Thử lại
                        </button>
                        <button class="btn btn-secondary" onclick="checkApiStatus()" style="margin-left: 10px;">
                            <i class="fas fa-server"></i>
                            Kiểm tra API
                        </button>
                    </div>
                </td>
            </tr>
        `;
        
        setDefaultStatistics();
    }
}

// Hàm kiểm tra trạng thái API
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employees/statistics`);
        const data = await response.json();
        
        showToast('info', 'API Status', 
            `Status: ${response.status} - ${response.statusText}\n` +
            `URL: ${API_BASE_URL}/api/employees/statistics`
        );
        
        console.log('API Response:', data);
    } catch (error) {
        showToast('error', 'API Error', 
            `Không thể kết nối đến API\n` +
            `URL: ${API_BASE_URL}/api/employees/statistics\n` +
            `Lỗi: ${error.message}`
        );
    }
}
// ========= HÀM HIỂN THỊ DANH SÁCH NHÂN VIÊN =========
function renderEmployees(employees) {
    if (!staffTableBody) {
        console.error('staffTableBody không tồn tại');
        return;
    }

    if (!employees || employees.length === 0) {
        staffTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Không có nhân viên nào</h3>
                    <p>Chưa có nhân viên nào trong hệ thống. Hãy thêm nhân viên mới!</p>
                </td>
            </tr>
        `;
        return;
    }

    staffTableBody.innerHTML = '';

    employees.forEach(employee => {
        // Kiểm tra dữ liệu employee
        if (!employee || !employee.id) {
            console.warn('Dữ liệu nhân viên không hợp lệ:', employee);
            return;
        }

        const row = document.createElement('tr');
        row.setAttribute("data-employee-id", employee.id); // Thêm attribute để dễ tìm row khi xóa


        // Lấy ký tự đầu tiên của tên để hiển thị avatar
        const nameInitial = employee.full_name ? employee.full_name.charAt(0).toUpperCase() : '?';

        // Định dạng vai trò
        const roleText = EmployeesHelper.formatRole(employee.role);
        const roleClass = getRoleClass(employee.role);

        // Định dạng trạng thái (chuyển từ backend sang frontend)
        const frontendStatus = EmployeesHelper.convertStatusToFrontend(employee.status);
        const statusText = EmployeesHelper.formatStatus(employee.status);
        const statusClass = getStatusClass(frontendStatus);

        // Định dạng lương
        const salaryFormatted = EmployeesHelper.formatCurrency(employee.salary);

        // Định dạng ngày vào làm
        const joinDateFormatted = EmployeesHelper.formatDate(employee.hire_date);

        // Định dạng chức vụ
        const positionText = EmployeesHelper.formatPosition(employee.position);

        row.innerHTML = `
            <td>
                <input type="checkbox" class="staff-checkbox" value="${employee.id}"
                    ${selectedStaffIds.has(employee.id) ? 'checked' : ''}>
            </td>
            <td>
                <div class="staff-info">
                    <div class="staff-avatar" style="background: ${getRandomColor()}">
                        ${nameInitial}
                    </div>
                    <div class="staff-details">
                        <div class="staff-name">${employee.full_name || 'Chưa có tên'}</div>
                        <div class="staff-email">${employee.email || 'Chưa có email'}</div>
                        <div class="staff-phone" style="font-size: 12px; color: var(--gray-500);">
                            ${employee.phone || 'Chưa có SĐT'}
                        </div>
                    </div>
                </div>
            </td>
            <td class="staff-id">${employee.id}</td>
            <td>
                <span class="role-badge ${roleClass}">
                    ${roleText}
                </span>
            </td>
            <td>
                <span class="role-badge">
                    ${positionText}
                </span>
            </td>
            <td class="staff-salary">${salaryFormatted}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td>
                <div class="staff-actions">
                    <button class="action-btn view" onclick="viewEmployee(${employee.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editEmployee(${employee.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEmployee(${employee.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        staffTableBody.appendChild(row);
    });

    // Thêm sự kiện cho checkbox
    document.querySelectorAll('.staff-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const staffId = parseInt(this.value);
            if (this.checked) {
                selectedStaffIds.add(staffId);
            } else {
                selectedStaffIds.delete(staffId);
            }
            updateSelectAllCheckbox();
        });
    });
}

// ========= HÀM CẬP NHẬT THỐNG KÊ =========
// ========= HÀM CẬP NHẬT THỐNG KÊ =========
async function updateStatistics() {
    try {
        const statsResult = await EmployeesAPI.getStatistics();

        if (statsResult && statsResult.success) {
            const stats = statsResult.data || {};

            // Cập nhật các card thống kê
            const statCards = document.querySelectorAll('.stat-card .stat-number');
            if (statCards.length >= 4) {
                // Tổng nhân viên
                statCards[0].textContent = stats.total_employees || 0;

                // Đang làm việc
                statCards[1].textContent = stats.active_employees || 0;

                // Nghỉ phép (tìm trong status_statistics)
                let onLeaveCount = 0;
                if (stats.status_statistics && Array.isArray(stats.status_statistics)) {
                    const onLeaveStat = stats.status_statistics.find(stat =>
                        stat.status === 'take a break' || stat.status === 'onleave'
                    );
                    onLeaveCount = onLeaveStat ? onLeaveStat.count : 0;
                }
                statCards[2].textContent = onLeaveCount;

                // Quản lý (admin)
                statCards[3].textContent = stats.admin_count || 0;
            }
        } else {
            // Nếu API không trả về success
            setDefaultStatistics();
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật thống kê:', error);
        setDefaultStatistics();
    }
}

// Hàm đặt giá trị mặc định cho thống kê
function setDefaultStatistics() {
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = 0;
        statCards[1].textContent = 0;
        statCards[2].textContent = 0;
        statCards[3].textContent = 0;
    }
}
// ========= HÀM LẤY MÀU NGẪU NHIÊN CHO AVATAR =========
function getRandomColor() {
    const colors = [
        'linear-gradient(45deg, #4361ee, #3a56d4)',
        'linear-gradient(45deg, #7209b7, #b5179e)',
        'linear-gradient(45deg, #10b981, #059669)',
        'linear-gradient(45deg, #f59e0b, #d97706)',
        'linear-gradient(45deg, #ef4444, #dc2626)',
        'linear-gradient(45deg, #3b82f6, #2563eb)',
        'linear-gradient(45deg, #8b5cf6, #7c3aed)',
        'linear-gradient(45deg, #ec4899, #db2777)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ========= HÀM LẤY CLASS CHO VAI TRÒ =========
function getRoleClass(role) {
    const roleClasses = {
        'admin': 'role-admin',
        'employee': 'role-staff'
    };
    return roleClasses[role] || 'role-staff';
}

// ========= HÀM LẤY CLASS CHO TRẠNG THÁI =========
function getStatusClass(status) {
    const statusClasses = {
        'active': 'status-active',
        'inactive': 'status-inactive',
        'take a break': 'status-onleave',
        'onleave': 'status-onleave'
    };
    return statusClasses[status] || 'status-active';
}

// ========= HÀM CẬP NHẬT PHÂN TRANG =========
function updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalEmployees / rowsPerPage);

    // Xóa các nút phân trang hiện tại (trừ nút điều hướng đầu/cuối)
    const navButtons = paginationContainer.querySelectorAll('.pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)');
    navButtons.forEach(btn => btn.remove());

    // Tính toán phạm vi trang hiển thị
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // Thêm nút trang
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            loadEmployees();
        });

        // Chèn trước nút next
        const nextBtn = document.getElementById('nextPage');
        if (nextBtn) {
            nextBtn.parentNode.insertBefore(pageBtn, nextBtn);
        }
    }

    // Cập nhật trạng thái nút điều hướng
    const firstPageBtn = document.getElementById('firstPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const lastPageBtn = document.getElementById('lastPage');

    if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;

    // Cập nhật thông tin phân trang
    const tableInfo = document.querySelector('.table-info');
    if (tableInfo) {
        tableInfo.innerHTML = `
            Hiển thị <strong>${Math.min(rowsPerPage, totalEmployees)}</strong> 
            trong tổng số <strong>${totalEmployees}</strong> nhân viên
        `;
    }
}

// ========= HÀM CẬP NHẬT SELECT ALL CHECKBOX =========
function updateSelectAllCheckbox() {
    if (!selectAllCheckbox) return;

    const allCheckboxes = document.querySelectorAll('.staff-checkbox');
    const checkedCount = document.querySelectorAll('.staff-checkbox:checked').length;

    selectAllCheckbox.checked = checkedCount > 0 && checkedCount === allCheckboxes.length;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCheckboxes.length;
}

// ========= HÀM XEM CHI TIẾT NHÂN VIÊN =========
async function viewEmployee(id) {
    try {
        const result = await EmployeesAPI.getById(id);
        if (result.success) {
            const employee = result.data;

            // Mở modal với thông tin chỉ đọc
            openStaffModal('view', employee);
            showToast('info', 'Thông tin nhân viên', `Đang xem thông tin ${employee.full_name}`);
        }
    } catch (error) {
        console.error('Lỗi khi xem chi tiết nhân viên:', error);
        showToast('error', 'Lỗi!', 'Không thể tải thông tin nhân viên');
    }
}

// ========= HÀM MỞ MODAL THÊM/CHỈNH SỬA/XEM =========
function openStaffModal(mode, employee = null) {
    if (!staffModal) {
        console.error('staffModal không tồn tại');
        return;
    }

    if (!staffForm) {
        console.error('staffForm không tồn tại');
        return;
    }

    // Reset form
    staffForm.reset();

    // Xóa preview avatar
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview) {
        avatarPreview.style.display = 'none';
    }

    // Đặt tiêu đề modal
    if (modalTitle) {
        if (mode === 'add') {
            modalTitle.textContent = 'Thêm Nhân Viên Mới';
            currentStaffId = null;

            // Hiển thị field password khi thêm mới
            const passwordField = document.getElementById('staffPassword');
            if (passwordField && passwordField.closest('.form-group')) {
                passwordField.closest('.form-group').style.display = 'block';
                passwordField.required = true;
            }
        } else if (mode === 'edit') {
            modalTitle.textContent = 'Chỉnh Sửa Nhân Viên';
            currentStaffId = employee ? employee.id : null;
            if (employee) {
                fillFormWithEmployeeData(employee);
            }

            // Ẩn field password khi chỉnh sửa
            const passwordField = document.getElementById('staffPassword');
            if (passwordField && passwordField.closest('.form-group')) {
                passwordField.closest('.form-group').style.display = 'none';
                passwordField.required = false;
            }
        } else if (mode === 'view') {
            modalTitle.textContent = 'Chi Tiết Nhân Viên';
            currentStaffId = employee ? employee.id : null;
            if (employee) {
                fillFormWithEmployeeData(employee);
            }
            setFormReadOnly(true);

            // Ẩn field password khi xem
            const passwordField = document.getElementById('staffPassword');
            if (passwordField && passwordField.closest('.form-group')) {
                passwordField.closest('.form-group').style.display = 'none';
            }
        }
    }

    // Hiển thị modal
    staffModal.classList.add('active');

    // Nếu là chế độ xem, ẩn nút lưu
    const saveBtn = document.getElementById('saveStaffBtn');
    if (saveBtn) {
        saveBtn.style.display = mode === 'view' ? 'none' : 'block';
    }
}

// ========= HÀM ĐIỀN DỮ LIỆU NHÂN VIÊN VÀO FORM =========
function fillFormWithEmployeeData(employee) {
    if (!employee) {
        console.warn('Không có dữ liệu nhân viên để điền vào form');
        return;
    }

    const staffName = document.getElementById('staffName');
    const staffCode = document.getElementById('staffCode');
    const staffEmail = document.getElementById('staffEmail');
    const staffPhone = document.getElementById('staffPhone');
    const staffRole = document.getElementById('staffRole');

    if (staffName) staffName.value = employee.full_name || '';
    if (staffCode) staffCode.value = employee.username || '';
    if (staffEmail) staffEmail.value = employee.email || '';
    if (staffPhone) staffPhone.value = employee.phone || '';
    if (staffRole) staffRole.value = employee.role || 'employee';

    // Chuyển đổi position từ backend sang frontend để hiển thị đúng
    const staffDepartment = document.getElementById('staffDepartment');
    if (staffDepartment) {
        let positionValue = employee.position || 'staff';
        if (positionValue === 'Sell') positionValue = 'sales';
        else if (positionValue === 'Warehouse employee') positionValue = 'warehouse';
        else if (positionValue === 'Accountant') positionValue = 'accounting';
        staffDepartment.value = positionValue;
    }

    const staffSalary = document.getElementById('staffSalary');
    if (staffSalary) staffSalary.value = employee.salary || 0;

    // Format date for input field
    const staffJoinDate = document.getElementById('staffJoinDate');
    if (staffJoinDate && employee.hire_date) {
        try {
            const date = new Date(employee.hire_date);
            const formattedDate = date.toISOString().split('T')[0];
            staffJoinDate.value = formattedDate;
        } catch (error) {
            console.error('Lỗi format ngày:', error);
        }
    }

    // Chuyển đổi status từ backend sang frontend
    const frontendStatus = EmployeesHelper.convertStatusToFrontend(employee.status || 'active');
    const statusRadio = document.querySelector(`input[name="staffStatus"][value="${frontendStatus}"]`);
    if (statusRadio) {
        statusRadio.checked = true;
    } else {
        // Nếu không tìm thấy radio button, mặc định chọn 'active'
        const defaultRadio = document.querySelector(`input[name="staffStatus"][value="active"]`);
        if (defaultRadio) defaultRadio.checked = true;
    }

    // Hiển thị avatar nếu có
    if (employee.avatar) {
        const avatarPreview = document.getElementById('avatarPreview');
        if (avatarPreview) {
            const avatarImg = avatarPreview.querySelector('img');
            if (avatarImg) {
                avatarImg.src = employee.avatar;
                avatarPreview.style.display = 'block';
            }
        }
    }
}

// ========= HÀM ĐẶT FORM Ở CHẾ ĐỈ CHỈ ĐỌC =========
function setFormReadOnly(readonly) {
        if (!staffForm) {
            console.error('staffForm không tồn tại');
            return;
        }
    
    const formElements = staffForm.querySelectorAll('input, select, textarea, button');
    formElements.forEach(element => {
        if (element.type !== 'radio' && element.type !== 'checkbox') {
            element.disabled = readonly;
        }
    });

    // Ẩn nút upload avatar
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.style.display = readonly ? 'none' : 'block';
    }
}

// ========= HÀM THÊM/CHỈNH SỬA NHÂN VIÊN =========
async function saveEmployee() {
    try {
        // Lấy dữ liệu từ form
        const employeeData = {
            username: document.getElementById('staffCode').value.trim(),
            full_name: document.getElementById('staffName').value.trim(),
            phone: document.getElementById('staffPhone').value.trim(),
            role: document.getElementById('staffRole').value,
            position: EmployeesHelper.convertPositionToBackend(document.getElementById('staffDepartment').value),
            salary: parseFloat(document.getElementById('staffSalary').value),
            hire_date: document.getElementById('staffJoinDate').value,
            email: document.getElementById('staffEmail').value.trim(),
            status: EmployeesHelper.convertStatusToBackend(
                document.querySelector('input[name="staffStatus"]:checked')?.value || 'active'
            )
        };

        // Validate dữ liệu
        if (!validateEmployeeData(employeeData, currentStaffId ? 'edit' : 'add')) {
            return;
        }

        let result;
        if (currentStaffId) {
            // Cập nhật nhân viên
            console.log('Updating employee:', employeeData);
            result = await EmployeesAPI.update(currentStaffId, employeeData);
            if (result.success) {
                showToast('success', 'Thành công!', 'Cập nhật nhân viên thành công');
            }
        } else {
            // Thêm nhân viên mới - thêm mật khẩu
            const passwordField = document.getElementById('staffPassword');
            if (passwordField) {
                employeeData.password = passwordField.value.trim();
            } else {
                employeeData.password = 'Password123!'; // Mật khẩu mặc định nếu không có field
            }

            console.log('Creating employee:', employeeData);
            result = await EmployeesAPI.create(employeeData);
            if (result.success) {
                showToast('success', 'Thành công!', 'Thêm nhân viên mới thành công');
            }
        }

        if (result.success) {
            // Đóng modal
            closeStaffModal();

            // Tải lại danh sách nhân viên
            await loadEmployees();
        }
    } catch (error) {
        console.error('Lỗi khi lưu nhân viên:', error);
        showToast('error', 'Lỗi!', error.message || 'Không thể lưu thông tin nhân viên');
    }
}

// ========= HÀM VALIDATE DỮ LIỆU NHÂN VIÊN =========
function validateEmployeeData(data, mode = 'add') {
    // Kiểm tra tên không được trống
    if (!data.full_name.trim()) {
        showToast('error', 'Lỗi!', 'Vui lòng nhập họ và tên');
        document.getElementById('staffName').focus();
        return false;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('error', 'Lỗi!', 'Vui lòng nhập email hợp lệ');
        document.getElementById('staffEmail').focus();
        return false;
    }

    // Kiểm tra username không được trống
    if (!data.username.trim()) {
        showToast('error', 'Lỗi!', 'Vui lòng nhập mã nhân viên');
        document.getElementById('staffCode').focus();
        return false;
    }

    // Kiểm tra số điện thoại (nếu có)
    if (data.phone && !/^\d{10,15}$/.test(data.phone)) {
        showToast('error', 'Lỗi!', 'Số điện thoại không hợp lệ');
        document.getElementById('staffPhone').focus();
        return false;
    }

    // Kiểm tra lương
    if (data.salary <= 0) {
        showToast('error', 'Lỗi!', 'Lương phải lớn hơn 0');
        document.getElementById('staffSalary').focus();
        return false;
    }

    // Kiểm tra ngày vào làm
    if (!data.hire_date) {
        showToast('error', 'Lỗi!', 'Vui lòng chọn ngày vào làm');
        document.getElementById('staffJoinDate').focus();
        return false;
    }

    // Kiểm tra mật khẩu khi thêm mới
    if (mode === 'add') {
        const passwordField = document.getElementById('staffPassword');
        if (passwordField && passwordField.value.trim().length < 6) {
            showToast('error', 'Lỗi!', 'Mật khẩu phải có ít nhất 6 ký tự');
            passwordField.focus();
            return false;
        }
    }

    return true;
}

// ========= HÀM XÓA NHÂN VIÊN =========
async function deleteEmployeeInternal(id, employeeName = '') {
    // ✅ Lưu ID dưới dạng số
    currentStaffId = parseInt(id);

    console.log('[Delete] Setting currentStaffId to:', currentStaffId); // Debug

    const deleteNameEl = document.getElementById('deleteStaffName');

    // Nếu có tên nhân viên (khi gọi từ nút xóa)
    if (employeeName) {
        if (deleteNameEl) deleteNameEl.textContent = employeeName;
    } else {
        // Lấy tên nhân viên từ API
        try {
            const result = await EmployeesAPI.getById(currentStaffId);
            if (result.success && deleteNameEl) {
                deleteNameEl.textContent = result.data.full_name || 'Nhân viên này';
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin nhân viên:', error);
            if (deleteNameEl) deleteNameEl.textContent = 'Nhân viên này';
        }
    }

    // Hiển thị modal xác nhận xóa
    if (deleteModal) {
        deleteModal.classList.add('active');
    }
}

// ========= HÀM XÁC NHẬN XÓA NHÂN VIÊN =========
async function confirmDelete() {
    try {
        console.log('[Confirm Delete] Deleting staff ID:', currentStaffId); // Debug

        if (!currentStaffId) {
            showToast('error', 'Lỗi!', 'Không tìm thấy nhân viên để xóa');
            return;
        }

        // Tìm row của employee trong table
        const row = document.querySelector(`tr[data-employee-id="${currentStaffId}"]`);
        
        if (row) {
            // Thêm hiệu ứng shake trước
            row.classList.add('deleting-shake');
            
            // Sau khi shake xong, thêm hiệu ứng slide out
            setTimeout(() => {
                row.classList.remove('deleting-shake');
                row.classList.add('deleting-item');
            }, 500);
            
            // Đợi animation hoàn thành
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const result = await EmployeesAPI.delete(currentStaffId);
        if (result.success) {
            showToast('success', 'Thành công!', 'Xóa nhân viên thành công');
            closeDeleteModal();
            await loadEmployees();
        }
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        
        // Lấy chi tiết lỗi từ server
        let errorMessage = 'Không thể xóa nhân viên';
        const backendMessage = error.response?.data?.message;
        const statusCode = error.response?.status;

        if (backendMessage) {
            errorMessage = backendMessage;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Thông điệp thân thiện cho lỗi ràng buộc dữ liệu
        const lowerMsg = errorMessage.toLowerCase();
        if (statusCode === 400 || lowerMsg.includes('liên quan') || lowerMsg.includes('foreign key') ||
            lowerMsg.includes('constraint') || lowerMsg.includes('reference')) {
            errorMessage = 'Không thể xóa vì nhân viên đang được tham chiếu ở dữ liệu khác (hóa đơn, phiếu nhập, chấm công...). Hãy xóa hoặc chuyển dữ liệu liên quan trước.';
        }
        
        showToast('error', 'Lỗi!', errorMessage);
        closeDeleteModal();
    }
}

// ========= HÀM ĐÓNG MODAL =========
function closeStaffModal() {
    if (staffModal) {
        staffModal.classList.remove('active');
    }
    if (staffForm) {
        staffForm.reset();
    }
    setFormReadOnly(false);
    currentStaffId = null;

    // Hiển thị lại field password
    const passwordField = document.getElementById('staffPassword');
    if (passwordField && passwordField.closest('.form-group')) {
        passwordField.closest('.form-group').style.display = 'block';
        passwordField.required = true;
    }
}

function closeDeleteModal() {
    if (deleteModal) {
        deleteModal.classList.remove('active');
    }
    currentStaffId = null;
}

// ========= HÀM XỬ LÝ UPLOAD AVATAR =========
function setupAvatarUpload() {
    const avatarUpload = document.getElementById('avatarUpload');
    if (!avatarUpload) return;

    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);

    avatarUpload.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra kích thước file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('error', 'Lỗi!', 'File ảnh quá lớn (tối đa 5MB)');
                return;
            }

            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                showToast('error', 'Lỗi!', 'Vui lòng chọn file ảnh');
                return;
            }

            // Hiển thị preview
            const reader = new FileReader();
            reader.onload = function (e) {
                const avatarPreview = document.getElementById('avatarPreview');
                const avatarImg = avatarPreview.querySelector('img');
                avatarImg.src = e.target.result;
                avatarPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// ========= HÀM XỬ LÝ BỘ LỌC =========
function setupFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchBox = document.querySelector('.search-box input');

    if (!applyFiltersBtn || !clearFiltersBtn) return;

    applyFiltersBtn.addEventListener('click', async () => {
        const filters = {};

        if (roleFilter && roleFilter.value) filters.role = roleFilter.value;
        if (statusFilter && statusFilter.value) {
            // Chuyển đổi status từ frontend sang backend
            let backendStatus = statusFilter.value;
            if (backendStatus === 'onleave') backendStatus = 'take a break';
            filters.status = backendStatus;
        }
        if (departmentFilter && departmentFilter.value) {
            // Chuyển đổi department từ frontend sang backend
            filters.position = EmployeesHelper.convertPositionToBackend(departmentFilter.value);
        }

        // Gọi API với bộ lọc
        try {
            const result = await EmployeesAPI.getAll({
                ...filters,
                per_page: rowsPerPage,
                page: currentPage
            });

            if (result.success) {
                allEmployees = result.data.data;
                totalEmployees = result.data.total;
                renderEmployees(allEmployees);
                updatePagination();
                showToast('success', 'Thành công!', 'Đã áp dụng bộ lọc');
            }
        } catch (error) {
            console.error('Lỗi khi áp dụng bộ lọc:', error);
            showToast('error', 'Lỗi!', 'Không thể áp dụng bộ lọc');
        }
    });

    clearFiltersBtn.addEventListener('click', () => {
        if (roleFilter) roleFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        if (departmentFilter) departmentFilter.value = '';
        if (sortFilter) sortFilter.value = 'name-asc';
        if (searchBox) searchBox.value = '';

        showToast('info', 'Thông tin', 'Đã xóa bộ lọc');
    });

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            clearFiltersBtn.click();
            loadEmployees();
        });
    }

    // Tìm kiếm với debounce
    if (searchBox) {
        let searchTimeout;
        searchBox.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    try {
                        const result = await EmployeesAPI.getAll({
                            search: searchTerm,
                            per_page: rowsPerPage,
                            page: currentPage
                        });

                        if (result.success) {
                            allEmployees = result.data.data;
                            totalEmployees = result.data.total;
                            renderEmployees(allEmployees);
                            updatePagination();
                        }
                    } catch (error) {
                        console.error('Lỗi khi tìm kiếm:', error);
                    }
                } else {
                    loadEmployees();
                }
            }, 500);
        });
    }
}

// ========= HÀM SETUP PHÂN TRANG =========
function setupPagination() {
    const firstPageBtn = document.getElementById('firstPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const lastPageBtn = document.getElementById('lastPage');
    const rowsPerPageSelect = document.getElementById('rowsPerPage');

    if (firstPageBtn) {
        firstPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage = 1;
                loadEmployees();
            }
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadEmployees();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(totalEmployees / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                loadEmployees();
            }
        });
    }

    if (lastPageBtn) {
        lastPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(totalEmployees / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage = totalPages;
                loadEmployees();
            }
        });
    }

    // Thay đổi số dòng mỗi trang
    if (rowsPerPageSelect) {
        rowsPerPageSelect.addEventListener('change', (e) => {
            rowsPerPage = parseInt(e.target.value);
            currentPage = 1;
            loadEmployees();
        });
    }
}

// ========= HÀM SETUP SELECT ALL =========
function setupSelectAll() {
    if (!selectAllCheckbox) return;

    selectAllCheckbox.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.staff-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            const staffId = parseInt(checkbox.value);
            if (this.checked) {
                selectedStaffIds.add(staffId);
            } else {
                selectedStaffIds.delete(staffId);
            }
        });
    });
}

// ========= HÀM SETUP BUTTONS =========
function setupButtons() {
    // Nút thêm nhân viên
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', () => {
            openStaffModal('add');
        });
    }

    // Nút đóng modal
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeStaffModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeStaffModal);
    }

    // Nút lưu nhân viên
    const saveStaffBtn = document.getElementById('saveStaffBtn');
    if (saveStaffBtn) {
        saveStaffBtn.addEventListener('click', saveEmployee);
    }

    // Nút đóng modal xóa
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }

    // Nút xác nhận xóa
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }

    // Nút refresh
    const refreshTableBtn = document.getElementById('refreshTable');
    if (refreshTableBtn) {
        refreshTableBtn.addEventListener('click', loadEmployees);
    }

    // Nút export (chức năng mẫu)
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showToast('info', 'Thông tin', 'Chức năng export sẽ được phát triển sau');
        });
    }

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (e) => {
        if (e.target === staffModal) {
            closeStaffModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
}

// ========= HÀM KHỞI TẠO ỨNG DỤNG =========
async function initializeApp() {
    console.log('Đang khởi tạo ứng dụng quản lý nhân viên...');

    // Kiểm tra đăng nhập (tạm thời comment để test)
    // if (!EmployeesAPI.isAuthenticated()) {
    //     showToast('warning', 'Cảnh báo!', 'Vui lòng đăng nhập để tiếp tục');
    //     setTimeout(() => {
    //         window.location.href = '../login/login.html';
    //     }, 2000);
    //     return;
    // }

    // Cập nhật thông tin người dùng hiện tại
    const currentEmployee = EmployeesAPI.getCurrentEmployee();
    if (currentEmployee) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');

        if (userAvatar && currentEmployee.full_name) {
            const initials = currentEmployee.full_name
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);
            userAvatar.textContent = initials;
        }

        if (userName) {
            userName.textContent = currentEmployee.full_name || 'Admin';
        }

        if (userRole) {
            userRole.textContent = EmployeesHelper.formatRole(currentEmployee.role);
        }
    }

    // Setup các thành phần
    setupSidebar();
    setupAvatarUpload();
    setupFilters();
    setupPagination();
    setupSelectAll();
    setupButtons();

    // Tải dữ liệu ban đầu
    await loadEmployees();

    console.log('Ứng dụng đã được khởi tạo thành công!');
}

// ========= HÀM TOGGLE SIDEBAR =========
function setupSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const mainContent = document.querySelector('.main-content');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (mainContent) {
                mainContent.style.marginLeft = sidebar.classList.contains('collapsed') 
                    ? 'var(--sidebar-collapsed-width)' 
                    : 'var(--sidebar-width)';
            }
        });
    }

    // Menu items hover effect
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active từ tất cả items
            menuItems.forEach(i => i.classList.remove('active'));
            // Thêm active vào item được click
            this.classList.add('active');
        });
    });
}

// ========= CHẠY ỨNG DỤNG KHI TRANG ĐÃ TẢI XONG =========
document.addEventListener('DOMContentLoaded', initializeApp);

// ========= XUẤT CÁC HÀM CẦN THIẾT RA GLOBAL =========
window.loadEmployees = loadEmployees;
window.viewEmployee = viewEmployee;
window.editEmployee = async function (id) {
    try {
        const result = await EmployeesAPI.getById(id);
        if (result.success) {
            openStaffModal('edit', result.data);
        }
    } catch (error) {
        console.error('Lỗi khi tải thông tin nhân viên để chỉnh sửa:', error);
        showToast('error', 'Lỗi!', 'Không thể tải thông tin nhân viên');
    }
};

// ✅ Xuất hàm xóa - gọi trực tiếp với ID từ onclick
window.deleteEmployee = function (id) {
    console.log('[Global deleteEmployee] Called with ID:', id); // Debug
    const staffId = parseInt(id); // ✅ Chuyển thành số nguyên

    const employee = allEmployees.find(emp => emp.id === staffId);
    const employeeName = employee ? employee.full_name : '';

    deleteEmployeeInternal(staffId, employeeName);
};

window.confirmDelete = confirmDelete;

// ========= HÀM ĐĂNG NHẬP (nếu cần) =========
window.loginEmployee = async function (username, password) {
    try {
        const result = await EmployeesAPI.login({ username, password });
        if (result.success) {
            showToast('success', 'Thành công!', 'Đăng nhập thành công');
            return result;
        }
    } catch (error) {
        showToast('error', 'Lỗi!', error.message || 'Đăng nhập thất bại');
        throw error;
    }
};

// ========= HÀM ĐĂNG XUẤT =========
window.logoutEmployee = function () {
    EmployeesAPI.logout();
    showToast('success', 'Thành công!', 'Đăng xuất thành công');
    setTimeout(() => {
        window.location.href = '../login/login.html';
    }, 1000);
};