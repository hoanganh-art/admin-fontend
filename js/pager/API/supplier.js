// ============== CẤU HÌNH API =================
const API_BASE_URL = "http://127.0.0.1:6346";
const API_ENDPOINTS = {
    supplier: "/api/suppliers",
    supplierStats: "/api/suppliers/stats",
    supplierById: (id) => `/api/suppliers/${id}`,
    supplierCreate: "/api/suppliers",
};

// ============== BIẾN TOÀN CỤC ==============
let suppliersData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 12;
let selectedSuppliers = new Set();
let currentSort = 'name-asc';
let currentFilters = {
    category: '',
    status: '',
    rating: '',
    search: ''
};
let editingSupplierId = null;
let isLoading = false;

// ============== HÀM API =================

async function fetchSuppliers(params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}${API_ENDPOINTS.supplier}${queryString ? `?${queryString}` : ''}`;
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
        // Trả về dữ liệu mẫu nếu API lỗi
        return getMockSuppliers();
    }
}

async function fetchSupplierStats() {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.supplierStats}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        return {
            total: suppliersData.length,
            active: suppliersData.filter(s => s.status === 'active').length,
            inactive: suppliersData.filter(s => s.status === 'inactive').length,
            pending: suppliersData.filter(s => s.status === 'pending').length
        };
    }
}

async function fetchSupplierById(id) {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.supplierById(id)}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy NCC ${id}:`, error);
        const supplier = suppliersData.find(s => s.id == id);
        if (supplier) return supplier;
        throw error;
    }
}

async function createSupplier(supplierData) {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.supplierCreate}`;
        console.log('Creating supplier:', supplierData);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplierData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi tạo NCC:', error);
        return {
            success: true,
            message: 'Supplier created (mock)',
            id: Date.now(),
            ...supplierData
        };
    }
}

async function updateSupplier(id, supplierData) {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.supplierById(id)}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplierData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi cập nhật NCC ${id}:`, error);
        return { success: true, ...supplierData };
    }
}

async function deleteSupplierAPI(id) {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINTS.supplierById(id)}`;
        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi xóa NCC ${id}:`, error);
        return { success: true };
    }
}

// ============== DỮ LIỆU MẪU =================
function getMockSuppliers() {
    return [
        {
            id: 1,
            name: "Công ty TNHH Thế Giới Di Động",
            code: "NCC001",
            email: "contact@thegioididong.com",
            phone: "02838125999",
            categories: ["smartphone", "tablet", "accessory"],
            representative: "Nguyễn Văn A",
            representative_phone: "0909123456",
            rating: 4.5,
            status: "active",
            created_at: "2024-01-15",
            address: "123 Trần Hưng Đạo, Q.1, TP.HCM",
            tax_code: "0101234567",
            website: "https://www.thegioididong.com",
            payment_terms: "Thanh toán NET 30"
        },
        {
            id: 2,
            name: "Công ty CP Điện tử Samsung Vina",
            code: "NCC002",
            email: "info@samsung.com",
            phone: "02838119999",
            categories: ["smartphone", "tablet", "watch"],
            representative: "Trần Thị B",
            representative_phone: "0909876543",
            rating: 5,
            status: "active",
            created_at: "2024-02-20",
            address: "456 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM",
            tax_code: "0101234568",
            website: "https://www.samsung.com",
            payment_terms: "Thanh toán NET 45"
        },
        {
            id: 3,
            name: "Công ty Apple Việt Nam",
            code: "NCC003",
            email: "contact@apple.com",
            phone: "02846123456",
            categories: ["smartphone", "laptop", "accessory"],
            representative: "Lê Văn C",
            representative_phone: "0908765432",
            rating: 4.8,
            status: "active",
            created_at: "2024-03-10",
            address: "789 Lê Duẩn, Q.1, TP.HCM",
            tax_code: "0101234569",
            website: "https://www.apple.com",
            payment_terms: "Thanh toán NET 30"
        },
        {
            id: 4,
            name: "Công ty Xiaomi Việt Nam",
            code: "NCC004",
            email: "sales@xiaomi.com",
            phone: "02845678900",
            categories: ["smartphone", "accessory"],
            representative: "Phạm Thị D",
            representative_phone: "0907654321",
            rating: 4.2,
            status: "inactive",
            created_at: "2024-04-05",
            address: "321 Ngô Tất Tố, Q.3, TP.HCM",
            tax_code: "0101234570",
            website: "https://www.xiaomi.com",
            payment_terms: "Thanh toán NET 15"
        },
        {
            id: 5,
            name: "Công ty Oppo Việt Nam",
            code: "NCC005",
            email: "support@oppo.com",
            phone: "02843210987",
            categories: ["smartphone", "accessory"],
            representative: "Võ Văn E",
            representative_phone: "0906543210",
            rating: 4.0,
            status: "pending",
            created_at: "2024-05-12",
            address: "654 Hoàng Văn Thụ, Phú Nhuận, TP.HCM",
            tax_code: "0101234571",
            website: "https://www.oppo.com",
            payment_terms: "Thanh toán NET 20"
        },
        {
            id: 6,
            name: "Công ty Vivo Việt Nam",
            code: "NCC006",
            email: "contact@vivo.com",
            phone: "02842109876",
            categories: ["smartphone", "watch"],
            representative: "Trương Thị F",
            representative_phone: "0905432109",
            rating: 4.3,
            status: "active",
            created_at: "2024-06-18",
            address: "987 Cách Mạng Tháng 8, Q.10, TP.HCM",
            tax_code: "0101234572",
            website: "https://www.vivo.com",
            payment_terms: "Thanh toán NET 25"
        }
    ];
}

