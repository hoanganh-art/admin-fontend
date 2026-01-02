// ========== DỮ LIỆU MẪU ==========
const sampleSuppliers = [
    {
        id: 1,
        name: "Công ty TNHH Thế Giới Di Động",
        code: "NCC001",
        tax: "0101234567",
        email: "contact@thegioididong.com",
        phone: "02838125999",
        categories: ["smartphone", "tablet", "accessory"],
        representative: "Nguyễn Văn A",
        repPhone: "0909123456",
        address: "128 Trần Quang Khải, P.Tân Định, Q.1, TP.HCM",
        website: "https://www.thegioididong.com",
        logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
        rating: 4.8,
        status: "active",
        terms: "Thanh toán 30 ngày, giao hàng trong 24h",
        joinDate: "2021-03-15"
    },
    {
        id: 2,
        name: "Công ty Cổ phần Điện Máy Xanh",
        code: "NCC002",
        tax: "0102345678",
        email: "supplier@dienmayxanh.com",
        phone: "02838271234",
        categories: ["smartphone", "tablet", "laptop"],
        representative: "Trần Thị B",
        repPhone: "0918234567",
        address: "342 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM",
        website: "https://www.dienmayxanh.com",
        logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
        rating: 4.5,
        status: "active",
        terms: "Thanh toán 45 ngày, giao hàng trong 48h",
        joinDate: "2021-05-20"
    },
    {
        id: 3,
        name: "Công ty TNHH FPT Shop",
        code: "NCC003",
        tax: "0103456789",
        email: "supply@fptshop.com.vn",
        phone: "02838456789",
        categories: ["smartphone", "tablet", "watch"],
        representative: "Lê Văn C",
        repPhone: "0927345678",
        address: "52 Nguyễn Chí Thanh, P.Láng Hạ, Q.Đống Đa, Hà Nội",
        website: "https://www.fptshop.com.vn",
        logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
        rating: 4.7,
        status: "active",
        terms: "Thanh toán 60 ngày, giao hàng trong 72h",
        joinDate: "2021-07-10"
    },
    {
        id: 4,
        name: "Công ty Cổ phần Viễn Thông A",
        code: "NCC004",
        tax: "0104567890",
        email: "info@vienthonga.com",
        phone: "02438567890",
        categories: ["smartphone", "accessory"],
        representative: "Phạm Thị D",
        repPhone: "0938456789",
        address: "15 Lê Duẩn, P.Bến Nghé, Q.1, TP.HCM",
        website: "https://www.vienthonga.com",
        logo: "https://images.unsplash.com/photo-1556740738-6eb8b55efa8e?w=400&h=200&fit=crop",
        rating: 4.2,
        status: "active",
        terms: "Thanh toán 15 ngày, giao hàng trong 24h",
        joinDate: "2021-09-05"
    },
    {
        id: 5,
        name: "Công ty TNHH CellphoneS",
        code: "NCC005",
        tax: "0105678901",
        email: "contact@cellphones.com.vn",
        phone: "02838678901",
        categories: ["smartphone", "tablet", "accessory", "watch"],
        representative: "Hoàng Văn E",
        repPhone: "0949567890",
        address: "631 Kinh Dương Vương, P.An Lạc, Q.Bình Tân, TP.HCM",
        website: "https://www.cellphones.com.vn",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
        rating: 4.9,
        status: "active",
        terms: "Thanh toán 30 ngày, giao hàng trong 12h",
        joinDate: "2021-11-15"
    },
    {
        id: 6,
        name: "Công ty Cổ phần Phụ Kiện X",
        code: "NCC006",
        tax: "0106789012",
        email: "sales@phukienx.com",
        phone: "02838789012",
        categories: ["accessory", "component"],
        representative: "Vũ Thị F",
        repPhone: "0950678901",
        address: "45 Nguyễn Văn Linh, P.Tân Phong, Q.7, TP.HCM",
        website: "https://www.phukienx.com",
        logo: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop",
        rating: 4.0,
        status: "active",
        terms: "Thanh toán COD, giao hàng trong 6h",
        joinDate: "2022-01-20"
    },
    {
        id: 7,
        name: "Công ty TNHH Pin Sạc Chính Hãng",
        code: "NCC007",
        tax: "0107890123",
        email: "info@pinsac.com",
        phone: "02838890123",
        categories: ["battery", "charger", "component"],
        representative: "Đặng Văn G",
        repPhone: "0961789012",
        address: "78 Lê Hồng Phong, P.3, Q.5, TP.HCM",
        website: "https://www.pinsac.com",
        logo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=200&fit=crop",
        rating: 3.8,
        status: "inactive",
        terms: "Thanh toán 50% trước, giao hàng trong 48h",
        joinDate: "2022-03-10"
    },
    {
        id: 8,
        name: "Công ty Cổ phần Màn Hình Máy Tính",
        code: "NCC008",
        tax: "0108901234",
        email: "support@manhinh.com",
        phone: "02838901234",
        categories: ["screen", "component"],
        representative: "Bùi Thị H",
        repPhone: "0972890123",
        address: "123 Trường Chinh, P.12, Q.Tân Bình, TP.HCM",
        website: "https://www.manhinh.com",
        logo: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop",
        rating: 4.1,
        status: "active",
        terms: "Thanh toán 30 ngày, bảo hành 12 tháng",
        joinDate: "2022-05-25"
    },
    {
        id: 9,
        name: "Công ty TNHH Ốp Lưng Cao Cấp",
        code: "NCC009",
        tax: "0109012345",
        email: "sales@oplung.com",
        phone: "02839012345",
        categories: ["case", "accessory"],
        representative: "Nguyễn Văn I",
        repPhone: "0983901234",
        address: "56 Võ Thị Sáu, P.6, Q.3, TP.HCM",
        website: "https://www.oplung.com",
        logo: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop",
        rating: 4.3,
        status: "active",
        terms: "Thanh toán 15 ngày, giao hàng trong 24h",
        joinDate: "2022-07-18"
    },
    {
        id: 10,
        name: "Công ty Cổ phần Đồng Hồ Thông Minh",
        code: "NCC010",
        tax: "0100123456",
        email: "contact@smartwatch.com",
        phone: "02839123456",
        categories: ["watch", "accessory"],
        representative: "Lý Thị K",
        repPhone: "0994012345",
        address: "89 Hai Bà Trưng, P.Bến Nghé, Q.1, TP.HCM",
        website: "https://www.smartwatch.com",
        logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop",
        rating: 4.6,
        status: "pending",
        terms: "Thanh toán 30 ngày, giao hàng trong 72h",
        joinDate: "2022-09-30"
    },
    {
        id: 11,
        name: "Công ty TNHH Laptop Việt",
        code: "NCC011",
        tax: "0101234568",
        email: "info@laptopviet.com",
        phone: "02839234567",
        categories: ["laptop", "accessory"],
        representative: "Trần Văn L",
        repPhone: "0915123456",
        address: "234 Nguyễn Thị Minh Khai, P.6, Q.3, TP.HCM",
        website: "https://www.laptopviet.com",
        logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=200&fit=crop",
        rating: 4.4,
        status: "active",
        terms: "Thanh toán 45 ngày, bảo hành 24 tháng",
        joinDate: "2022-11-12"
    },
    {
        id: 12,
        name: "Công ty Cổ phần Linh Kiện Điện Tử",
        code: "NCC012",
        tax: "0102345679",
        email: "sales@linhkien.com",
        phone: "02839345678",
        categories: ["component", "accessory"],
        representative: "Phan Thị M",
        repPhone: "0926234567",
        address: "78 Lý Thường Kiệt, P.7, Q.10, TP.HCM",
        website: "https://www.linhkien.com",
        logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
        rating: 3.9,
        status: "active",
        terms: "Thanh toán COD, giao hàng trong 48h",
        joinDate: "2023-01-08"
    }
];

