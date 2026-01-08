// ============================================
// 🏪 PHẦN 1: CẤU HÌNH API & SERVICE
// ============================================

// ========== CẤU HÌNH API ENDPOINTS ==========
// 📍 Địa chỉ backend server
const API_BASE_URL = "http://127.0.0.1:6346/api";

// 📋 Danh sách các API endpoints (đường dẫn API) cho Suppliers
const API_ENDPOINTS = {
    suppliers: "/suppliers",          // Lấy danh sách nhà cung cấp
    stats: "/suppliers/stats",        // Lấy thống kê nhà cung cấp
    supplierById: (id) => `/suppliers/${id}`, // Lấy thông tin chi tiết nhà cung cấp theo ID
};

// ========== LỚP API SERVICE ==========
// 🚀 Lớp SupplierAPIService - chứa tất cả phương thức gọi API liên quan đến nhà cung cấp
class SupplierAPIService {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.headers = {
            "Content-Type": "application/json", // Dữ liệu gửi đi là JSON
            Accept: "application/json",         // Chấp nhận dữ liệu trả về là JSON
        };
    }

    /**
     * 🔄 Hàm request chung để gọi API
     */
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            console.log("🔗 Requesting URL:", url);

            const response = await fetch(url, {
                ...options,
                headers: { ...this.headers, ...options.headers },
            });

            let data;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
            } catch (e) {
                data = null;
            }

            if (!response.ok) {
                // Handle different error response formats
                let errorMessage = `HTTP ${response.status} Error`;

                if (data) {
                    if (data.message) {
                        errorMessage = data.message;
                    } else if (data.error) {
                        errorMessage = data.error;
                    } else if (typeof data === 'string') {
                        errorMessage = data;
                    }
                }

                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            console.log('✅ API response received:', data);
            return data;

        } catch (error) {
            console.error("💥 API Error:", error.message);
            throw error;
        }
    }

    /**
     * 📋 Lấy danh sách nhà cung cấp
     */
    async getSuppliers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString
            ? `${API_ENDPOINTS.suppliers}?${queryString}`
            : API_ENDPOINTS.suppliers;

        return this.request(endpoint);
    }

    /**
     * 🔍 Lấy nhà cung cấp theo ID
     */
    async getSupplierById(id) {
        return this.request(API_ENDPOINTS.supplierById(id));
    }

    /**
     * ➕ Tạo nhà cung cấp mới
     */
    async createSupplier(supplierData) {
        console.log("📤 Creating supplier with data:", supplierData);
        console.log("🔗 POST URL:", `${this.baseUrl}${API_ENDPOINTS.suppliers}`);

        try {
            const response = await this.request(API_ENDPOINTS.suppliers, {
                method: "POST",
                body: JSON.stringify(supplierData),
            });
            console.log("✅ createSupplier response:", response);
            return response;
        } catch (error) {
            console.error("❌ createSupplier error:", error);
            throw error;
        }
    }

    /**
     * ✏️ Cập nhật nhà cung cấp
     */
    async updateSupplier(id, supplierData) {
        console.log("🔄 Updating supplier ID:", id, "with data:", supplierData);
        return this.request(API_ENDPOINTS.supplierById(id), {
            method: "PUT",
            body: JSON.stringify(supplierData),
        });
    }

    /**
     * 🗑️ Xóa nhà cung cấp
     */
    async deleteSupplier(id) {
        return this.request(API_ENDPOINTS.supplierById(id), {
            method: "DELETE",
        });
    }

    /**
     * 📊 Lấy thống kê nhà cung cấp
     */
    async getStats() {
        return this.request(API_ENDPOINTS.stats);
    }
}

// Tạo instance toàn cục của API Service
const supplierAPI = new SupplierAPIService();

// ============================================
// 🏪 PHẦN 2: QUẢN LÝ NHÀ CUNG CẤP - BIẾN VÀ DOM
// ============================================

// ========== BIẾN TOÀN CỤC ==========
let currentPage = 1;
let rowsPerPage = 12;
let filteredSuppliers = [];
let supplierToDelete = null;
let isEditing = false;
let currentSupplierId = null;

// ========== DOM ELEMENTS ==========
let suppliersTableBody, statusFilter, searchInput, rowsPerPageSelect;
let addSupplierBtn, applyFilters, clearFilters;
let categoryFilter, ratingFilter, sortFilter;

// ============================================
// 🏪 PHẦN 3: HÀM CHÍNH - HIỂN THỊ NHÀ CUNG CẤP
// ============================================

/**
 * 📋 Lấy và hiển thị danh sách nhà cung cấp
 */
async function renderSuppliersTable() {
    try {
        showLoadingState();

        // Tạo đối tượng filter
        const filters = {
            page: currentPage,
            per_page: rowsPerPage,
            ...(statusFilter && statusFilter.value && { status: statusFilter.value }),
            ...(categoryFilter && categoryFilter.value && { category: categoryFilter.value }),
            ...(ratingFilter && ratingFilter.value && { rating: ratingFilter.value }),
            ...(sortFilter && sortFilter.value && { sort: sortFilter.value }),
            ...(searchInput && searchInput.value.trim() && { search: searchInput.value.trim() })
        };

        console.log("🔍 Filter parameters:", filters);

        // Gọi API lấy dữ liệu
        const response = await supplierAPI.getSuppliers(filters);
        console.log('📊 API Response:', response);

        // Xử lý response
        let suppliers = [];
        let paginationData = {};

        if (Array.isArray(response)) {
            // Nếu response là array trực tiếp
            suppliers = response;
            paginationData = {
                current_page: 1,
                total: suppliers.length,
                per_page: rowsPerPage,
                last_page: 1,
                from: 1,
                to: Math.min(suppliers.length, rowsPerPage)
            };
        } else if (response.data && Array.isArray(response.data)) {
            // Laravel paginate
            suppliers = response.data;
            paginationData = {
                current_page: response.current_page || 1,
                total: response.total || 0,
                per_page: response.per_page || rowsPerPage,
                last_page: response.last_page || 1,
                from: response.from || 1,
                to: response.to || Math.min(suppliers.length, rowsPerPage)
            };
        } else if (response.success && response.data && Array.isArray(response.data)) {
            // Response với success flag
            suppliers = response.data;
            paginationData = {
                current_page: response.current_page || 1,
                total: response.total || suppliers.length,
                per_page: response.per_page || rowsPerPage,
                last_page: response.last_page || 1,
                from: response.from || 1,
                to: response.to || Math.min(suppliers.length, rowsPerPage)
            };
        }

        console.log(`📦 Lấy được ${suppliers.length} nhà cung cấp`);

        if (suppliers.length > 0) {
            filteredSuppliers = suppliers;
            renderSuppliersList(suppliers);
            updateTableInfo(paginationData);
            updatePaginationInfo(paginationData);
        } else {
            filteredSuppliers = [];
            renderSuppliersList([]);
            updateTableInfo({ total: 0, from: 0, to: 0 });
        }

    } catch (error) {
        console.error("💥 Lỗi khi tải nhà cung cấp:", error);
        showErrorState(error.message);
        showToast("Lỗi", `Không thể tải dữ liệu: ${error.message}`, "error");
    }
}