// ============== DOM ELEMENTS ==============

// Modal elements
const supplierModal = document.getElementById('supplierModal');
const deleteModal = document.getElementById('deleteModal');
const toast = document.getElementById('toast');

// Button elements
const addSupplierBtn = document.getElementById('addSupplierBtn');
const closeModal = document.getElementById('closeModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const saveSupplierBtn = document.getElementById('saveSupplierBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const closeToast = document.getElementById('closeToast');
const refreshTable = document.getElementById('refreshTable');
const exportBtn = document.getElementById('exportBtn');
const selectAll = document.getElementById('selectAll');

// Filter elements
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');
const ratingFilter = document.getElementById('ratingFilter');
const sortFilter = document.getElementById('sortFilter');
const applyFilters = document.getElementById('applyFilters');
const clearFilters = document.getElementById('clearFilters');
const resetFilters = document.getElementById('resetFilters');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const searchBox = document.querySelector('.search-box input');

// Pagination elements
const firstPage = document.getElementById('firstPage');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const lastPage = document.getElementById('lastPage');

// Form elements
const supplierForm = document.getElementById('supplierForm');
const supplierName = document.getElementById('supplierName');
const supplierCode = document.getElementById('supplierCode');
const supplierTax = document.getElementById('supplierTax');
const supplierEmail = document.getElementById('supplierEmail');
const supplierPhone = document.getElementById('supplierPhone');
const supplierCategory = document.getElementById('supplierCategory');
const supplierRep = document.getElementById('supplierRep');
const supplierRepPhone = document.getElementById('supplierRepPhone');
const supplierAddress = document.getElementById('supplierAddress');
const supplierWebsite = document.getElementById('supplierWebsite');
const supplierRating = document.getElementById('supplierRating');
const supplierTerms = document.getElementById('supplierTerms');

// Table body
const suppliersTableBody = document.getElementById('suppliersTableBody');

// Stat cards
const statCards = document.querySelectorAll('.stat-number');

// Loading overlay
let loadingOverlay;

// ============== HÀM KHỞI TẠO ==============

/**
 * HÀM 1: Khởi tạo ứng dụng
 */
async function init() {
    console.log('Khởi tạo ứng dụng quản lý nhà cung cấp...');
    createLoadingOverlay();
    await loadSuppliers();
    await updateStats();
    setupEventListeners();
    renderTable();
    console.log('Ứng dụng đã sẵn sàng!');
}

/**
 * HÀM 2: Tải dữ liệu nhà cung cấp từ API
 */
async function loadSuppliers() {
    try {
        showLoadingState();  // Hiển thị loading
        const response = await fetchSuppliers(currentFilters);
        
        // Xử lý response
        if (Array.isArray(response)) {
            suppliersData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
            suppliersData = response.data;
        } else {
            suppliersData = [];
        }

        filteredData = [...suppliersData];
        applySorting();
        console.log(`Đã tải ${suppliersData.length} nhà cung cấp`);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        showErrorState('Không thể tải dữ liệu nhà cung cấp. Vui lòng thử lại.');
        showToast('Lỗi', 'Không thể tải dữ liệu nhà cung cấp', 'error');
    }
}

/**
 * HÀM 3: Cập nhật thống kê
 */
async function updateStats() {
    try {
        const stats = await fetchSupplierStats();
        if (stats && typeof stats.total === 'number') {
            statCards[0].textContent = stats.total;
            statCards[1].textContent = stats.active;
            statCards[2].textContent = stats.inactive;
            statCards[3].textContent = stats.pending;
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật thống kê:', error);
    }
}

/**
 * HÀM 3.5: Hiển thị trạng thái loading dữ liệu
 */
function showLoadingState() {
    if (!suppliersTableBody) return;

    suppliersTableBody.innerHTML = `
        <tr>
            <td colspan="8">
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 40px; color: #4361ee; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 12px; color: #495057;">Đang tải dữ liệu...</h3>
                    <p style="color: #6c757d;">Vui lòng chờ trong giây lát</p>
                </div>
            </td>
        </tr>
    `;
}

/**
 * HÀM 3.6: Hiển thị thông báo lỗi
 */
function showErrorState(errorMessage) {
    if (!suppliersTableBody) return;

    suppliersTableBody.innerHTML = `
        <tr>
            <td colspan="8">
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #f72585; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 12px; color: #495057;">Đã xảy ra lỗi</h3>
                    <p style="color: #6c757d; margin-bottom: 20px;">${errorMessage}</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-primary" onclick="loadSuppliers(); renderTable();">
                            <i class="fas fa-redo"></i> Thử lại
                        </button>
                        <button class="btn btn-secondary" onclick="clearAllFilters();">
                            <i class="fas fa-times"></i> Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    `;
}

// ============== HÀM RENDER BẢNG ==============

/**
 * HÀM 4: Render bảng nhà cung cấp
 */
function renderTable() {
    if (!suppliersTableBody) return;

    suppliersTableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    updateTableInfo(paginatedData.length);

    if (paginatedData.length === 0) {
        suppliersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--gray-500);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; color: var(--gray-400);"></i>
                    <h3 style="margin-bottom: 8px; font-weight: 600;">Không tìm thấy nhà cung cấp</h3>
                    <p style="color: var(--gray-500);">Thử thay đổi bộ lọc hoặc thêm nhà cung cấp mới</p>
                </td>
            </tr>
        `;
        return;
    }

    paginatedData.forEach(supplier => {
        const row = createSupplierRow(supplier);
        suppliersTableBody.appendChild(row);
    });

    updatePagination();
}

/**
 * HÀM 5: Tạo một hàng trong bảng
 */
function createSupplierRow(supplier) {
    const tr = document.createElement('tr');
    const isSelected = selectedSuppliers.has(supplier.id);

    let statusClass = '';
    let statusText = '';
    switch (supplier.status) {
        case 'active':
            statusClass = 'status-active';
            statusText = 'Đang hợp tác';
            break;
        case 'inactive':
            statusClass = 'status-inactive';
            statusText = 'Tạm dừng';
            break;
        case 'pending':
            statusClass = 'status-pending';
            statusText = 'Chờ duyệt';
            break;
        default:
            statusClass = 'status-inactive';
            statusText = 'Không xác định';
    }

    tr.innerHTML = `
        <td>
            <input type="checkbox" class="supplier-checkbox" data-id="${supplier.id}" ${isSelected ? 'checked' : ''}>
        </td>
        <td>
            <div class="supplier-info">
                <div class="supplier-logo">
                    <span>${supplier.name.charAt(0).toUpperCase()}</span>
                </div>
                <div class="supplier-details">
                    <div class="supplier-name">${supplier.name}</div>
                    <div class="supplier-email">${supplier.email || 'Chưa có email'}</div>
                </div>
            </div>
        </td>
        <td>${supplier.code || 'N/A'}</td>
        <td>
            <div class="category-tags">
                ${(supplier.categories || []).map(cat =>
                `<span class="category-tag">${getCategoryName(cat)}</span>`
            ).join('')}
            </div>
        </td>
        <td>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    ${supplier.phone || 'Chưa có SĐT'}
                </div>
                <div class="contact-item">
                    <i class="fas fa-user-tie"></i>
                    ${supplier.representative || 'Chưa có đại diện'}
                </div>
            </div>
        </td>
        <td>
            <div class="rating-stars">
                ${generateStarRating(supplier.rating || 3)}
                <span class="rating-text">${supplier.rating || 3}/5</span>
            </div>
        </td>
        <td>
            <span class="status-badge ${statusClass}">
                <i class="fas fa-circle"></i>
                ${statusText}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn-action btn-view" data-id="${supplier.id}" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-edit" data-id="${supplier.id}" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" data-id="${supplier.id}" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;

    const viewBtn = tr.querySelector('.btn-view');
    const editBtn = tr.querySelector('.btn-edit');
    const deleteBtn = tr.querySelector('.btn-delete');
    const checkbox = tr.querySelector('.supplier-checkbox');

    viewBtn.addEventListener('click', () => viewSupplierDetails(supplier.id));
    editBtn.addEventListener('click', () => editSupplier(supplier.id));
    deleteBtn.addEventListener('click', () => openDeleteModal(supplier));
    checkbox.addEventListener('change', (e) => toggleSupplierSelection(supplier.id, e.target.checked));

    return tr;
}

// ============== HÀM EVENT LISTENERS ==============

/**
 * HÀM 6: Thiết lập tất cả event listeners
 */
function setupEventListeners() {
    addSupplierBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeSupplierModal);
    cancelBtn.addEventListener('click', closeSupplierModal);
    closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
    cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
    saveSupplierBtn.addEventListener('click', saveSupplier);
    confirmDeleteBtn.addEventListener('click', deleteSupplier);
    closeToast.addEventListener('click', hideToast);
    
    refreshTable.addEventListener('click', () => {
        loadSuppliers().then(() => {
            renderTable();
            showToast('Thành công', 'Đã làm mới dữ liệu', 'success');
        });
    });

    exportBtn.addEventListener('click', () => {
        showToast('Thông báo', 'Chức năng xuất Excel đang phát triển', 'info');
    });

    applyFilters.addEventListener('click', applyFilterChanges);
    clearFilters.addEventListener('click', clearAllFilters);
    resetFilters.addEventListener('click', resetAllFilters);

    rowsPerPageSelect.addEventListener('change', (e) => {
        rowsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderTable();
    });

    searchBox.addEventListener('input', debounce((e) => {
        currentFilters.search = e.target.value;
        filterSuppliers();
    }, 300));

    sortFilter.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applySorting();
        renderTable();
    });

    selectAll.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.supplier-checkbox');
        const isChecked = e.target.checked;

        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            toggleSupplierSelection(checkbox.getAttribute('data-id'), isChecked);
        });
    });

    firstPage.addEventListener('click', () => goToPage(1));
    prevPage.addEventListener('click', () => goToPage(currentPage - 1));
    nextPage.addEventListener('click', () => goToPage(currentPage + 1));
    lastPage.addEventListener('click', () => goToPage(Math.ceil(filteredData.length / rowsPerPage)));

    window.addEventListener('click', (e) => {
        if (e.target === supplierModal) closeSupplierModal();
        if (e.target === deleteModal) closeDeleteModalFunc();
    });

    // Thêm toggle sidebar
    const toggleSidebar = document.getElementById('toggleSidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        });
    }
}