// ========== KHỞI TẠO BIẾN ==========
let currentPage = 1;
let rowsPerPage = 12;
let filteredSuppliers = [...sampleSuppliers];
let supplierToDelete = null;
let isEditing = false;
let currentSupplierId = null;

// DOM Elements
const toggleSidebar = document.getElementById('toggleSidebar');
const addSupplierBtn = document.getElementById('addSupplierBtn');
const supplierModal = document.getElementById('supplierModal');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.getElementById('closeModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const saveSupplierBtn = document.getElementById('saveSupplierBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const suppliersTableBody = document.getElementById('suppliersTableBody');
const selectAll = document.getElementById('selectAll');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');
const ratingFilter = document.getElementById('ratingFilter');
const sortFilter = document.getElementById('sortFilter');
const applyFilters = document.getElementById('applyFilters');
const clearFilters = document.getElementById('clearFilters');
const resetFilters = document.getElementById('resetFilters');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const refreshTable = document.getElementById('refreshTable');
const exportBtn = document.getElementById('exportBtn');
const searchInput = document.querySelector('.search-box input');
const modalTitle = document.getElementById('modalTitle');
const deleteSupplierName = document.getElementById('deleteSupplierName');
const supplierForm = document.getElementById('supplierForm');
const logoUpload = document.getElementById('logoUpload');
const logoPreview = document.getElementById('logoPreview');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const closeToast = document.getElementById('closeToast');

// ========== SIDEBAR TOGGLE ==========
toggleSidebar.addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    const icon = this.querySelector('i');
    icon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        icon.style.transform = '';
    }, 300);
});