/**
 * 📊 Hiển thị danh sách nhà cung cấp lên bảng
 */
function renderSuppliersList(suppliers) {
    if (!suppliersTableBody) return;

    suppliersTableBody.innerHTML = "";

    if (!suppliers || suppliers.length === 0) {
        suppliersTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i class="fas fa-building" style="color: #6c757d; font-size: 32px; margin-bottom: 16px;"></i>
            <h3 style="margin-bottom: 12px;">Không tìm thấy nhà cung cấp</h3>
            <p style="color: #6c757d; margin-bottom: 16px;">
              Không có nhà cung cấp nào phù hợp với tiêu chí tìm kiếm của bạn.
            </p>
            <button class="btn btn-primary" onclick="clearAllFilters()">
              <i class="fas fa-times"></i> Xóa tất cả bộ lọc
            </button>
          </div>
        </td>
      </tr>
    `;
        return;
    }

    // Duyệt qua từng nhà cung cấp và tạo row cho bảng
    suppliers.forEach((supplier, index) => {
        // CHUẨN HÓA DỮ LIỆU NHÀ CUNG CẤP
        const supplierId = supplier.id || supplier.supplier_id;
        const supplierName = supplier.supplier_name || supplier.name || 'N/A';
        const supplierCode = supplier.code || supplier.supplier_code || 'N/A';
        const categories = parseProductTypes(supplier.product_types) ||
            supplier.categories ||
            supplier.category ||
            supplier.product_category ||
            supplier.product_type || [];
        const contactInfo = supplier.contact_info || `${supplier.phone || ''}<br>${supplier.email || ''}`;
        const rating = supplier.rating || 0;
        const status = supplier.status || 'active';
        const phone = supplier.phone || supplier.phone_number || 'N/A';
        const email = supplier.email || 'N/A';
        const address = supplier.address || 'N/A';
        const representative = supplier.representative || supplier.contact_person || 'N/A';

        // Debug log để kiểm tra dữ liệu từ server
        if (index === 0) {
            console.log('🔍 DEBUG - Dữ liệu supplier đầu tiên:', {
                id: supplierId,
                name: supplierName,
                phone: phone,
                rawPhone: supplier.phone,
                rawPhoneNumber: supplier.phone_number,
                representative: representative,
                rawRepresentative: supplier.representative,
                categories: categories,
                rawProductTypes: supplier.product_types,
                rawCategories: supplier.categories,
                rawCategory: supplier.category,
                rawProductCategory: supplier.product_category,
                rawProductType: supplier.product_type,
                allFields: Object.keys(supplier)
            });
        }

        // Format categories thành text
        let categoryText = "Không xác định";
        if (Array.isArray(categories) && categories.length > 0) {
            categoryText = categories.map(cat => getCategoryText(cat)).join(', ');
        } else if (typeof categories === 'string' && categories) {
            categoryText = getCategoryText(categories);
        }

        // Tạo HTML cho rating (sao)
        const ratingStars = getRatingStars(rating);

        // Tạo HTML cho status badge
        const statusBadge = getStatusBadge(status);

        // Tạo HTML cho mỗi row nhà cung cấp
        const row = document.createElement("tr");
        row.setAttribute("data-supplier-id", supplierId);
        row.innerHTML = `
      <td>
        <input type="checkbox" class="supplier-checkbox" data-id="${supplierId}">
      </td>
      <td>
        <div class="supplier-info">
          <div class="supplier-name">${supplierName}</div>
        </div>
      </td>
      <td>${supplierCode}</td>
      <td>
  <div class="product-categories">
    <div class="category-tags">
      ${getCategoryTags(supplier.product_types)}
    </div>
  </div>
</td>
      <td>
        <div class="contact-info">
          <div><i class="fas fa-phone"></i> ${phone}</div>
          <div><i class="fas fa-envelope"></i> ${email}</div>
        </div>
      </td>
      <td>
        <div class="rating-stars">
          ${ratingStars}
          <span class="rating-text">(${rating})</span>
        </div>
      </td>
      <td>${statusBadge}</td>
      <td>
        <div class="supplier-actions">
          <button class="action-btn view" onclick="viewSupplier(${supplierId})" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editSupplier(${supplierId})" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="showDeleteModal(${supplierId}, '${escapeHtml(supplierName)}')" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
        suppliersTableBody.appendChild(row);
    });
}

/**
 * 🔄 Parse dữ liệu product_types từ database bị lỗi encoding
 */