// ============== HÀM MODAL ==============

/**
 * HÀM 7: Mở modal thêm nhà cung cấp
 */
function openAddModal() {
    editingSupplierId = null;
    document.getElementById('modalTitle').textContent = 'Thêm Nhà Cung Cấp Mới';
    resetForm();
    supplierModal.style.display = 'flex';
}

/**
 * HÀM 8: Mở modal chỉnh sửa nhà cung cấp
 */
async function editSupplier(id) {
    try {
        editingSupplierId = id;

        const supplier = await fetchSupplierById(id);
        fillFormWithData(supplier);

        document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Nhà Cung Cấp';
        supplierModal.style.display = 'flex';

    } catch (error) {
        console.error('Lỗi khi lấy thông tin nhà cung cấp:', error);
        showToast('Lỗi', 'Không thể tải thông tin nhà cung cấp', 'error');
    }
}

/**
 * HÀM 9: Điền dữ liệu vào form chỉnh sửa
 */
function fillFormWithData(supplier) {
    supplierName.value = supplier.name || '';
    supplierCode.value = supplier.code || '';
    supplierTax.value = supplier.tax_code || '';
    supplierEmail.value = supplier.email || '';
    supplierPhone.value = supplier.phone || '';
    supplierRep.value = supplier.representative || '';
    supplierRepPhone.value = supplier.representative_phone || '';
    supplierAddress.value = supplier.address || '';
    supplierWebsite.value = supplier.website || '';
    supplierRating.value = supplier.rating || 3;
    supplierTerms.value = supplier.payment_terms || '';

    if (supplier.categories && Array.isArray(supplier.categories)) {
        Array.from(supplierCategory.options).forEach(option => {
            option.selected = supplier.categories.includes(option.value);
        });
    }

    const statusRadio = document.querySelector(`input[name="supplierStatus"][value="${supplier.status || 'active'}"]`);
    if (statusRadio) statusRadio.checked = true;
}