// ========== MENU ACTIVE STATE ==========
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// ========== RENDER BẢNG NHÀ CUNG CẤP ==========
function renderSuppliersTable() {
    suppliersTableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const suppliersToShow = filteredSuppliers.slice(start, end);

    if (suppliersToShow.length === 0) {
        suppliersTableBody.innerHTML = `
                    <tr>
                        <td colspan="8">
                            <div class="empty-state">
                                <i class="fas fa-truck-loading"></i>
                                <h3>Không tìm thấy nhà cung cấp</h3>
                                <p>Không có nhà cung cấp nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                                <button class="btn btn-primary" onclick="clearAllFilters()">
                                    <i class="fas fa-times"></i>
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
        return;
    }

    suppliersToShow.forEach(supplier => {
        const categoriesText = getCategoriesText(supplier.categories);
        const statusClass = getStatusClass(supplier.status);
        const statusText = getStatusText(supplier.status);
        const ratingStars = getRatingStars(supplier.rating);

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <input type="checkbox" class="supplier-checkbox" data-id="${supplier.id}">
                    </td>
                    <td>
                        <div class="supplier-info">
                            <div class="supplier-logo">
                                <img src="${supplier.logo}" alt="${supplier.name}">
                            </div>
                            <div class="supplier-details">
                                <div class="supplier-name">${supplier.name}</div>
                                <div class="supplier-category">${categoriesText}</div>
                            </div>
                        </div>
                    </td>
                    <td class="supplier-id">${supplier.code}</td>
                    <td>${categoriesText}</td>
                    <td>
                        <div class="supplier-contacts">
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                ${supplier.phone}
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                ${supplier.email}
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="supplier-rating">
                            ${ratingStars}
                            <span class="rating-value">${supplier.rating.toFixed(1)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        <div class="supplier-actions">
                            <button class="action-btn view" onclick="viewSupplier(${supplier.id})" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn products" onclick="viewProducts(${supplier.id})" title="Sản phẩm">
                                <i class="fas fa-box"></i>
                            </button>
                            <button class="action-btn edit" onclick="editSupplier(${supplier.id})" title="Chỉnh sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="showDeleteModal(${supplier.id}, '${supplier.name}')" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
        suppliersTableBody.appendChild(row);
    });

    updateTableInfo();
    updatePagination();
}

// ========== HÀM HỖ TRỢ ==========
function getCategoriesText(categories) {
    const categoryMap = {
        'smartphone': 'Điện thoại',
        'tablet': 'Máy tính bảng',
        'accessory': 'Phụ kiện',
        'watch': 'Đồng hồ',
        'laptop': 'Laptop',
        'component': 'Linh kiện',
        'battery': 'Pin',
        'charger': 'Sạc',
        'case': 'Ốp lưng',
        'screen': 'Màn hình'
    };

    return categories.map(cat => categoryMap[cat] || cat).join(', ');
}

function getStatusClass(status) {
    return `status-${status}`;
}

function getStatusText(status) {
    const texts = {
        'active': 'Đang hợp tác',
        'inactive': 'Tạm dừng',
        'pending': 'Chờ duyệt'
    };
    return texts[status] || status;
}

function getRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star rating-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt rating-star"></i>';
        } else {
            stars += '<i class="far fa-star rating-star"></i>';
        }
    }

    return stars;
}

function updateTableInfo() {
    const total = filteredSuppliers.length;
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, total);
    const infoElement = document.querySelector('.table-info');
    if (infoElement) {
        infoElement.innerHTML = `Hiển thị <strong>${start}-${end}</strong> trong tổng số <strong>${total}</strong> nhà cung cấp`;
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    const numberButtons = paginationContainer.querySelectorAll('.pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)');

    // Cập nhật số trang
    numberButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
            btn.textContent = pageNum;
            btn.style.display = 'flex';
            btn.classList.toggle('active', pageNum === currentPage);
        } else {
            btn.style.display = 'none';
        }
    });

    // Cập nhật trạng thái nút điều hướng
    document.getElementById('firstPage').disabled = currentPage === 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('lastPage').disabled = currentPage === totalPages;
}

// ========== FILTER FUNCTIONS ==========
function applySupplierFilters() {
    filteredSuppliers = sampleSuppliers.filter(supplier => {
        // Lọc theo loại sản phẩm
        if (categoryFilter.value && !supplier.categories.includes(categoryFilter.value)) {
            return false;
        }

        // Lọc theo trạng thái
        if (statusFilter.value && supplier.status !== statusFilter.value) {
            return false;
        }

        // Lọc theo xếp hạng
        if (ratingFilter.value && supplier.rating < parseFloat(ratingFilter.value)) {
            return false;
        }

        return true;
    });

    // Sắp xếp
    applySorting();

    currentPage = 1;
    renderSuppliersTable();
}

function applySorting() {
    const sortValue = sortFilter.value;
    filteredSuppliers.sort((a, b) => {
        switch (sortValue) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'date-asc':
                return new Date(a.joinDate) - new Date(b.joinDate);
            case 'date-desc':
                return new Date(b.joinDate) - new Date(a.joinDate);
            case 'rating-desc':
                return b.rating - a.rating;
            case 'rating-asc':
                return a.rating - b.rating;
            default:
                return 0;
        }
    });
}

function clearAllFilters() {
    categoryFilter.value = '';
    statusFilter.value = '';
    ratingFilter.value = '';
    sortFilter.value = 'name-asc';
    searchInput.value = '';
    filteredSuppliers = [...sampleSuppliers];
    currentPage = 1;
    renderSuppliersTable();
    showToast('Thành công', 'Đã xóa tất cả bộ lọc', 'success');
}

// ========== MODAL FUNCTIONS ==========
function openSupplierModal(editMode = false, supplierData = null) {
    if (editMode && supplierData) {
        modalTitle.textContent = 'Chỉnh Sửa Nhà Cung Cấp';
        isEditing = true;
        currentSupplierId = supplierData.id;

        // Điền dữ liệu vào form
        document.getElementById('supplierName').value = supplierData.name;
        document.getElementById('supplierCode').value = supplierData.code;
        document.getElementById('supplierTax').value = supplierData.tax;
        document.getElementById('supplierEmail').value = supplierData.email;
        document.getElementById('supplierPhone').value = supplierData.phone;

        // Đặt loại sản phẩm
        const categorySelect = document.getElementById('supplierCategory');
        Array.from(categorySelect.options).forEach(option => {
            option.selected = supplierData.categories.includes(option.value);
        });

        document.getElementById('supplierRep').value = supplierData.representative;
        document.getElementById('supplierRepPhone').value = supplierData.repPhone;
        document.getElementById('supplierAddress').value = supplierData.address;
        document.getElementById('supplierWebsite').value = supplierData.website || '';
        document.getElementById('supplierRating').value = Math.round(supplierData.rating).toString();
        document.getElementById('supplierTerms').value = supplierData.terms || '';

        // Đặt trạng thái
        const statusRadio = document.querySelector(`input[name="supplierStatus"][value="${supplierData.status}"]`);
        if (statusRadio) statusRadio.checked = true;

        // Hiển thị logo preview
        if (supplierData.logo) {
            logoPreview.style.display = 'block';
            logoPreview.querySelector('img').src = supplierData.logo;
        }
    } else {
        modalTitle.textContent = 'Thêm Nhà Cung Cấp Mới';
        isEditing = false;
        currentSupplierId = null;

        // Đặt ngày mặc định là hôm nay
        const today = new Date().toISOString().split('T')[0];

        supplierForm.reset();
        logoPreview.style.display = 'none';

        // Đặt giá trị mặc định cho rating
        document.getElementById('supplierRating').value = '3';
    }

    supplierModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSupplierModalFunc() {
    supplierModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    supplierForm.reset();
    logoPreview.style.display = 'none';
    isEditing = false;
    currentSupplierId = null;
}

function saveSupplier() {
    // Lấy dữ liệu từ form
    const categorySelect = document.getElementById('supplierCategory');
    const selectedCategories = Array.from(categorySelect.selectedOptions).map(option => option.value);

    const formData = {
        id: isEditing ? currentSupplierId : sampleSuppliers.length + 1,
        name: document.getElementById('supplierName').value,
        code: document.getElementById('supplierCode').value,
        tax: document.getElementById('supplierTax').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        categories: selectedCategories,
        representative: document.getElementById('supplierRep').value,
        repPhone: document.getElementById('supplierRepPhone').value,
        address: document.getElementById('supplierAddress').value,
        website: document.getElementById('supplierWebsite').value,
        rating: parseFloat(document.getElementById('supplierRating').value),
        status: document.querySelector('input[name="supplierStatus"]:checked').value,
        terms: document.getElementById('supplierTerms').value,
        logo: logoPreview.style.display === 'block' ?
            logoPreview.querySelector('img').src :
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
        joinDate: new Date().toISOString().split('T')[0]
    };

    // Validate dữ liệu
    if (!formData.name || !formData.code || !formData.tax || !formData.email ||
        !formData.phone || formData.categories.length === 0 || !formData.representative ||
        !formData.repPhone || !formData.address) {
        showToast('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showToast('Lỗi', 'Email không hợp lệ', 'error');
        return;
    }

    // Validate tax code (10-13 số)
    const taxRegex = /^\d{10,13}$/;
    if (!taxRegex.test(formData.tax)) {
        showToast('Lỗi', 'Mã số thuế phải có 10-13 chữ số', 'error');
        return;
    }

    // Hiệu ứng loading
    saveSupplierBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    saveSupplierBtn.disabled = true;

    // Giả lập lưu dữ liệu
    setTimeout(() => {
        if (isEditing) {
            // Cập nhật nhà cung cấp
            const index = sampleSuppliers.findIndex(s => s.id === currentSupplierId);
            if (index !== -1) {
                sampleSuppliers[index] = formData;
            }
        } else {
            // Thêm nhà cung cấp mới
            sampleSuppliers.unshift(formData);
        }

        // Cập nhật UI
        applySupplierFilters();
        closeSupplierModalFunc();

        // Hiển thị thông báo
        showToast(
            'Thành công',
            isEditing ? 'Đã cập nhật nhà cung cấp thành công' : 'Đã thêm nhà cung cấp mới thành công',
            'success'
        );

        // Reset nút
        saveSupplierBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Nhà Cung Cấp';
        saveSupplierBtn.disabled = false;

    }, 1500);
}

function showDeleteModal(supplierId, supplierName) {
    supplierToDelete = supplierId;
    deleteSupplierName.textContent = supplierName;
    deleteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModalFunc() {
    deleteModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    supplierToDelete = null;
}

function deleteSupplier() {
    if (!supplierToDelete) return;

    // Hiệu ứng loading
    confirmDeleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
    confirmDeleteBtn.disabled = true;

    // Giả lập xóa
    setTimeout(() => {
        const index = sampleSuppliers.findIndex(s => s.id === supplierToDelete);
        if (index !== -1) {
            sampleSuppliers.splice(index, 1);
        }

        // Cập nhật UI
        applySupplierFilters();
        closeDeleteModalFunc();

        // Hiển thị thông báo
        showToast('Thành công', 'Đã xóa nhà cung cấp thành công', 'success');

        // Reset nút
        confirmDeleteBtn.innerHTML = '<i class="fas fa-trash"></i> Xóa Nhà Cung Cấp';
        confirmDeleteBtn.disabled = false;

    }, 1000);
}

function viewSupplier(supplierId) {
    const supplier = sampleSuppliers.find(s => s.id === supplierId);
    if (supplier) {
        showToast(
            'Thông tin nhà cung cấp',
            `${supplier.name} - ${supplier.code} - Xếp hạng: ${supplier.rating.toFixed(1)}/5`,
            'success'
        );
    }
}

function viewProducts(supplierId) {
    const supplier = sampleSuppliers.find(s => s.id === supplierId);
    if (supplier) {
        showToast(
            'Sản phẩm từ nhà cung cấp',
            `${supplier.name} cung cấp: ${getCategoriesText(supplier.categories)}`,
            'success'
        );
    }
}

function editSupplier(supplierId) {
    const supplier = sampleSuppliers.find(s => s.id === supplierId);
    if (supplier) {
        openSupplierModal(true, supplier);
    }
}

// ========== TOAST NOTIFICATION ==========
function showToast(title, message, type = 'success') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Đổi màu và icon theo type
    const icon = toastIcon.querySelector('i');
    switch (type) {
        case 'success':
            toastIcon.className = 'toast-icon success';
            icon.className = 'fas fa-check';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon warning';
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            toastIcon.className = 'toast-icon error';
            icon.className = 'fas fa-times';
            break;
    }

    toast.classList.add('show');

    // Tự động đóng sau 5 giây
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ========== EVENT LISTENERS ==========
// Modal events
addSupplierBtn.addEventListener('click', () => openSupplierModal());
closeModal.addEventListener('click', closeSupplierModalFunc);
closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
cancelBtn.addEventListener('click', closeSupplierModalFunc);
cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
saveSupplierBtn.addEventListener('click', saveSupplier);
confirmDeleteBtn.addEventListener('click', deleteSupplier);

// Filter events
applyFilters.addEventListener('click', applySupplierFilters);
clearFilters.addEventListener('click', () => {
    categoryFilter.value = '';
    statusFilter.value = '';
    ratingFilter.value = '';
    sortFilter.value = 'name-asc';
    applySupplierFilters();
    showToast('Thành công', 'Đã xóa bộ lọc', 'success');
});

resetFilters.addEventListener('click', clearAllFilters);
sortFilter.addEventListener('change', applySupplierFilters);
ratingFilter.addEventListener('change', applySupplierFilters);

// Search event
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredSuppliers = sampleSuppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm) ||
            supplier.code.toLowerCase().includes(searchTerm) ||
            supplier.email.toLowerCase().includes(searchTerm) ||
            supplier.phone.includes(searchTerm) ||
            supplier.representative.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderSuppliersTable();
        showToast('Tìm kiếm', `Tìm thấy ${filteredSuppliers.length} nhà cung cấp phù hợp`, 'success');
    }
});

// Pagination events
rowsPerPageSelect.addEventListener('change', (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderSuppliersTable();
});

refreshTable.addEventListener('click', () => {
    filteredSuppliers = [...sampleSuppliers];
    currentPage = 1;
    renderSuppliersTable();
    showToast('Thành công', 'Đã làm mới danh sách nhà cung cấp', 'success');
});

exportBtn.addEventListener('click', () => {
    showToast('Xuất file', 'Đang xuất dữ liệu nhà cung cấp ra file Excel...', 'success');
});

// Select all checkbox
selectAll.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.supplier-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
});

// Pagination button events
document.getElementById('firstPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage = 1;
        renderSuppliersTable();
    }
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderSuppliersTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderSuppliersTable();
    }
});

document.getElementById('lastPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage = totalPages;
        renderSuppliersTable();
    }
});

// Logo upload simulation
logoUpload.addEventListener('click', () => {
    // Trong thực tế, đây sẽ là input file thực
    const fakeLogoUrl = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop';
    logoPreview.style.display = 'block';
    logoPreview.querySelector('img').src = fakeLogoUrl;
    showToast('Tải logo', 'Đã tải logo lên thành công', 'success');
});

// Close toast
closeToast.addEventListener('click', () => {
    toast.classList.remove('show');
});

// Đóng modal khi click bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === supplierModal) closeSupplierModalFunc();
    if (e.target === deleteModal) closeDeleteModalFunc();
});

// ========== KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', () => {
    // Render bảng nhà cung cấp ban đầu
    renderSuppliersTable();

    // Thêm hiệu ứng load cho các stat cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});