function parseProductTypes(data) {
    if (!data) return [];
    
    console.log('🔍 Raw product_types data:', data);
    
    // 1. Nếu đã là array hợp lệ
    if (Array.isArray(data)) {
        return data.filter(item => item && item.trim().length > 0);
    }
    
    // 2. Nếu là string
    if (typeof data === 'string') {
        let str = data.trim();
        
        // Dọn dẹp ký tự đặc biệt
        str = str
            .replace(/\\"/g, '"')      // Thay \" thành "
            .replace(/\\'/g, "'")      // Thay \' thành '
            .replace(/[\\]/g, '')      // Xóa \
            .replace(/[\[\]]/g, '')    // Xóa [ và ]
            .replace(/\s+/g, ' ')      // Chuẩn hóa khoảng trắng
            .trim();
        
        console.log('🧹 Cleaned string:', str);
        
        // Trường hợp 1: ["smartphone", "tablet"]
        if (str.startsWith('"') && str.endsWith('"')) {
            str = str.slice(1, -1);
        }
        
        // Trường hợp 2: ['smartphone', 'tablet']
        if (str.startsWith("'") && str.endsWith("'")) {
            str = str.slice(1, -1);
        }
        
        // Split bằng dấu phẩy
        const items = str.split(/[',"]\s*['",]?/)
            .map(item => item.trim())
            .filter(item => {
                // Lọc các giá trị rỗng và từ không cần thiết
                const cleanItem = item.replace(/['"]/g, '').trim();
                return cleanItem.length > 0 && 
                       !['', 'null', 'undefined'].includes(cleanItem.toLowerCase());
            })
            .map(item => item.replace(/['"]/g, '').trim());
        
        console.log('📦 Parsed items:', items);
        return items;
    }
    
    return [];
}

/**
 * 🏷️ Tạo HTML cho các tag loại sản phẩm
 */
function getCategoryTags(categories) {
    // Parse dữ liệu trước
    const parsedCategories = parseProductTypes(categories);
    
    if (!parsedCategories || parsedCategories.length === 0) {
        return '<span class="category-tag empty">Không xác định</span>';
    }
    
    // Tạo tag HTML
    const tags = parsedCategories
        .filter(cat => cat && cat.trim().length > 0)
        .map(cat => {
            const categoryText = getCategoryText(cat);
            const categoryClass = getCategoryClass(cat);
            return `<span class="category-tag ${categoryClass}">${categoryText}</span>`;
        })
        .join('');
    
    return tags || '<span class="category-tag empty">Không xác định</span>';
}

/**
 * 🎨 Lấy class CSS cho từng loại sản phẩm
 */
function getCategoryClass(category) {
    const cat = category.toLowerCase();
    if (cat.includes('smartphone') || cat.includes('phone')) return 'smartphone';
    if (cat.includes('tablet')) return 'tablet';
    if (cat.includes('accessory')) return 'accessory';
    if (cat.includes('laptop')) return 'laptop';
    if (cat.includes('watch')) return 'watch';
    if (cat.includes('component')) return 'component';
    return '';
}
/**
 * ⭐ Tạo HTML cho rating stars
 */
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHtml = '';

    // Thêm sao đầy
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }

    // Thêm sao nửa (nếu có)
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    // Thêm sao rỗng
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }

    return starsHtml;
}

/**
 * 🏷️ Tạo HTML cho status badge
 */
function getStatusBadge(status) {
    const statusMap = {
        "active": { text: "Đang hợp tác", class: "status-badge active" },
        "inactive": { text: "Tạm dừng", class: "status-badge inactive" },
        "pending": { text: "Chờ duyệt", class: "status-badge pending" }
    };

    const statusConfig = statusMap[status] || { text: status, class: "status-badge" };
    return `<span class="${statusConfig.class}">${statusConfig.text}</span>`;
}

/**
 * 📁 Chuyển mã danh mục thành tên tiếng Việt
 */
function getCategoryText(category) {
    const categoryMap = {
        smartphone: "Điện thoại",
        tablet: "Máy tính bảng",
        accessory: "Phụ kiện",
        watch: "Đồng hồ thông minh",
        laptop: "Laptop",
        component: "Linh kiện",
        battery: "Pin",
        charger: "Sạc",
        case: "Ốp lưng",
        screen: "Màn hình"
    };
    return categoryMap[category.toLowerCase()] || category || "Không xác định";
}


/**
 * 🛡️ Escape HTML để tránh XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// 🏪 PHẦN 4: PHÂN TRANG VÀ THỐNG KÊ
// ============================================

/**
 * 📊 Cập nhật thông tin phân trang
 */
function updateTableInfo(paginationData) {
    if (!paginationData) return;

    const total = paginationData.total || 0;
    const from = paginationData.from || 0;
    const to = paginationData.to || 0;

    const infoElement = document.querySelector(".table-info");
    if (infoElement) {
        infoElement.innerHTML = `
      Hiển thị <strong>${from}-${to}</strong> trong tổng số <strong>${total}</strong> nhà cung cấp
    `;
    }
}

/**
 * 🔢 Cập nhật thông tin phân trang
 */
function updatePaginationInfo(paginationData) {
    if (!paginationData) return;

    const currentPageNum = paginationData.current_page || paginationData.page || 1;
    const totalItems = paginationData.total || 0;
    const itemsPerPage = paginationData.per_page || rowsPerPage || 12;
    const totalPages = paginationData.last_page || Math.ceil(totalItems / itemsPerPage) || 1;

    updatePaginationButtons(currentPageNum, totalPages);
}

/**
 * 🎛️ Cập nhật giao diện các nút phân trang
 */
function updatePaginationButtons(currentPageNum, totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    const pageButtons = paginationContainer.querySelectorAll(
        '.pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)'
    );

    let startPage = Math.max(1, currentPageNum - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    pageButtons.forEach((btn, index) => {
        const pageNum = startPage + index;

        if (pageNum <= endPage && pageNum <= totalPages) {
            btn.textContent = pageNum;
            btn.style.display = 'flex';
            btn.classList.toggle('active', pageNum === currentPageNum);
            btn.onclick = () => {
                currentPage = pageNum;
                renderSuppliersTable();
            };
        } else {
            btn.style.display = 'none';
        }
    });

    // Cập nhật nút điều hướng
    const firstPageBtn = document.getElementById("firstPage");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const lastPageBtn = document.getElementById("lastPage");

    if (firstPageBtn) firstPageBtn.disabled = currentPageNum === 1;
    if (prevPageBtn) prevPageBtn.disabled = currentPageNum === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPageNum === totalPages;
    if (lastPageBtn) lastPageBtn.disabled = currentPageNum === totalPages;

    // Gán sự kiện cho nút điều hướng
    if (firstPageBtn) firstPageBtn.onclick = () => {
        if (currentPageNum > 1) {
            currentPage = 1;
            renderSuppliersTable();
        }
    };
    if (prevPageBtn) prevPageBtn.onclick = () => {
        if (currentPageNum > 1) {
            currentPage--;
            renderSuppliersTable();
        }
    };
    if (nextPageBtn) nextPageBtn.onclick = () => {
        if (currentPageNum < totalPages) {
            currentPage++;
            renderSuppliersTable();
        }
    };
    if (lastPageBtn) lastPageBtn.onclick = () => {
        if (currentPageNum < totalPages) {
            currentPage = totalPages;
            renderSuppliersTable();
        }
    };
}

/**
 * � Lấy thống kê nhà cung cấp từ API
 */
async function loadStats() {
    try {
        const response = await supplierAPI.getStats();
        console.log('📊 Stats data:', response);

        // Xử lý response
        let stats = {};
        if (response.success && response.data) {
            stats = response.data;
        } else if (response.data) {
            stats = response.data;
        } else {
            stats = response;
        }

        // Cập nhật các thẻ thống kê
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = stats.total || stats.total_suppliers || 0;
            statNumbers[1].textContent = stats.active || stats.active_count || 0;
            statNumbers[2].textContent = stats.inactive || stats.inactive_count || 0;
            statNumbers[3].textContent = stats.pending || stats.pending_count || 0;
        }

    } catch (error) {
        console.error("❌ Lỗi khi tải thống kê:", error);
    }
}

/**
 * 📥 Xuất dữ liệu sang Excel
 */
function exportToExcel() {
    if (!filteredSuppliers || filteredSuppliers.length === 0) {
        showToast("Lỗi", "Không có dữ liệu để xuất", "error");
        return;
    }

    try {
        // Tạo CSV content
        let csvContent = "data:text/csv;charset=utf-8,";

        // Header
        const headers = ["Tên NCC", "Mã NCC", "Email", "Số ĐT", "Loại SP", "Xếp Hạng", "Trạng Thái", "Địa Chỉ"];
        csvContent += headers.join(",") + "\n";

        // Data rows
        filteredSuppliers.forEach(supplier => {
            const row = [
                `"${supplier.supplier_name || supplier.name || ''}"`,
                supplier.code || supplier.supplier_code || '',
                supplier.email || '',
                supplier.phone || supplier.phone_number || '',
                getCategoryText(supplier.categories?.[0] || supplier.category || ''),
                supplier.rating || '0',
                getStatusText(supplier.status || 'active'),
                `"${supplier.address || ''}"`
            ];
            csvContent += row.join(",") + "\n";
        });

        // Tạo link download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `suppliers_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);

        showToast("Thành công", `Đã xuất ${filteredSuppliers.length} nhà cung cấp`, "success");
    } catch (error) {
        console.error("❌ Lỗi khi xuất Excel:", error);
        showToast("Lỗi", "Không thể xuất dữ liệu", "error");
    }
}

// ============================================
// 🏪 PHẦN 5: THAO TÁC NHÀ CUNG CẤP
// ============================================

/**
 * 👁️ Xem chi tiết nhà cung cấp
 */
async function viewSupplier(supplierId) {
    try {
        const response = await supplierAPI.getSupplierById(supplierId);
        console.log('👁️ View supplier response:', response);

        let supplier = response;
        if (response.success && response.data) {
            supplier = response.data;
        } else if (response.data) {
            supplier = response.data;
        }

        // Hiển thị modal chi tiết
        openDetailsModal(supplier);

    } catch (error) {
        console.error("❌ Lỗi khi xem chi tiết:", error);
        showToast("Lỗi", "Không thể tải thông tin nhà cung cấp", "error");
    }
}

/**
 * 📖 Mở modal xem chi tiết
 */
function openDetailsModal(supplier) {
    const modal = document.getElementById("supplierDetailsModal");
    if (!modal) return;

    // Lưu ID supplier hiện tại để dùng khi chỉnh sửa
    window.currentSupplierDetailsId = supplier.id || supplier.supplier_id;

    // Điền dữ liệu vào modal
    document.getElementById("detailName").textContent = supplier.supplier_name || supplier.name || 'N/A';
    document.getElementById("detailCode").textContent = supplier.code || supplier.supplier_code || 'N/A';
    document.getElementById("detailTax").textContent = supplier.tax_code || supplier.tax_number || 'N/A';

    const emailElement = document.getElementById("detailEmail");
    if (emailElement) {
        emailElement.textContent = supplier.email || 'N/A';
        if (supplier.email) {
            emailElement.href = `mailto:${supplier.email}`;
        }
    }

    const phoneElement = document.getElementById("detailPhone");
    if (phoneElement) {
        phoneElement.textContent = supplier.phone || supplier.phone_number || 'N/A';
        if (supplier.phone) {
            phoneElement.href = `tel:${supplier.phone}`;
        }
    }

    document.getElementById("detailRepresentative").textContent = supplier.representative || supplier.contact_person || 'N/A';
    document.getElementById("detailRepPhone").textContent = supplier.representative_phone || 'N/A';
    document.getElementById("detailRating").innerHTML = getRatingStars(supplier.rating || 0);
    document.getElementById("detailStatus").innerHTML = getStatusBadge(supplier.status || 'active');
    document.getElementById("detailAddress").textContent = supplier.address || 'N/A';

    const websiteElement = document.getElementById("detailWebsite");
    if (websiteElement) {
        websiteElement.textContent = supplier.website || supplier.website_url || 'N/A';
        if (supplier.website || supplier.website_url) {
            websiteElement.href = supplier.website || supplier.website_url;
        }
    }

    document.getElementById("detailPaymentTerms").textContent = supplier.payment_terms || supplier.terms || 'Không có';

    // Xử lý categories
    const categoriesContainer = document.getElementById("detailCategories");
    if (categoriesContainer) {
        categoriesContainer.innerHTML = '';
        const categories = supplier.categories || supplier.category || [];
        let categoriesArray = [];

        if (Array.isArray(categories)) {
            categoriesArray = categories;
        } else if (typeof categories === 'string') {
            categoriesArray = categories.split(',').map(cat => cat.trim());
        }

        categoriesArray.forEach(category => {
            if (category) {
                const span = document.createElement('span');
                span.className = 'category-tag';
                span.textContent = getCategoryText(category);
                categoriesContainer.appendChild(span);
            }
        });

        if (categoriesArray.length === 0) {
            categoriesContainer.innerHTML = '<span class="category-tag">Không xác định</span>';
        }
    }

    // Hiển thị modal
    modal.classList.add("active");
}

/**
 * ✏️ Lấy dữ liệu đầy đủ và mở modal chỉnh sửa nhà cung cấp
 */
async function editSupplier(supplierId) {
    try {
        console.log(`🔄 Bắt đầu lấy dữ liệu nhà cung cấp ID: ${supplierId}`);

        // MỞ MODAL TRƯỚC với loading state
        const supplierModal = document.getElementById("supplierModal");
        const modalTitle = document.getElementById("modalTitle");
        const supplierForm = document.getElementById("supplierForm");

        if (!supplierModal) {
            console.error("❌ Không tìm thấy #supplierModal");
            showToast("Lỗi", "Không tìm thấy modal", "error");
            return;
        }

        // Reset form và hiển thị loading state
        if (supplierForm) {
            supplierForm.reset();
            supplierForm.style.opacity = "0.5";
            supplierForm.style.pointerEvents = "none";
        }

        // Cập nhật tiêu đề
        if (modalTitle) {
            modalTitle.textContent = "Chỉnh Sửa Nhà Cung Cấp - Đang tải...";
        }

        // Mở modal ngay lập tức (người dùng thấy form)
        supplierModal.classList.add("active");
        showToast("Đang tải", "Đang tải thông tin nhà cung cấp...", "warning");

        // GỌI API để lấy dữ liệu
        const response = await supplierAPI.getSupplierById(supplierId);
        console.log('📥 Response từ API:', response);

        // Chuẩn hóa response
        let supplierData = null;

        console.log('📥 Response RAW từ API:', response);
        console.log('📊 Response Type:', typeof response);

        if (response) {
            console.log('📊 Response Keys:', Object.keys(response));
            if (response.data) {
                console.log('📊 Data Keys:', Object.keys(response.data));
            }
        }

        // Xử lý các kiểu response khác nhau
        if (response.success && response.data) {
            // Format: { success: true, data: {...} }
            supplierData = response.data;
            console.log("✅ Format: success + data");
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            // Format: { data: {...} }
            supplierData = response.data;
            console.log("✅ Format: data object");
        } else if (response.id || response.supplier_id) {
            // Format: Direct object with id
            supplierData = response;
            console.log("✅ Format: Direct object");
        } else if (Array.isArray(response) && response.length > 0) {
            // Nếu API trả array (không nên), lấy phần tử đầu tiên
            supplierData = response[0];
            console.log("✅ Format: Array (lấy phần tử đầu tiên)");
        }

        // Kiểm tra xem có dữ liệu không
        if (!supplierData || !supplierData.id && !supplierData.supplier_id) {
            throw new Error("Dữ liệu nhà cung cấp không hợp lệ");
        }

        console.log("📦 Dữ liệu đã chuẩn hóa:", {
            id: supplierData.id || supplierData.supplier_id,
            name: supplierData.supplier_name || supplierData.name,
            code: supplierData.code || supplierData.supplier_code,
            email: supplierData.email,
            phone: supplierData.phone || supplierData.phone_number,
            fields_count: Object.keys(supplierData).length
        });

        // XÓA loading state và FILL DỮ LIỆU vào form
        if (supplierForm) {
            supplierForm.style.opacity = "1";
            supplierForm.style.pointerEvents = "auto";
        }

        // Cập nhật tiêu đề
        if (modalTitle) {
            modalTitle.textContent = "Chỉnh Sửa Nhà Cung Cấp";
        }

        // Fill dữ liệu vào form modal
        fillEditForm(supplierData);
        showToast("Thành công", "Đã tải thông tin nhà cung cấp", "success");

    } catch (error) {
        console.error("💥 Lỗi khi chỉnh sửa:", error.message);

        // Đóng modal nếu có lỗi
        const supplierModal = document.getElementById("supplierModal");
        if (supplierModal) {
            supplierModal.classList.remove("active");
        }

        showToast("Lỗi", `Không thể tải thông tin nhà cung cấp: ${error.message}`, "error");
    }
}

/**
 * ⚠️ Hiển thị modal xác nhận xóa
 */
function showDeleteModal(supplierId, supplierName) {
    supplierToDelete = supplierId;

    const deleteSupplierName = document.getElementById("deleteSupplierName");
    if (deleteSupplierName) deleteSupplierName.textContent = supplierName;

    const deleteModal = document.getElementById("deleteModal");
    if (deleteModal) deleteModal.classList.add("active");
}

/**
 * 🗑️ Xóa nhà cung cấp sau khi xác nhận
 */
async function deleteSupplier() {
    if (!supplierToDelete) return;

    try {
        // Tìm row của supplier trong table
        const row = document.querySelector(`tr[data-supplier-id="${supplierToDelete}"]`);

        if (row) {
            row.classList.add('deleting-item');
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const response = await supplierAPI.deleteSupplier(supplierToDelete);
        console.log('🗑️ Delete response:', response);

        let success = false;
        if (response.success || response.status === 'success' ||
            (response.message && response.message.includes('thành công')) ||
            response === '') {
            success = true;
        }

        if (success) {
            closeDeleteModal();
            currentPage = 1;
            await renderSuppliersTable();
            showToast("Thành công", "Đã xóa nhà cung cấp thành công", "success");
        } else {
            const errorMsg = response?.message || "Không thể xóa nhà cung cấp";
            showToast("Lỗi", errorMsg, "error");
        }
    } catch (error) {
        console.error("❌ Lỗi khi xóa:", error);
        showToast("Lỗi", "Không thể xóa nhà cung cấp: " + error.message, "error");
    }
}

/**
 * ❌ Đóng modal xóa
 */
function closeDeleteModal() {
    const deleteModal = document.getElementById("deleteModal");
    if (deleteModal) deleteModal.classList.remove("active");
    supplierToDelete = null;
}

/**
 * 📝 Chuyển mã trạng thái thành text tiếng Việt
 */
function getStatusText(status) {
    const statusMap = {
        "active": "Đang hợp tác",
        "inactive": "Tạm dừng",
        "pending": "Chờ duyệt"
    };
    return statusMap[status] || status;
}

// ============================================
// 🏪 PHẦN 6: MODAL THÊM/SỬA NHÀ CUNG CẤP
// ============================================

/**
 * 📝 Mở modal thêm nhà cung cấp mới
 */
function openAddModal() {
    const supplierModal = document.getElementById("supplierModal");
    const modalTitle = document.getElementById("modalTitle");
    const supplierForm = document.getElementById("supplierForm");

    if (!supplierModal) {
        console.error("❌ Không tìm thấy #supplierModal");
        showToast("Lỗi", "Không tìm thấy modal", "error");
        return;
    }

    // Reset form
    if (supplierForm) {
        supplierForm.reset();
        // Reset multiple select
        const categorySelect = document.getElementById("supplierCategory");
        if (categorySelect) {
            Array.from(categorySelect.options).forEach(option => {
                option.selected = false;
            });
        }
    }

    // Reset logo preview
    const logoPreview = document.getElementById("logoPreview");
    if (logoPreview) logoPreview.style.display = 'none';

    // Cập nhật tiêu đề
    if (modalTitle) {
        modalTitle.textContent = "Thêm Nhà Cung Cấp Mới";
    }

    // Đánh dấu chế độ thêm
    isEditing = false;
    currentSupplierId = null;

    // Hiển thị modal
    supplierModal.classList.add("active");
}

/**
 * 📝 Điền dữ liệu vào form chỉnh sửa
 */
function fillEditForm(supplierData) {
    if (!supplierData) {
        console.error("❌ Dữ liệu nhà cung cấp trống");
        return;
    }

    const supplierId = supplierData.id || supplierData.supplier_id;
    if (!supplierId) {
        console.error("❌ Không tìm thấy ID nhà cung cấp");
        return;
    }

    console.log(`✅ Bắt đầu điền dữ liệu cho supplier ID: ${supplierId}`);

    // Đánh dấu chế độ chỉnh sửa
    isEditing = true;
    currentSupplierId = supplierId;
    console.log(`✅ Chế độ chỉnh sửa: supplierId = ${currentSupplierId}`);

    // Bản đồ các trường dữ liệu (hỗ trợ nhiều tên field)
    const fieldMappings = {
        supplierName: {
            keys: ['supplier_name', 'name'],
            type: 'text',
            backendKey: 'supplier_name' // Thêm để debug
        },
        supplierCode: {
            keys: ['supplier_code', 'code'],
            type: 'text',
            backendKey: 'supplier_code'
        },
        supplierTax: {
            keys: ['tax_code', 'tax_number'],
            type: 'text',
            backendKey: 'tax_code'
        },
        supplierEmail: {
            keys: ['email'],
            type: 'email',
            backendKey: 'email'
        },
        supplierPhone: {
            keys: ['company_phone', 'phone', 'phone_number'],
            type: 'tel',
            backendKey: 'company_phone'
        },
        supplierRep: {
            keys: ['contact_name', 'representative', 'contact_person'],
            type: 'text',
            backendKey: 'contact_name'
        },
        supplierRepPhone: {
            keys: ['representative_phone', 'rep_phone'],
            type: 'tel',
            backendKey: 'representative_phone'
        },
        supplierAddress: {
            keys: ['address'],
            type: 'textarea',
            backendKey: 'address'
        },
        supplierWebsite: {
            keys: ['website', 'website_url'],
            type: 'url',
            backendKey: 'website'
        },
        supplierRating: {
            keys: ['rating'],
            type: 'number',
            backendKey: 'rating'
        },
        supplierTerms: {
            keys: ['payment_terms', 'terms'],
            type: 'text',
            backendKey: 'payment_terms'
        }
    };

    // Debug: Log tất cả fields từ server
    console.log("📋 Tất cả fields từ server:", Object.keys(supplierData));
    console.log("📋 Dữ liệu đầy đủ:", supplierData);

    // Điền dữ liệu vào các field
    Object.keys(fieldMappings).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (!element) {
            console.warn(`⚠️  Không tìm thấy field: #${fieldId}`);
            return;
        }

        // Tìm giá trị từ supplierData dựa trên các tên key
        const keys = fieldMappings[fieldId].keys;
        const backendKey = fieldMappings[fieldId].backendKey;
        let value = null;

        for (let key of keys) {
            if (supplierData[key] !== undefined && supplierData[key] !== null) {
                value = supplierData[key];
                console.log(`  ✅ Tìm thấy ${fieldId} từ key "${key}" = ${value}`);
                break;
            }
        }

        // Nếu không tìm thấy qua keys, thử backendKey
        if (value === null && backendKey && supplierData[backendKey] !== undefined) {
            value = supplierData[backendKey];
            console.log(`  ✅ Tìm thấy ${fieldId} từ backendKey "${backendKey}" = ${value}`);
        }

        if (value !== null && value !== undefined && value !== '') {
            element.value = value;
            console.log(`  ✅ Đã điền ${fieldId} = ${value}`);
        } else {
            element.value = '';
            console.log(`  ⚠️  Không tìm thấy giá trị cho ${fieldId}, đã clear field`);
        }
    });

    // Điền categories (multiple select)
    const categorySelect = document.getElementById("supplierCategory");
    if (categorySelect) {
        // Clear tất cả selection trước
        Array.from(categorySelect.options).forEach(option => {
            option.selected = false;
        });

        const categories = supplierData.categories || supplierData.category || [];
        let categoriesArray = [];

        if (Array.isArray(categories)) {
            categoriesArray = categories;
        } else if (typeof categories === 'string' && categories.trim()) {
            categoriesArray = categories.split(',').map(cat => cat.trim());
        }

        console.log(`📂 Categories: ${JSON.stringify(categoriesArray)}`);

        categoriesArray.forEach(category => {
            const option = Array.from(categorySelect.options).find(opt =>
                opt.value.toLowerCase() === String(category).toLowerCase()
            );
            if (option) {
                option.selected = true;
                console.log(`  ✅ Chọn category: ${category}`);
            } else {
                console.warn(`  ⚠️  Không tìm thấy category option cho: ${category}`);
            }
        });
    } else {
        console.warn("⚠️  Không tìm thấy #supplierCategory");
    }

    // Điền radio button trạng thái
    const statusRadios = document.querySelectorAll('input[name="supplierStatus"]');
    const statusValue = supplierData.status || 'active';

    console.log(`🏷️  Status value: ${statusValue}`);

    statusRadios.forEach(radio => {
        radio.checked = radio.value === statusValue;
        if (radio.checked) {
            console.log(`  ✅ Chọn status: ${statusValue}`);
        }
    });

    // Preview logo nếu có
    const logoUrl = supplierData.logo || supplierData.logo_url;
    if (logoUrl) {
        const logoPreview = document.getElementById("logoPreview");
        const logoImg = logoPreview?.querySelector('img');
        if (logoImg && logoPreview) {
            logoImg.src = logoUrl;
            logoPreview.style.display = 'block';
            console.log(`🖼️  Logo preview: ${logoUrl}`);
        }
    } else {
        const logoPreview = document.getElementById("logoPreview");
        if (logoPreview) {
            logoPreview.style.display = 'none';
        }
        console.log(`⚠️  Không có logo URL`);
    }

    console.log("✅ Đã điền đầy đủ dữ liệu vào form");
}

/**
 * ✏️ Mở modal chỉnh sửa nhà cung cấp với dữ liệu đầy đủ
 */
function openEditModal(supplierData) {
    const supplierModal = document.getElementById("supplierModal");
    const modalTitle = document.getElementById("modalTitle");

    if (!supplierModal) {
        console.error("❌ Không tìm thấy #supplierModal");
        return;
    }

    // Kiểm tra dữ liệu
    if (!supplierData) {
        console.error("❌ Dữ liệu nhà cung cấp trống");
        showToast("Lỗi", "Dữ liệu nhà cung cấp không hợp lệ", "error");
        return;
    }

    const supplierId = supplierData.id || supplierData.supplier_id;
    if (!supplierId) {
        console.error("❌ Không tìm thấy ID nhà cung cấp");
        showToast("Lỗi", "Không thể xác định nhà cung cấp", "error");
        return;
    }

    console.log(`✅ Bắt đầu mở modal chỉnh sửa cho supplier ID: ${supplierId}`);

    // Cập nhật tiêu đề
    if (modalTitle) {
        modalTitle.textContent = "Chỉnh Sửa Nhà Cung Cấp";
    }

    // Reset form trước
    const supplierForm = document.getElementById("supplierForm");
    if (supplierForm) {
        supplierForm.reset();
    }

    // Điền dữ liệu vào form
    fillEditForm(supplierData);

    // Hiển thị modal
    supplierModal.classList.add("active");
    console.log("✅ Modal chỉnh sửa đã được mở");
}

/**
 * ❌ Đóng modal nhà cung cấp
 */
function closeSupplierModal() {
    const supplierModal = document.getElementById("supplierModal");
    const supplierForm = document.getElementById("supplierForm");

    if (supplierModal) {
        supplierModal.classList.remove("active");
    }

    if (supplierForm) {
        supplierForm.reset();
    }
}

/**
 * 💾 Lưu nhà cung cấp (thêm hoặc chỉnh sửa)
 */
async function saveSupplier() {
    console.log("💾 Bắt đầu lưu nhà cung cấp");
    const supplierForm = document.getElementById("supplierForm");

    if (!supplierForm) {
        console.error("❌ Không tìm thấy form nhà cung cấp");
        showToast("Lỗi", "Không tìm thấy form", "error");
        return;
    }

    // Lấy dữ liệu từ form
    const supplierName = document.getElementById("supplierName")?.value?.trim();
    const supplierCode = document.getElementById("supplierCode")?.value?.trim();
    const supplierTax = document.getElementById("supplierTax")?.value?.trim();
    const supplierEmail = document.getElementById("supplierEmail")?.value?.trim();
    const supplierPhone = document.getElementById("supplierPhone")?.value?.trim();
    const supplierRep = document.getElementById("supplierRep")?.value?.trim();
    const supplierRepPhone = document.getElementById("supplierRepPhone")?.value?.trim();
    const supplierAddress = document.getElementById("supplierAddress")?.value?.trim();
    const supplierWebsite = document.getElementById("supplierWebsite")?.value?.trim();
    const supplierRating = document.getElementById("supplierRating")?.value;
    const supplierTerms = document.getElementById("supplierTerms")?.value?.trim();

    // Lấy categories từ multiple select
    const categorySelect = document.getElementById("supplierCategory");
    const selectedCategories = categorySelect ?
        Array.from(categorySelect.selectedOptions).map(option => option.value) : [];

    // Lấy trạng thái
    const status = document.querySelector('input[name="supplierStatus"]:checked')?.value || 'active';

    console.log('🔍 Dữ liệu từ form:', {
        supplierName,
        supplierCode,
        supplierPhone,
        supplierRep,
        selectedCategories,
        categoriesCount: selectedCategories.length
    });

    // Kiểm tra dữ liệu bắt buộc
    if (!supplierName || !supplierCode || !supplierTax || !supplierEmail || !supplierPhone || !supplierRep || !supplierRepPhone || !supplierAddress) {
        showToast("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc (*)", "error");
        console.warn("⚠️ Dữ liệu thiếu:", {
            supplierName: !!supplierName,
            supplierCode: !!supplierCode,
            supplierTax: !!supplierTax,
            supplierEmail: !!supplierEmail,
            supplierPhone: !!supplierPhone,
            supplierRep: !!supplierRep,
            supplierRepPhone: !!supplierRepPhone,
            supplierAddress: !!supplierAddress
        });
        return;
    }

    // Kiểm tra categories
    if (selectedCategories.length === 0) {
        showToast("Cảnh báo", "Vui lòng chọn ít nhất 1 loại sản phẩm", "warning");
        console.warn("⚠️ Chưa chọn categories");
        return;
    }

    try {
        // Tạo object dữ liệu gửi lên API
        // Tạo object dữ liệu gửi lên API - KHỚP VỚI BACKEND
        const formData = {
            supplier_code: supplierCode,  // KHỚP với 'supplier_code' trong Controller
            supplier_name: supplierName,  // KHỚP với 'supplier_name' trong Controller
            tax_code: supplierTax || null,
            contact_name: supplierRep,    // KHỚP với 'contact_name' trong Controller
            representative_name: supplierRep, // Giống contact_name hoặc để null
            company_phone: supplierPhone, // KHỚP với 'company_phone' trong Controller
            representative_phone: supplierRepPhone || null,
            email: supplierEmail,
            address: supplierAddress,
            website: supplierWebsite || null,
            product_types: selectedCategories.length > 0 ? selectedCategories : null,
            rating: supplierRating ? parseFloat(supplierRating) : 3.0,
            payment_terms: supplierTerms || null,
            logo_url: null, // Chưa xử lý upload logo
            status: status,
            cooperation_date: new Date().toISOString().split('T')[0] // Ngày hợp tác hôm nay
        };

        console.log("📦 Dữ liệu sẽ gửi (đã chuẩn hóa):", formData);
        console.log("📝 Chế độ:", isEditing ? "Chỉnh sửa" : "Thêm mới");

        let response;

        if (isEditing && currentSupplierId) {
            // Chế độ chỉnh sửa
            response = await supplierAPI.updateSupplier(currentSupplierId, formData);
        } else {
            // Chế độ thêm
            response = await supplierAPI.createSupplier(formData);
        }

        console.log("📨 Response từ API:", response);
        console.log("📊 Response Type:", typeof response);
        console.log("📊 Response Keys:", response ? Object.keys(response) : 'null');

        // Kiểm tra success dựa trên nhiều điều kiện
        let success = false;
        let errorMessage = null;

        if (response) {
            // Kiểm tra có error không
            if (response.error) {
                errorMessage = response.error;
                success = false;
            }
            // Kiểm tra success flag
            else if (response.success === true || response.status === 'success') {
                success = true;
            }
            // Kiểm tra message thành công
            else if (response.message &&
                (response.message.toLowerCase().includes('thành công') ||
                    response.message.toLowerCase().includes('successfully'))) {
                success = true;
            }
            // Kiểm tra có data với id
            else if (response.data && (response.data.id || response.data.supplier_id)) {
                success = true;
            }
            // Kiểm tra response trực tiếp có id
            else if (response.id || response.supplier_id) {
                success = true;
            }
            // Nếu không có error và có dữ liệu, coi như thành công
            else if (!response.error && Object.keys(response).length > 0) {
                success = true;
            }
        }

        console.log(`🎯 Success status: ${success}${errorMessage ? `, Error: ${errorMessage}` : ''}`);

        if (success) {
            closeSupplierModal();
            currentPage = 1;
            await renderSuppliersTable();
            await loadStats(); // Cập nhật lại thống kê

            const toastMessage = isEditing ? "Đã cập nhật nhà cung cấp thành công" : "Đã thêm nhà cung cấp thành công";
            showToast("Thành công", toastMessage, "success");
            console.log("✅ " + toastMessage);
        } else {
            const errorMsg = errorMessage || response?.message || response?.error || "Không thể lưu nhà cung cấp";
            showToast("Lỗi", errorMsg, "error");
            console.error("❌ Lưu thất bại:", errorMsg);
        }
    } catch (error) {
        console.error("💥 Lỗi khi lưu nhà cung cấp:", error.message);
        showToast("Lỗi", error.message || "Không thể lưu nhà cung cấp", "error");
    }
}

// ============================================
// 🏪 PHẦN 7: HIỂN THỊ TRẠNG THÁI
// ============================================

/**
 * ⏳ Hiển thị trạng thái loading
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
 * ❗ Hiển thị thông báo lỗi
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
            <button class="btn btn-primary" onclick="renderSuppliersTable()">
              <i class="fas fa-redo"></i> Thử lại
            </button>
            <button class="btn btn-secondary" onclick="clearAllFilters()">
              <i class="fas fa-times"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

/**
 * 💬 Hiển thị toast thông báo
 */
function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = document.getElementById("toastIcon");

    if (!toast || !toastTitle || !toastMessage || !toastIcon) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    const icon = toastIcon.querySelector("i");
    if (icon) {
        const iconMap = {
            success: { class: "toast-icon success", icon: "fas fa-check-circle" },
            error: { class: "toast-icon error", icon: "fas fa-times-circle" },
            warning: { class: "toast-icon warning", icon: "fas fa-exclamation-triangle" }
        };

        const config = iconMap[type] || iconMap.success;
        toastIcon.className = config.class;
        icon.className = config.icon;
    }

    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 5000);
}

// ============================================
// 🏪 PHẦN 8: SỰ KIỆN (EVENTS)
// ============================================

/**
 * 🔍 Cài đặt tìm kiếm real-time
 */
function setupSearchEvent() {
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.trim();
        clearTimeout(searchTimeout);

        if (searchTerm === "") {
            currentPage = 1;
            renderSuppliersTable();
            return;
        }

        searchTimeout = setTimeout(() => {
            currentPage = 1;
            renderSuppliersTable();
        }, 500);
    });
}

/**
 * ⚙️ Cài đặt sự kiện cho các filter
 */
function setupFilterEvents() {
    // Lắng nghe thay đổi filter
    [categoryFilter, statusFilter, ratingFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener("change", () => {
                currentPage = 1;
                renderSuppliersTable();
            });
        }
    });

    // Nút áp dụng filter
    if (applyFilters) {
        applyFilters.addEventListener("click", () => {
            currentPage = 1;
            renderSuppliersTable();
            showToast("Thành công", "Đã áp dụng bộ lọc", "success");
        });
    }

    // Nút xóa filter
    if (clearFilters) {
        clearFilters.addEventListener("click", clearAllFilters);
    }
}