/**
 * HÀM 10: Reset form
 */
function resetForm() {
    supplierForm.reset();
    supplierCategory.selectedIndex = -1;
    document.querySelector('input[name="supplierStatus"][value="active"]').checked = true;
    supplierRating.value = 3;
}

/**
 * HÀM 11: Đóng modal nhà cung cấp
 */
function closeSupplierModal() {
    supplierModal.style.display = 'none';
    resetForm();
    editingSupplierId = null;
}

// ============== HÀM LƯU NHÀ CUNG CẤP ==============

/**
 * HÀM 12: Lưu nhà cung cấp (thêm mới hoặc cập nhật)
 */
async function saveSupplier() {
    if (!validateForm()) {
        showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    try {
        const categories = Array.from(supplierCategory.selectedOptions).map(opt => opt.value);
        const status = document.querySelector('input[name="supplierStatus"]:checked').value;

        const supplierData = {
            name: supplierName.value.trim(),
            code: supplierCode.value.trim(),
            tax_code: supplierTax.value.trim(),
            email: supplierEmail.value.trim(),
            phone: supplierPhone.value.trim(),
            categories: categories,
            representative: supplierRep.value.trim(),
            representative_phone: supplierRepPhone.value.trim(),
            address: supplierAddress.value.trim(),
            website: supplierWebsite.value.trim(),
            rating: parseFloat(supplierRating.value),
            payment_terms: supplierTerms.value.trim(),
            status: status
        };

        let result;
        if (editingSupplierId) {
            result = await updateSupplier(editingSupplierId, supplierData);
            showToast('Thành công', 'Cập nhật nhà cung cấp thành công', 'success');
        } else {
            result = await createSupplier(supplierData);
            showToast('Thành công', 'Thêm nhà cung cấp thành công', 'success');
        }

        closeSupplierModal();
        await loadSuppliers();
        renderTable();
        await updateStats();

    } catch (error) {
        console.error('Lỗi khi lưu nhà cung cấp:', error);
        showToast('Lỗi', 'Không thể lưu nhà cung cấp', 'error');
    }
}

/**
 * HÀM 13: Validate form
 */
function validateForm() {
    const requiredFields = [
        supplierName,
        supplierCode,
        supplierTax,
        supplierEmail,
        supplierPhone,
        supplierRep,
        supplierRepPhone,
        supplierAddress
    ];

    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            field.style.borderColor = 'var(--danger-color)';
            return false;
        }
        field.style.borderColor = '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplierEmail.value.trim())) {
        supplierEmail.focus();
        showToast('Lỗi', 'Email không hợp lệ', 'error');
        return false;
    }

    return true;
}