/**
 * � Cài đặt sự kiện tải lên logo
 */
function setupLogoUploadEvent() {
    const logoUpload = document.getElementById("logoUpload");
    if (!logoUpload) return;

    // Click to upload
    logoUpload.addEventListener("click", function () {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = function (e) {
            handleLogoUpload(e.target.files[0]);
        };
        fileInput.click();
    });

    // Drag and drop
    logoUpload.addEventListener("dragover", function (e) {
        e.preventDefault();
        logoUpload.style.borderColor = "var(--primary-color)";
        logoUpload.style.background = "var(--primary-light)";
    });

    logoUpload.addEventListener("dragleave", function (e) {
        e.preventDefault();
        logoUpload.style.borderColor = "var(--gray-300)";
        logoUpload.style.background = "var(--gray-100)";
    });

    logoUpload.addEventListener("drop", function (e) {
        e.preventDefault();
        logoUpload.style.borderColor = "var(--gray-300)";
        logoUpload.style.background = "var(--gray-100)";

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleLogoUpload(files[0]);
        }
    });
}

/**
 * 🖼️ Xử lý tải lên logo
 */
function handleLogoUpload(file) {
    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
        showToast("Lỗi", "Vui lòng chọn file ảnh", "error");
        return;
    }

    // Kiểm tra kích thước (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast("Lỗi", "File ảnh không được vượt quá 5MB", "error");
        return;
    }

    // Tạo preview
    const reader = new FileReader();
    reader.onload = function (e) {
        const logoPreview = document.getElementById("logoPreview");
        const logoImg = logoPreview?.querySelector("img");

        if (logoImg && logoPreview) {
            logoImg.src = e.target.result;
            logoPreview.style.display = "block";
            showToast("Thành công", "Đã tải lên ảnh logo", "success");
        }
    };
    reader.readAsDataURL(file);
}