// ============== HÀM XÓA NHÀ CUNG CẤP ==============

/**
 * HÀM 14: Mở modal xác nhận xóa
 */
function openDeleteModal(supplier) {
    document.getElementById('deleteSupplierName').textContent = supplier.name;
    deleteModal.style.display = 'flex';
    confirmDeleteBtn.setAttribute('data-supplier-id', supplier.id);
}

/**
 * HÀM 15: Đóng modal xóa
 */
function closeDeleteModalFunc() {
    deleteModal.style.display = 'none';
    confirmDeleteBtn.removeAttribute('data-supplier-id');
}

/**
 * HÀM 16: Xóa nhà cung cấp
 */
async function deleteSupplier() {
    const supplierId = confirmDeleteBtn.getAttribute('data-supplier-id');

    if (!supplierId) return;

    try {
        await deleteSupplierAPI(supplierId);

        suppliersData = suppliersData.filter(s => s.id != supplierId);
        filteredData = filteredData.filter(s => s.id != supplierId);

        closeDeleteModalFunc();
        showToast('Thành công', 'Xóa nhà cung cấp thành công', 'success');
        renderTable();
        await updateStats();

    } catch (error) {
        console.error('Lỗi khi xóa nhà cung cấp:', error);
        showToast('Lỗi', 'Không thể xóa nhà cung cấp', 'error');
    }
}

// ============== HÀM LỌC VÀ SẮP XẾP ==============

/**
 * HÀM 17: Lọc nhà cung cấp
 */
function filterSuppliers() {
    filteredData = suppliersData.filter(supplier => {
        let matches = true;

        // Lọc theo tìm kiếm
        if (currentFilters.search) {
            const search = currentFilters.search.toLowerCase();
            matches = matches && (
                supplier.name.toLowerCase().includes(search) ||
                supplier.code.toLowerCase().includes(search) ||
                supplier.email.toLowerCase().includes(search) ||
                supplier.phone.includes(search)
            );
        }

        // Lọc theo loại sản phẩm
        if (currentFilters.category) {
            matches = matches && supplier.categories && 
                supplier.categories.includes(currentFilters.category);
        }

        // Lọc theo trạng thái
        if (currentFilters.status) {
            matches = matches && supplier.status === currentFilters.status;
        }

        // Lọc theo xếp hạng
        if (currentFilters.rating) {
            matches = matches && supplier.rating >= parseFloat(currentFilters.rating);
        }

        return matches;
    });

    currentPage = 1;
    applySorting();
    renderTable();
}

/**
 * HÀM 18: Áp dụng thay đổi bộ lọc
 */
function applyFilterChanges() {
    currentFilters.category = categoryFilter.value;
    currentFilters.status = statusFilter.value;
    currentFilters.rating = ratingFilter.value;

    filterSuppliers();
    showToast('Thành công', 'Đã áp dụng bộ lọc', 'success');
}

/**
 * HÀM 19: Xóa tất cả bộ lọc
 */
function clearAllFilters() {
    categoryFilter.value = '';
    statusFilter.value = '';
    ratingFilter.value = '';
    sortFilter.value = 'name-asc';
    searchBox.value = '';

    currentFilters = {
        category: '',
        status: '',
        rating: '',
        search: ''
    };
    currentSort = 'name-asc';

    filterSuppliers();
    showToast('Thông báo', 'Đã xóa tất cả bộ lọc', 'info');
}

/**
 * HÀM 20: Reset bộ lọc
 */
function resetAllFilters() {
    clearAllFilters();
}

/**
 * HÀM 21: Áp dụng sắp xếp
 */
function applySorting() {
    filteredData.sort((a, b) => {
        switch (currentSort) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'date-asc':
                return new Date(a.created_at) - new Date(b.created_at);
            case 'date-desc':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'rating-desc':
                return b.rating - a.rating;
            case 'rating-asc':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });
}

// ============== HÀM PHÂN TRANG ==============

/**
 * HÀM 22: Điều hướng đến trang
 */
function goToPage(page) {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (page < 1) return;
    if (page > totalPages) return;

    currentPage = page;
    renderTable();
}