/**
 * �🔢 Cài đặt sự kiện phân trang
 */
function setupPaginationEvents() {
    // Thay đổi số dòng/trang
    if (rowsPerPageSelect) {
        rowsPerPageSelect.addEventListener("change", function (e) {
            rowsPerPage = parseInt(e.target.value);
            currentPage = 1;
            renderSuppliersTable();
        });
    }

    // Nút làm mới
    const refreshTable = document.getElementById("refreshTable");
    if (refreshTable) {
        refreshTable.addEventListener("click", function () {
            currentPage = 1;
            renderSuppliersTable();
            showToast("Thành công", "Đã làm mới danh sách nhà cung cấp", "success");
        });
    }
}

/**
 * 🧹 Xóa tất cả filter
 */
function clearAllFilters() {
    if (categoryFilter) categoryFilter.value = "";
    if (statusFilter) statusFilter.value = "";
    if (ratingFilter) ratingFilter.value = "";
    if (sortFilter) sortFilter.value = "name-asc";
    if (searchInput) searchInput.value = "";

    currentPage = 1;
    renderSuppliersTable();
    showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

// ============================================
// 🏪 PHẦN 9: KHỞI TẠO ỨNG DỤNG
// ============================================

/**
 * 🚀 Khởi tạo ứng dụng
 */
async function initializeApp() {
    try {
        // 1. Lấy các phần tử DOM
        initializeDOMElements();

        // 2. Tải thống kê
        await loadStats();

        // 3. Tải danh sách nhà cung cấp
        await renderSuppliersTable();

        // 4. Thiết lập sự kiện
        setupAllEvents();

        console.log("🎉 Ứng dụng nhà cung cấp đã khởi tạo thành công");

    } catch (error) {
        console.error("❌ Lỗi khi khởi tạo ứng dụng:", error);
        showToast("Lỗi", "Không thể khởi tạo ứng dụng", "error");
    }
}

/**
 * 🎯 Khởi tạo các phần tử DOM
 */
function initializeDOMElements() {
    // Lấy các phần tử DOM từ HTML
    suppliersTableBody = document.getElementById("suppliersTableBody");
    categoryFilter = document.getElementById("categoryFilter");
    statusFilter = document.getElementById("statusFilter");
    ratingFilter = document.getElementById("ratingFilter");
    sortFilter = document.getElementById("sortFilter");
    searchInput = document.querySelector(".search-box input");
    rowsPerPageSelect = document.getElementById("rowsPerPage");
    addSupplierBtn = document.getElementById("addSupplierBtn");
    applyFilters = document.getElementById("applyFilters");
    clearFilters = document.getElementById("clearFilters");

    console.log("✅ Đã khởi tạo DOM elements");
}

/**
 * 🔗 Thiết lập tất cả sự kiện
 */
function setupAllEvents() {
    // Sự kiện tìm kiếm và filter
    setupSearchEvent();
    setupFilterEvents();
    setupPaginationEvents();

    // ===== SỰ KIỆN SIDEBAR =====
    const toggleSidebar = document.getElementById("toggleSidebar");
    if (toggleSidebar) {
        toggleSidebar.addEventListener("click", function () {
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    // ===== SỰ KIỆN MODAL THÊM/SỬA NHÀ CUNG CẤP =====

    // Nút thêm nhà cung cấp
    if (addSupplierBtn) {
        addSupplierBtn.addEventListener("click", openAddModal);
    }

    // Nút lưu nhà cung cấp
    const saveSupplierBtn = document.getElementById("saveSupplierBtn");
    if (saveSupplierBtn) {
        saveSupplierBtn.addEventListener("click", saveSupplier);
    }

    // Nút hủy / đóng modal
    const closeModalBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const supplierModal = document.getElementById("supplierModal");

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeSupplierModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeSupplierModal);
    }

    // Đóng modal khi click bên ngoài
    if (supplierModal) {
        supplierModal.addEventListener("click", function (event) {
            if (event.target === supplierModal) {
                closeSupplierModal();
            }
        });
    }

    // ===== SỰ KIỆN LOGO UPLOAD =====
    setupLogoUploadEvent();

    // ===== SỰ KIỆN MODAL XEM CHI TIẾT =====

    const closeDetailsModal = document.getElementById("closeDetailsModal");
    const closeDetailsBtn = document.getElementById("closeDetailsBtn");
    const editFromDetailsBtn = document.getElementById("editFromDetailsBtn");
    const supplierDetailsModal = document.getElementById("supplierDetailsModal");

    if (closeDetailsModal) {
        closeDetailsModal.addEventListener("click", () => {
            if (supplierDetailsModal) supplierDetailsModal.classList.remove("active");
        });
    }

    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener("click", () => {
            if (supplierDetailsModal) supplierDetailsModal.classList.remove("active");
        });
    }

    if (editFromDetailsBtn) {
        editFromDetailsBtn.addEventListener("click", () => {
            if (supplierDetailsModal) supplierDetailsModal.classList.remove("active");
            // Chỉnh sửa supplier hiện tại
            if (currentSupplierId) {
                editSupplier(currentSupplierId);
            }
        });
    }

    if (supplierDetailsModal) {
        supplierDetailsModal.addEventListener("click", function (event) {
            if (event.target === supplierDetailsModal) {
                supplierDetailsModal.classList.remove("active");
            }
        });
    }

    // ===== SỰ KIỆN MODAL XÓA NHÀ CUNG CẤP =====

    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const deleteModal = document.getElementById("deleteModal");

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", deleteSupplier);
    }
    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
    }
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    }
    if (deleteModal) {
        deleteModal.addEventListener("click", function (event) {
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }

    // Đóng toast
    const closeToastBtn = document.getElementById("closeToast");
    const toast = document.getElementById("toast");
    if (closeToastBtn && toast) {
        closeToastBtn.addEventListener("click", function () {
            toast.classList.remove("show");
        });
    }

    // ===== SỰ KIỆN SELECT ALL CHECKBOX =====
    const selectAllCheckbox = document.getElementById("selectAll");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const checkboxes = document.querySelectorAll(".supplier-checkbox");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    // ===== SỰ KIỆN EXPORT EXCEL =====
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", exportToExcel);
    }

    console.log("✅ Đã thiết lập tất cả sự kiện");
}

// ============================================
// 🏪 PHẦN 10: CHẠY ỨNG DỤNG
// ============================================

/**
 * 🏁 Chạy ứng dụng khi DOM đã sẵn sàng
 */
document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
});

// ============================================
// 🏪 PHẦN 11: EXPORT HÀM RA GLOBAL SCOPE
// ============================================

window.viewSupplier = viewSupplier;
window.editSupplier = editSupplier;
window.showDeleteModal = showDeleteModal;
window.clearAllFilters = clearAllFilters;
window.renderSuppliersTable = renderSuppliersTable;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeSupplierModal = closeSupplierModal;
window.saveSupplier = saveSupplier;
window.deleteSupplier = deleteSupplier;
window.closeDeleteModal = closeDeleteModal;
window.exportToExcel = exportToExcel;

console.log("🚀 Tất cả hàm Suppliers đã được xuất ra global scope");