/**
 * HÀM 23: Cập nhật hiển thị phân trang
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    firstPage.disabled = currentPage === 1;
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
    lastPage.disabled = currentPage === totalPages;

    [firstPage, prevPage, nextPage, lastPage].forEach(btn => {
        btn.style.opacity = btn.disabled ? '0.5' : '1';
        btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
    });

    // Cập nhật số trang hiển thị
    const pagination = document.querySelector('.pagination');
    const pageButtons = pagination.querySelectorAll('.pagination-btn:not([id])');
    
    // Xóa các nút số trang cũ
    pageButtons.forEach(btn => btn.remove());
    
    // Thêm các nút số trang mới
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => goToPage(i));
        
        pagination.insertBefore(pageBtn, nextPage);
    }
}

/**
 * HÀM 24: Cập nhật thông tin bảng
 */
function updateTableInfo(displayedCount) {
    const tableInfo = document.querySelector('.table-info');
    if (tableInfo) {
        const totalCount = suppliersData.length;
        tableInfo.innerHTML = `Hiển thị <strong>${displayedCount}</strong> trong tổng số <strong>${totalCount}</strong> nhà cung cấp`;
    }
}

// ============== HÀM TIỆN ÍCH ==============

/**
 * HÀM 25: Tạo và quản lý loading overlay
 */
function createLoadingOverlay() {
    loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">Đang tải dữ liệu...</div>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

/**
 * HÀM 26: Hiển thị loading
 */
function showLoading(show) {
    isLoading = show;
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }
}

/**
 * HÀM 27: Hiển thị toast thông báo
 */
function showToast(title, message, type = 'success') {
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    switch (type) {
        case 'success':
            toastIcon.className = 'toast-icon success';
            toastIcon.innerHTML = '<i class="fas fa-check"></i>';
            toastIcon.style.background = 'linear-gradient(45deg, var(--success-color), #3b82f6)';
            break;
        case 'error':
            toastIcon.className = 'toast-icon error';
            toastIcon.innerHTML = '<i class="fas fa-times"></i>';
            toastIcon.style.background = 'linear-gradient(45deg, var(--danger-color), #dc2626)';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon warning';
            toastIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
            toastIcon.style.background = 'linear-gradient(45deg, var(--warning-color), #ff9e00)';
            break;
        case 'info':
            toastIcon.className = 'toast-icon info';
            toastIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
            toastIcon.style.background = 'linear-gradient(45deg, var(--info-color), var(--primary-color))';
            break;
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(hideToast, 5000);
}

/**
 * HÀM 28: Ẩn toast thông báo
 */
function hideToast() {
    toast.classList.remove('show');
}

/**
 * HÀM 29: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * HÀM 30: Tạo HTML cho đánh giá sao
 */
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }

    return stars;
}

/**
 * HÀM 31: Lấy tên loại sản phẩm
 */
function getCategoryName(categoryCode) {
    const categories = {
        'smartphone': 'Điện thoại',
        'tablet': 'Máy tính bảng',
        'accessory': 'Phụ kiện',
        'watch': 'Đồng hồ thông minh',
        'laptop': 'Laptop',
        'component': 'Linh kiện',
        'battery': 'Pin',
        'charger': 'Sạc',
        'case': 'Ốp lưng',
        'screen': 'Màn hình'
    };

    return categories[categoryCode] || categoryCode;
}

/**
 * HÀM 32: Xem chi tiết nhà cung cấp
 */
function viewSupplierDetails(id) {
    showToast('Thông báo', 'Chức năng xem chi tiết đang phát triển', 'info');
}

/**
 * HÀM 33: Chọn/bỏ chọn nhà cung cấp
 */
function toggleSupplierSelection(id, isSelected) {
    if (isSelected) {
        selectedSuppliers.add(parseInt(id));
    } else {
        selectedSuppliers.delete(parseInt(id));
    }

    if (selectedSuppliers.size > 0) {
        console.log(`Đã chọn ${selectedSuppliers.size} nhà cung cấp`);
    }
}

// ============== KHỞI CHẠY ỨNG DỤNG ==============

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}