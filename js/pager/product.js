// ============================================
// 🏪 PHẦN 1: CẤU HÌNH API & SERVICE
// ============================================

// ========== CẤU HÌNH API ENDPOINTS ==========
// 📍 Địa chỉ backend server
const API_BASE_URL = "http://127.0.0.1:6346/api";

// 📋 Danh sách các API endpoints (đường dẫn API)
const API_ENDPOINTS = {
  products: "/products",          // Lấy danh sách sản phẩm
  stats: "/products/stats",       // Lấy thống kê sản phẩm
  filterOptions: "/products/filter-options", // Lấy tùy chọn lọc
  brands: "/products/brands",     // Lấy danh sách thương hiệu
  categories: "/products/categories", // Lấy danh sách danh mục
};

// ========== LỚP API SERVICE ==========
// 🚀 Lớp ProductAPIService - chứa tất cả phương thức gọi API liên quan đến sản phẩm
class ProductAPIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json", // Dữ liệu gửi đi là JSON
      Accept: "application/json",         // Chấp nhận dữ liệu trả về là JSON
    };
  }

  /**
   * 🔄 Hàm request chung để gọi API
   * @param {string} endpoint - Đường dẫn API (vd: "/products")
   * @param {object} options - Tùy chọn request (method, body, headers)
   * @returns {Promise} - Promise chứa dữ liệu từ API
   */
  async request(endpoint, options = {}) {
    try {
      // Tạo URL đầy đủ bằng cách nối baseUrl và endpoint
      const url = `${this.baseUrl}${endpoint}`;

      console.log("🔗 Requesting URL:", url); // Debug: In ra URL được gọi
      if (options.body) {
        console.log("📦 Request body:", JSON.parse(options.body));
      }

      // Gửi request tới server bằng fetch API
      const response = await fetch(url, {
        ...options, // Sao chép các tùy chọn từ tham số
        headers: { ...this.headers, ...options.headers }, // Kết hợp headers mặc định và tùy chọn
      });

      // Lấy dữ liệu từ response (có thể là JSON hoặc text)
      let data;
      try {
        data = await response.json();
      } catch (e) {
        // Nếu response không phải JSON, lấy text
        data = await response.text();
      }

      // Kiểm tra nếu response không thành công (status code không trong khoảng 200-299)
      if (!response.ok) {
        // Xử lý các lỗi HTTP khác nhau
        const errorObj = {
          status: response.status,
          statusText: response.statusText,
          url: url,
          message: data?.message || data?.error || response.statusText,
          data: data
        };

        console.error("❌ HTTP Error!", errorObj);

        // Tạo error message chi tiết dựa trên status code
        let userMessage = "";
        switch (response.status) {
          case 400:
            userMessage = "Yêu cầu không hợp lệ";
            break;
          case 401:
            userMessage = "Không có quyền truy cập";
            break;
          case 403:
            userMessage = "Bị cấm truy cập";
            break;
          case 404:
            userMessage = "Không tìm thấy tài nguyên";
            break;
          case 422:
            userMessage = `Dữ liệu không hợp lệ: ${errorObj.message}`;
            if (data?.errors) {
              console.error("📋 Validation errors:", data.errors);
              userMessage += "\nLỗi chi tiết: " + JSON.stringify(data.errors);
            }
            break;
          case 500:
            // Extract more details from server error
            if (errorObj.message && errorObj.message.includes('Integrity constraint')) {
              if (errorObj.message.includes('brand_id')) {
                userMessage = "Lỗi: Thương hiệu không tồn tại. Vui lòng chọn thương hiệu hợp lệ.";
              } else if (errorObj.message.includes('Duplicate entry') || errorObj.message.includes('sku')) {
                userMessage = "Lỗi: Mã SKU đã tồn tại. Vui lòng sử dụng SKU khác.";
              } else {
                userMessage = `Lỗi ràng buộc dữ liệu: ${errorObj.message.substring(0, 200)}`;
              }
            } else {
              userMessage = "Lỗi server (500)";
            }
            break;
          default:
            userMessage = `Lỗi HTTP ${response.status}: ${response.statusText}`;
        }

        const error = new Error(userMessage);
        error.status = response.status;
        error.data = errorObj;
        throw error;
      }

      console.log('✅ API response received:', data); // Log dữ liệu nhận được
      return data;

    } catch (error) {
      // Bắt lỗi và log ra console với chi tiết
      console.error("💥 API Error:", error.message);
      console.error("Error details:", {
        status: error.status,
        data: error.data
      });

      // Ném lỗi để xử lý ở nơi gọi hàm
      throw error;
    }
  }

  /**
   * 📋 Lấy danh sách sản phẩm
   * @param {object} params - Tham số filter (page, per_page, category, brand_id, ...)
   * @returns {Promise} - Danh sách sản phẩm
   */
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.products}?${queryString}`
      : API_ENDPOINTS.products;

    console.log("🔗 API Request URL:", `${this.baseUrl}${endpoint}`);
    console.log("📤 Parameters:", params);

    return this.request(endpoint);
  }

  /**
   * 🔍 Lấy sản phẩm theo ID
   * @param {number|string} id - ID sản phẩm
   * @returns {Promise} - Thông tin sản phẩm
   */
  async getProductById(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`);
  }

  /**
   * ➕ Tạo sản phẩm mới
   * @param {object} productData - Dữ liệu sản phẩm mới
   * @returns {Promise} - Kết quả tạo sản phẩm
   */
  async createProduct(productData) {
    console.log("📤 Creating product with data:", productData);
    return this.request(API_ENDPOINTS.products, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  /**
   * ➕ Tạo sản phẩm mới với ảnh
   * @param {FormData} formData - FormData chứa dữ liệu và file ảnh
   * @returns {Promise} - Kết quả tạo sản phẩm
   */
  async createProductWithImage(formData) {
    console.log("📤 Creating product with image");
    const url = `${this.baseUrl}${API_ENDPOINTS.products}`;

    try {
      // Lấy CSRF token từ meta tag

      const response = await fetch(url, {
        method: "POST",
        body: formData, // FormData tự động set Content-Type với boundary
        headers: {
          'Accept': 'application/json'
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.message || 'Lỗi khi tạo sản phẩm');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error("💥 API Error:", error);
      throw error;
    }
  }

  /**
   * ✏️ Cập nhật sản phẩm
   * @param {number|string} id - ID sản phẩm cần cập nhật
   * @param {object} productData - Dữ liệu sản phẩm mới
   * @returns {Promise} - Kết quả cập nhật
   */
  async updateProduct(id, productData) {
    console.log("🔄 Updating product ID:", id, "with data:", productData);
    return this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  /**
   * ✏️ Cập nhật sản phẩm với ảnh
   * @param {number|string} id - ID sản phẩm cần cập nhật
   * @param {FormData} formData - FormData chứa dữ liệu và file ảnh
   * @returns {Promise} - Kết quả cập nhật
   */
  async updateProductWithImage(id, formData) {
    console.log("🔄 Updating product ID:", id, "with image");
    const url = `${this.baseUrl}${API_ENDPOINTS.products}/${id}`;

    // Thêm _method=PUT vì FormData không hỗ trợ PUT trực tiếp
    formData.append('_method', 'PUT');

    try {
      const response = await fetch(url, {
        method: "POST", // Dùng POST với _method=PUT
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data?.message || 'Lỗi khi cập nhật sản phẩm');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error("💥 API Error:", error);
      throw error;
    }
  }

  /**
   * 🗑️ Xóa sản phẩm
   * @param {number|string} id - ID sản phẩm cần xóa
   * @returns {Promise} - Kết quả xóa
   */
  async deleteProduct(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * 📊 Lấy thống kê sản phẩm
   * @returns {Promise} - Dữ liệu thống kê
   */
  async getStats() {
    return this.request(API_ENDPOINTS.stats);
  }

  /**
   * 🔧 Lấy tùy chọn lọc (brands, categories)
   * @returns {Promise} - Danh sách filter options
   */
  async getFilterOptions() {
    return this.request(API_ENDPOINTS.filterOptions);
  }

  /**
   * 🏷️ Lấy danh sách thương hiệu
   * @returns {Promise} - Danh sách thương hiệu
   */
  async getBrands() {
    return this.request(API_ENDPOINTS.brands);
  }

  /**
   * 📁 Lấy danh sách danh mục
   * @returns {Promise} - Danh sách danh mục
   */
  async getCategories() {
    return this.request(API_ENDPOINTS.categories);
  }
}

// Tạo instance toàn cục của API Service
const productAPI = new ProductAPIService();

// ============================================
// 🏪 PHẦN 2: QUẢN LÝ SẢN PHẨM - BIẾN VÀ DOM
// ============================================

// ========== BIẾN TOÀN CỤC ==========
let currentPage = 1;          // Trang hiện tại
let rowsPerPage = 12;         // Số sản phẩm/trang
let filteredProducts = [];    // Danh sách sau khi lọc
let productToDelete = null;   // ID sản phẩm cần xóa
let isEditing = false;        // Chế độ chỉnh sửa
let currentProductId = null;  // ID sản phẩm đang sửa

// ========== DOM ELEMENTS ==========
// 📌 Lấy các phần tử DOM từ HTML
let productsTableBody, categoryFilter, brandFilter, productBrandSelect;
let stockFilter, priceFilter, searchInput, rowsPerPageSelect;
let addProductBtn, applyFilters, clearFilters;

// ============================================
// 🏪 PHẦN 3: HÀM CHÍNH - HIỂN THỊ SẢN PHẨM
// ============================================

/**
 * 📋 Lấy và hiển thị danh sách sản phẩm
 * Xử lý phân trang, tìm kiếm, lọc dữ liệu
 */
async function renderProductsTable() {
  try {
    showLoadingState();

    // Tạo đối tượng filter từ các input - ĐIỀU CHỈNH TÊN PARAM CHO KHỚP LARAVEL
    const filters = {
      page: currentPage,
      per_page: rowsPerPage,
      ...(categoryFilter && categoryFilter.value && { category: categoryFilter.value }),
      ...(brandFilter && brandFilter.value && { brand_id: brandFilter.value }), // Sửa thành brand_id để khớp DB
      ...(stockFilter && stockFilter.value && { stock_status: stockFilter.value }),
      ...(priceFilter && priceFilter.value && { price_range: priceFilter.value }),
      ...(searchInput && searchInput.value.trim() && { search: searchInput.value.trim() })
    };

    // Gọi API lấy dữ liệu
    const response = await productAPI.getProducts(filters);

    console.log('📊 API Response structure:', response);

    // Xử lý response từ API - XỬ LÝ ĐA DẠNG CẤU TRÚC RESPONSE
    let products = [];
    let paginationData = {};

    // CÁCH 1: Nếu response là array trực tiếp
    if (Array.isArray(response)) {
      console.log('📦 Response is direct array');
      products = response;
      paginationData = {
        current_page: 1,
        total: products.length,
        per_page: rowsPerPage,
        last_page: 1,
        from: 1,
        to: Math.min(products.length, rowsPerPage)
      };
    }
    // CÁCH 2: Laravel Paginator (có data và meta)
    else if (response.data && Array.isArray(response.data)) {
      console.log('📦 Response has data array (Laravel paginate)');
      products = response.data;
      paginationData = {
        current_page: response.current_page || 1,
        total: response.total || 0,
        per_page: response.per_page || rowsPerPage,
        last_page: response.last_page || 1,
        from: response.from || 1,
        to: response.to || Math.min(products.length, rowsPerPage)
      };
    }
    // CÁCH 3: Response với success flag
    else if (response.success && response.data) {
      console.log('📦 Response has success flag');

      // Nếu data là array
      if (Array.isArray(response.data)) {
        products = response.data;
        paginationData = {
          current_page: response.current_page || 1,
          total: response.total || products.length,
          per_page: response.per_page || rowsPerPage,
          last_page: response.last_page || 1,
          from: response.from || 1,
          to: response.to || Math.min(products.length, rowsPerPage)
        };
      }
      // Nếu data là object với pagination
      else if (response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
        paginationData = {
          current_page: response.data.current_page || 1,
          total: response.data.total || 0,
          per_page: response.data.per_page || rowsPerPage,
          last_page: response.data.last_page || 1,
          from: response.data.from || 1,
          to: response.data.to || Math.min(products.length, rowsPerPage)
        };
      }
    }
    // CÁCH 4: Response với nested data
    else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      console.log('📦 Response has nested data array');
      products = response.data.data;
      paginationData = {
        current_page: response.data.current_page || 1,
        total: response.data.total || 0,
        per_page: response.data.per_page || rowsPerPage,
        last_page: response.data.last_page || 1,
        from: response.data.from || 1,
        to: response.data.to || Math.min(products.length, rowsPerPage)
      };
    }

    console.log('📦 Products extracted:', products.length, 'items');

    // Debug: Kiểm tra trạng thái kho của các sản phẩm
    if (products.length > 0) {
      const stockStats = {
        'in-stock': 0,
        'low-stock': 0,
        'out-of-stock': 0
      };
      products.forEach(p => {
        const status = getStockStatus(p.stock || p.quantity || 0);
        stockStats[status] = (stockStats[status] || 0) + 1;
      });
      console.log('📊 Thống kê trạng thái kho:', stockStats);
    }

    if (products.length > 0) {
      filteredProducts = products;
      renderProductsList(products);

      // Cập nhật thông tin phân trang
      updateTableInfo(paginationData);
      updatePaginationInfo(paginationData);

      console.log(`✅ Đã tải ${products.length} sản phẩm`);
    } else {
      filteredProducts = [];
      renderProductsList([]);
      updateTableInfo({ total: 0, from: 0, to: 0 });
    }

  } catch (error) {
    console.error("💥 Lỗi khi tải sản phẩm:", error);
    showErrorState(error.message);
    showToast("Lỗi", `Không thể tải dữ liệu: ${error.message}`, "error");
  }
}

/**
 * 📊 Hiển thị danh sách sản phẩm lên bảng
 * @param {Array} products - Mảng sản phẩm cần hiển thị
 */
function renderProductsList(products) {
  if (!productsTableBody) return;

  productsTableBody.innerHTML = "";

  if (!products || products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i class="fas fa-box-open" style="color: #6c757d; font-size: 32px; margin-bottom: 16px;"></i>
            <h3 style="margin-bottom: 12px;">Không tìm thấy sản phẩm</h3>
            <p style="color: #6c757d; margin-bottom: 16px;">
              Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
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

  // Duyệt qua từng sản phẩm và tạo row cho bảng
  products.forEach((product) => {
    // CHUẨN HÓA DỮ LIỆU SẢN PHẨM - XỬ LÝ ĐA DẠNG CẤU TRÚC
    const productId = product.id || product.product_id;
    const productName = product.product_name || product.name || 'N/A';
    const categoryText = getCategoryText(product.category);

    // Xử lý thương hiệu (có thể là string, object, hoặc ID)
    let brandText = "Không xác định";
    if (product.brand) {
      if (typeof product.brand === 'object') {
        brandText = product.brand.brand_name || product.brand.name || "Không xác định";
      } else {
        brandText = product.brand;
      }
    } else if (product.brand_name) {
      brandText = product.brand_name;
    } else if (product.brand_id) {
      brandText = `Brand ID: ${product.brand_id}`;
    }

    const stock = product.stock || product.quantity || 0;
    const stockStatus = getStockStatus(stock);
    const formattedPrice = formatPrice(product.price || 0);
    const sku = product.sku || 'N/A';
    const image = product.image || product.image_url || null;

    // Tạo HTML cho mỗi row sản phẩm
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="product-checkbox" data-id="${productId}"></td>
      <td>
        <div class="product-info">
          <div class="product-image">
            <img src="${image || 'https://placehold.co/50x50'}" 
                 alt="${productName}"
                 onerror="this.src='https://placehold.co/50x50'">
          </div>
          <div class="product-details">
            <div class="product-name">${productName}</div>
            <div class="product-sku">SKU: ${sku}</div>
          </div>
        </div>
      </td>
      <td><span class="product-category">${categoryText}</span></td>
      <td>${brandText}</td>
      <td class="product-price">${formattedPrice}₫</td>
      <td>${stock}</td>
      <td>
        <span class="stock-status ${stockStatus}">
          ${getStockStatusText(stockStatus)}
        </span>
      </td>
      <td>
        <div class="product-actions">
          <button class="action-btn view" onclick="viewProduct(${productId})" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editProduct(${productId})" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="showDeleteModal(${productId}, '${escapeHtml(productName)}')" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    productsTableBody.appendChild(row);
  });
}

// ============================================
// 🏪 PHẦN 4: HÀM TIỆN ÍCH - ĐỊNH DẠNG
// ============================================

/**
 * 💰 Định dạng giá tiền: 25490000 → "25.490.000"
 * @param {number|string} price - Giá cần định dạng
 * @returns {string} - Giá đã định dạng
 */
function formatPrice(price) {
  if (!price || isNaN(price)) return "0";
  // Chuyển thành số nguyên nếu là số thập phân
  const priceNumber = parseInt(price, 10);
  return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * 📁 Chuyển mã danh mục thành tên tiếng Việt
 * @param {string} category - Mã danh mục
 * @returns {string} - Tên danh mục tiếng Việt
 */
function getCategoryText(category) {
  const categoryMap = {
    smartphone: "Điện thoại",
    tablet: "Máy tính bảng",
    accessory: "Phụ kiện",
    watch: "Đồng hồ thông minh",
    laptop: "Laptop",
  };
  return categoryMap[category] || category || "Không xác định";
}

/**
 * 📦 Xác định trạng thái kho hàng dựa trên số lượng
 * @param {number} stock - Số lượng tồn kho
 * @returns {string} - Mã trạng thái
 */
function getStockStatus(stock) {
  if (stock === undefined || stock === null) return "unknown";
  const stockNumber = parseInt(stock, 10);
  if (stockNumber === 0) return "out-of-stock";
  if (stockNumber <= 5) return "low-stock";
  return "in-stock";
}

/**
 * 📝 Chuyển mã trạng thái thành text tiếng Việt
 * @param {string} status - Mã trạng thái
 * @returns {string} - Tên trạng thái tiếng Việt
 */
function getStockStatusText(status) {
  const statusMap = {
    "in-stock": "Còn hàng",
    "low-stock": "Sắp hết",
    "out-of-stock": "Hết hàng",
    "unknown": "Không xác định"
  };
  return statusMap[status] || status;
}

/**
 * 🛡️ Escape HTML để tránh XSS (Cross-Site Scripting)
 * @param {string} text - Văn bản cần escape
 * @returns {string} - Văn bản đã escape
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// 🏪 PHẦN 5: PHÂN TRANG
// ============================================

/**
 * 📊 Cập nhật thông tin "Hiển thị 1-12 trong 150 sản phẩm"
 * @param {object} paginationData - Dữ liệu phân trang
 */
function updateTableInfo(paginationData) {
  if (!paginationData) return;

  const total = paginationData.total || 0;
  const from = paginationData.from || 0;
  const to = paginationData.to || 0;

  const infoElement = document.querySelector(".table-info");
  if (infoElement) {
    infoElement.innerHTML = `
      Hiển thị <strong>${from}-${to}</strong> trong tổng số <strong>${total}</strong> sản phẩm
    `;
  }
}

/**
 * 🔢 Cập nhật thông tin phân trang
 * @param {object} paginationData - Dữ liệu phân trang
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
 * @param {number} currentPageNum - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 */
function updatePaginationButtons(currentPageNum, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  // Cập nhật nút số trang
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
        renderProductsTable();
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
      renderProductsTable();
    }
  };
  if (prevPageBtn) prevPageBtn.onclick = () => {
    if (currentPageNum > 1) {
      currentPage--;
      renderProductsTable();
    }
  };
  if (nextPageBtn) nextPageBtn.onclick = () => {
    if (currentPageNum < totalPages) {
      currentPage++;
      renderProductsTable();
    }
  };
  if (lastPageBtn) lastPageBtn.onclick = () => {
    if (currentPageNum < totalPages) {
      currentPage = totalPages;
      renderProductsTable();
    }
  };
}

// ============================================
// 🏪 PHẦN 6: THỐNG KÊ
// ============================================

/**
 * 📈 Lấy thống kê sản phẩm từ API
 */
async function loadStats() {
  try {
    const response = await productAPI.getStats();

    // Xử lý nhiều cấu trúc response
    let stats = {};

    if (response.success && response.data) {
      stats = response.data;
    } else if (response.data) {
      stats = response.data;
    } else if (response.stats) {
      stats = response.stats;
    } else {
      stats = response;
    }

    console.log('📊 Stats data:', stats);

    // Cập nhật 4 thẻ thống kê
    const totalElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
    const availableElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
    const lowStockElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
    const outOfStockElement = document.querySelector('.stat-card:nth-child(4) .stat-number');

    if (totalElement) totalElement.textContent = stats.total || stats.total_products || 0;
    if (availableElement) availableElement.textContent = stats.available || stats.in_stock || 0;
    if (lowStockElement) lowStockElement.textContent = stats.low_stock || stats.low_stock_count || 0;
    if (outOfStockElement) outOfStockElement.textContent = stats.out_of_stock || stats.out_of_stock_count || 0;

  } catch (error) {
    console.error("❌ Lỗi khi tải thống kê:", error);
  }
}

// ============================================
// 🏪 PHẦN 7: BỘ LỌC (FILTER)
// ============================================

/**
 * 🔧 Lấy danh sách brands và categories cho dropdown
 */
async function loadFilterOptions() {
  try {
    // Lấy danh sách thương hiệu
    const brandsResponse = await productAPI.getBrands();
    let brands = [];

    console.log('🏷️ Brands API Response:', brandsResponse);

    // Xử lý nhiều cấu trúc response
    if (brandsResponse.success && brandsResponse.data) {
      brands = brandsResponse.data;
    } else if (brandsResponse.data) {
      brands = brandsResponse.data;
    } else if (Array.isArray(brandsResponse)) {
      brands = brandsResponse;
    }

    console.log('🏷️ Brands extracted:', brands);
    console.log('🏷️ Number of brands:', brands.length);

    if (brands.length > 0) {
      // Log chi tiết từng brand
      brands.forEach((brand, index) => {
        console.log(`  Brand ${index + 1}:`, {
          id: brand.id || brand.brand_id,
          name: brand.brand_name || brand.name,
          raw: brand
        });
      });

      updateBrandFilter(brands);
      updateProductBrandOptions(brands);
    } else {
      console.warn('⚠️ KHÔNG CÓ THƯƠNG HIỆU NÀO TRONG HỆ THỐNG!');
      showToast('Cảnh báo', 'Không tìm thấy thương hiệu nào. Vui lòng thêm thương hiệu trước!', 'warning');
    }

    // Lấy danh sách danh mục  
    const categoriesResponse = await productAPI.getCategories();
    let categories = [];

    if (categoriesResponse.success && categoriesResponse.data) {
      categories = categoriesResponse.data;
    } else if (categoriesResponse.data) {
      categories = categoriesResponse.data;
    } else if (Array.isArray(categoriesResponse)) {
      categories = categoriesResponse;
    }

    if (categories.length > 0) {
      updateCategoryFilter(categories);
    }

  } catch (error) {
    console.error("❌ Lỗi khi tải filter options:", error);
  }
}

/**
 * 🏷️ Cập nhật dropdown thương hiệu trong bộ lọc
 * @param {Array} brands - Danh sách thương hiệu
 */
function updateBrandFilter(brands) {
  if (!brandFilter) return;

  const firstOption = brandFilter.options[0];
  brandFilter.innerHTML = '';
  brandFilter.appendChild(firstOption);

  brands.forEach(brand => {
    const option = document.createElement('option');
    // Xử lý cả object và string
    if (typeof brand === 'object') {
      option.value = brand.id || brand.brand_id || brand.value;
      option.textContent = brand.brand_name || brand.name || brand.label;
    } else {
      option.value = brand;
      option.textContent = brand;
    }
    brandFilter.appendChild(option);
  });
}

/**
 * 🏷️ Cập nhật dropdown thương hiệu trong form thêm/sửa
 * @param {Array} brands - Danh sách thương hiệu
 */
function updateProductBrandOptions(brands) {
  if (!productBrandSelect) {
    console.warn('⚠️ productBrandSelect element not found!');
    return;
  }

  console.log('🔧 Updating productBrandSelect with', brands.length, 'brands');

  const firstOption = productBrandSelect.options[0];
  productBrandSelect.innerHTML = '';
  productBrandSelect.appendChild(firstOption);

  let addedCount = 0;
  brands.forEach(brand => {
    const option = document.createElement('option');
    // Xử lý cả object và string
    if (typeof brand === 'object') {
      const brandId = brand.id || brand.brand_id || brand.value;
      const brandName = brand.brand_name || brand.name || brand.label;
      
      option.value = brandId;
      option.textContent = brandName;
      
      console.log(`  ✅ Added brand option: ID=${brandId}, Name=${brandName}`);
      addedCount++;
    } else {
      option.value = brand;
      option.textContent = brand;
      addedCount++;
    }
    productBrandSelect.appendChild(option);
  });

  console.log(`✅ Total brands added to select: ${addedCount}`);
}

/**
 * 📁 Cập nhật dropdown danh mục
 * @param {Array} categories - Danh sách danh mục
 */
function updateCategoryFilter(categories) {
  if (!categoryFilter) return;

  const firstOption = categoryFilter.options[0];
  categoryFilter.innerHTML = '';
  categoryFilter.appendChild(firstOption);

  categories.forEach(category => {
    const option = document.createElement('option');

    // Xử lý cả object và string
    if (typeof category === 'object') {
      const categoryValue = category.value || category.id || category.category;
      const categoryLabel = category.label || category.name || getCategoryText(categoryValue);

      option.value = categoryValue;
      option.textContent = categoryLabel;
    } else {
      option.value = category;
      option.textContent = getCategoryText(category) || category;
    }

    categoryFilter.appendChild(option);
  });
}

// ============================================
// 🏪 PHẦN 8: SỰ KIỆN (EVENTS)
// ============================================

/**
 * 🔍 Cài đặt tìm kiếm real-time với debounce
 */
function setupSearchEvent() {
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (searchTerm === "") {
      currentPage = 1;
      renderProductsTable();
      return;
    }

    searchTimeout = setTimeout(() => {
      currentPage = 1;
      renderProductsTable();
    }, 500);
  });
}

/**
 * ⚙️ Cài đặt sự kiện cho các filter
 */
function setupFilterEvents() {
  // Lắng nghe thay đổi filter
  [categoryFilter, brandFilter, stockFilter, priceFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener("change", () => {
        currentPage = 1;
        renderProductsTable();
      });
    }
  });

  // Nút áp dụng filter
  if (applyFilters) {
    applyFilters.addEventListener("click", () => {
      currentPage = 1;
      renderProductsTable();
      showToast("Thành công", "Đã áp dụng bộ lọc", "success");
    });
  }

  // Nút xóa filter
  if (clearFilters) {
    clearFilters.addEventListener("click", clearAllFilters);
  }
}

/**
 * 🔢 Cài đặt sự kiện phân trang
 */
function setupPaginationEvents() {
  // Thay đổi số dòng/trang
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener("change", function (e) {
      rowsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderProductsTable();
    });
  }

  // Nút làm mới
  const refreshTable = document.getElementById("refreshTable");
  if (refreshTable) {
    refreshTable.addEventListener("click", function () {
      currentPage = 1;
      renderProductsTable();
      showToast("Thành công", "Đã làm mới danh sách sản phẩm", "success");
    });
  }
}

// ============================================
// 🏪 PHẦN 9: THAO TÁC SẢN PHẨM
// ============================================

/**
 * 👁️ Xem chi tiết sản phẩm
 * @param {number} productId - ID sản phẩm
 */
async function viewProduct(productId) {
  try {
    const response = await productAPI.getProductById(productId);

    console.log('👁️ View product response:', response);

    // Xử lý nhiều cấu trúc response
    let product = response;
    if (response.success && response.data) {
      product = response.data;
    } else if (response.data) {
      product = response.data;
    }

    // Chuyển đổi trạng thái sang tiếng Việt
    const getStatusText = (status) => {
      const statusMap = {
        'Available': 'Đang bán',
        'Unavailable': 'Ngừng bán',
        'Discontinued': 'Ngừng kinh doanh',
        'active': 'Đang bán',
        'inactive': 'Ngừng bán',
        'draft': 'Bản nháp',
        '1': 'Đang bán',
        '0': 'Ngừng bán'
      };
      return statusMap[status] || status || 'Không xác định';
    };

    alert(`
      📱 THÔNG TIN SẢN PHẨM
      ---------------------
      ID: ${product.id || product.product_id}
      Tên: ${product.product_name || product.name}
      SKU: ${product.sku || 'N/A'}
      Danh mục: ${getCategoryText(product.category)}
      Thương hiệu: ${product.brand || product.brand_name || 'Không xác định'}
      Giá: ${formatPrice(product.price)}₫
      Giá vốn: ${formatPrice(product.cost_price || product.cost)}₫
      Tồn kho: ${product.stock || 0}
      Trạng thái: ${getStatusText(product.status)}
      Mô tả: ${product.description || 'Không có'}
    `);
  } catch (error) {
    console.error("❌ Lỗi khi xem chi tiết:", error);
    showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
  }
}

/**
 * ✏️ Mở modal chỉnh sửa sản phẩm
 * @param {number} productId - ID sản phẩm
 */
async function editProduct(productId) {
  try {
    const response = await productAPI.getProductById(productId);

    console.log('✏️ Edit product response:', response);

    // Xử lý nhiều cấu trúc response
    let productData = response;
    if (response.success && response.data) {
      productData = response.data;
    } else if (response.data) {
      productData = response.data;
    }

    if (productData) {
      openEditModal(productData);
    } else {
      showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
    }
  } catch (error) {
    console.error("❌ Lỗi khi chỉnh sửa:", error);
    showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
  }
}

/**
 * ⚠️ Hiển thị modal xác nhận xóa
 * @param {number} productId - ID sản phẩm cần xóa
 * @param {string} productName - Tên sản phẩm
 */
function showDeleteModal(productId, productName) {
  productToDelete = productId;

  const deleteProductName = document.getElementById("deleteProductName");
  if (deleteProductName) deleteProductName.textContent = productName;

  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) deleteModal.classList.add("active");
}

/**
 * 🗑️ Xóa sản phẩm sau khi xác nhận
 */
async function deleteProduct() {
  if (!productToDelete) return;

  try {
    const response = await productAPI.deleteProduct(productToDelete);

    console.log('🗑️ Delete response:', response);

    // Xử lý nhiều cấu trúc response
    let success = false;
    if (response.success) {
      success = true;
    } else if (response.status === 'success') {
      success = true;
    } else if (response.message && response.message.includes('thành công')) {
      success = true;
    } else if (response === '') {
      // Một số API trả về empty response khi thành công
      success = true;
    }

    if (success) {
      closeDeleteModal();
      currentPage = 1;
      await renderProductsTable();
      showToast("Thành công", "Đã xóa sản phẩm thành công", "success");
    } else {
      const errorMsg = response?.message || "Không thể xóa sản phẩm";
      showToast("Lỗi", errorMsg, "error");
    }
  } catch (error) {
    console.error("❌ Lỗi khi xóa:", error);
    showToast("Lỗi", "Không thể xóa sản phẩm: " + error.message, "error");
  }
}

/**
 * ❌ Đóng modal xóa
 */
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) deleteModal.classList.remove("active");
  productToDelete = null;
}

// ============================================
// 🏪 PHẦN 10: HIỂN THỊ TRẠNG THÁI
// ============================================

/**
 * ⏳ Hiển thị trạng thái loading
 */
function showLoadingState() {
  if (!productsTableBody) return;

  productsTableBody.innerHTML = `
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
 * @param {string} errorMessage - Nội dung lỗi
 */
function showErrorState(errorMessage) {
  if (!productsTableBody) return;

  productsTableBody.innerHTML = `
    <tr>
      <td colspan="8">
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #f72585; margin-bottom: 20px;"></i>
          <h3 style="margin-bottom: 12px; color: #495057;">Đã xảy ra lỗi</h3>
          <p style="color: #6c757d; margin-bottom: 20px;">${errorMessage}</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-primary" onclick="renderProductsTable()">
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
 * @param {string} title - Tiêu đề toast
 * @param {string} message - Nội dung toast
 * @param {string} type - Loại toast (success, error, warning)
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
// 🏪 PHẦN 11: XỬ LÝ ẢNH (URL)
// ============================================

/**
 * 🖼️ Thiết lập sự kiện nhập URL ảnh
 */
function setupImageUpload() {
  const productImageUrl = document.getElementById('productImageUrl');
  const imagePreview = document.getElementById('imagePreview');

  if (!productImageUrl || !imagePreview) {
    console.warn("⚠️ Không tìm thấy productImageUrl hoặc imagePreview");
    return;
  }

  console.log("✅ Thiết lập image upload events");

  // Xử lý khi nhập URL
  productImageUrl.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    console.log('📝 Input URL ảnh:', url);

    if (url === '') {
      imagePreview.style.display = 'none';
      console.log('📝 URL trống - ẩn preview');
      return;
    }

    // Kiểm tra URL hợp lệ
    if (isValidImageUrl(url)) {
      console.log('✅ URL hợp lệ - hiển thị preview');
      previewImageFromUrl(url);
    } else {
      console.warn('⚠️ URL không hợp lệ');
    }
  });

  // Preview khi blur (rời khỏi input)
  productImageUrl.addEventListener('blur', (e) => {
    const url = e.target.value.trim();
    console.log('📝 Blur event, URL:', url);
    
    if (url && isValidImageUrl(url)) {
      previewImageFromUrl(url);
    }
  });

  // Preview khi paste
  productImageUrl.addEventListener('paste', (e) => {
    setTimeout(() => {
      const url = e.target.value.trim();
      console.log('📝 Paste event, URL:', url);
      
      if (url && isValidImageUrl(url)) {
        previewImageFromUrl(url);
      }
    }, 100);
  });
}

/**
 * ✅ Kiểm tra URL ảnh hợp lệ
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean}
 */
function isValidImageUrl(url) {
  try {
    const urlObj = new URL(url);
    const isValidProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    console.log(`🔍 Kiểm tra URL: ${isValidProtocol ? '✅' : '❌'} ${url}`);
    return isValidProtocol;
  } catch (e) {
    console.warn("❌ URL không hợp lệ:", url);
    return false;
  }
}

/**
 * 🖼️ Preview ảnh từ URL
 * @param {string} url - URL ảnh
 */
function previewImageFromUrl(url) {
  const imagePreview = document.getElementById('imagePreview');
  const img = imagePreview?.querySelector('img');

  if (!img || !imagePreview) {
    console.warn("⚠️ Không tìm thấy preview container hoặc img element");
    return;
  }

  console.log('🖼️ Preview ảnh từ URL:', url);
  img.src = url;

  img.onerror = () => {
    console.error("❌ Không thể load ảnh từ URL");
    imagePreview.style.display = 'none';
    showToast('Cảnh báo', 'Không thể tải ảnh từ URL này', 'warning');
  };

  img.onload = () => {
    console.log('✅ Ảnh load thành công');
    imagePreview.style.display = 'block';
  };

  // Set loading state
  imagePreview.style.display = 'block';
}

// ============================================
// 🏪 PHẦN 12: MODAL THÊM/SỬA SẢN PHẨM
// ============================================

/**
 * 📝 Mở modal thêm sản phẩm mới
 */
function openAddModal() {
  console.log("📝 openAddModal() - Mở modal thêm sản phẩm");

  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const productForm = document.getElementById("productForm");

  if (!productModal) {
    console.error("❌ Không tìm thấy #productModal");
    showToast("Lỗi", "Không tìm thấy modal", "error");
    return;
  }

  console.log("✅ Tìm thấy productModal");

  // Reset form
  if (productForm) {
    productForm.reset();
    console.log("✅ Reset form");
  } else {
    console.warn("⚠️ Không tìm thấy productForm");
  }

  // Reset ảnh preview
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview) imagePreview.style.display = 'none';

  // Cập nhật tiêu đề
  if (modalTitle) {
    modalTitle.textContent = "Thêm Sản Phẩm Mới";
    console.log("✅ Cập nhật tiêu đề");
  }

  // Đánh dấu chế độ thêm
  isEditing = false;
  currentProductId = null;
  console.log("✅ Đánh dấu chế độ: isEditing = false");

  // Hiển thị modal
  productModal.classList.add("active");
  console.log("✅ Thêm class 'active' vào modal");

  // QUAN TRỌNG: Thiết lập image upload events cho modal mới
  setupImageUpload();
  console.log("✅ Thiết lập image upload events");
}

/**
 * ✏️ Mở modal chỉnh sửa sản phẩm với dữ liệu sản phẩm
 * @param {object} productData - Dữ liệu sản phẩm
 */
function openEditModal(productData) {
  console.log("✏️ openEditModal() - Mở modal chỉnh sửa sản phẩm");
  console.log("📦 Dữ liệu sản phẩm nhận được:", productData);

  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const productForm = document.getElementById("productForm");

  if (!productModal) {
    console.error("❌ Không tìm thấy #productModal");
    return;
  }

  // Cập nhật tiêu đề
  if (modalTitle) {
    modalTitle.textContent = "Chỉnh Sửa Sản Phẩm";
  }

  // Đánh dấu chế độ chỉnh sửa
  isEditing = true;
  currentProductId = productData.id || productData.product_id;
  console.log(`✅ Chế độ chỉnh sửa: productId = ${currentProductId}`);

  // Điền dữ liệu vào form - SỬA ĐỂ KHỚP VỚI DB SCHEMA
  const fieldMappings = {
    productName: ['product_name', 'name', 'productName'],
    productSku: ['sku', 'product_sku'],
    productCategory: ['category', 'category_id'],
    productBrand: ['brand_id', 'brandId', 'brand_id_fk'], // CHỈ LẤY brand_id
    productPrice: ['price', 'product_price'],
    productCost: ['cost_price', 'cost', 'purchase_price'], // SỬA: cost_price là chính
    productStock: ['stock', 'quantity', 'inventory'],
    productStockAlert: ['stock_alert', 'stockAlert', 'low_stock_threshold'],
    productDescription: ['description', 'product_description'],
    productImageUrl: ['image', 'image_url', 'imageUrl'], // URL ảnh
    productRam: ['ram', 'memory', 'RAM'], // RAM
    productStorage: ['storage', 'rom', 'Storage'] // Bộ nhớ
  };

  Object.keys(fieldMappings).forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (!element) return;

    // Tìm giá trị trong productData
    let value = fieldMappings[fieldId]
      .map(key => productData[key])
      .find(v => v !== undefined && v !== null);

    if (value !== undefined) {
      if (element.tagName === 'SELECT') {
        element.value = value;
      } else if (element.tagName === 'TEXTAREA') {
        element.value = value || '';
      } else {
        element.value = value;
      }
      console.log(`  ✅ Điền ${fieldId} = ${value}`);
    } else {
      console.log(`  ⚠️ Không tìm thấy giá trị cho ${fieldId}`);
    }
  });

  // Điền radio button trạng thái
  const statusRadios = document.querySelectorAll('input[name="productStatus"]');
  const statusValue = productData.status || productData.product_status || 'active';
  statusRadios.forEach(radio => {
    radio.checked = radio.value === statusValue;
  });

  // Preview ảnh nếu có
  const imageUrl = productData.image || productData.image_url;
  if (imageUrl) {
    previewImageFromUrl(imageUrl);
  }

  // Hiển thị modal
  productModal.classList.add("active");
  console.log("✅ Hiển thị modal chỉnh sửa");

  // QUAN TRỌNG: Thiết lập image upload events cho modal
  setupImageUpload();
  console.log("✅ Thiết lập image upload events");
}

/**
 * ❌ Đóng modal sản phẩm
 */
function closeProductModal() {
  const productModal = document.getElementById("productModal");
  const productForm = document.getElementById("productForm");

  if (productModal) {
    productModal.classList.remove("active");
  }

  if (productForm) {
    productForm.reset();
  }

  console.log("✅ Đóng modal sản phẩm");
}

/**
 * 💾 Lưu sản phẩm (thêm hoặc chỉnh sửa) - QUAN TRỌNG: SỬA ĐỂ KHỚP DB
 */
async function saveProduct() {
  console.log("💾 Bắt đầu lưu sản phẩm");
  const productForm = document.getElementById("productForm");

  if (!productForm) {
    console.error("❌ Không tìm thấy form sản phẩm");
    showToast("Lỗi", "Không tìm thấy form", "error");
    return;
  }

  // Lấy dữ liệu từ form
  const productName = document.getElementById("productName")?.value?.trim();
  const sku = document.getElementById("productSku")?.value?.trim();
  const category = document.getElementById("productCategory")?.value;
  const brandId = document.getElementById("productBrand")?.value;
  const priceStr = document.getElementById("productPrice")?.value?.trim();
  const costStr = document.getElementById("productCost")?.value?.trim();
  const stockStr = document.getElementById("productStock")?.value?.trim();
  const stockAlertStr = document.getElementById("productStockAlert")?.value?.trim();
  const description = document.getElementById("productDescription")?.value?.trim();
  const ram = document.getElementById("productRam")?.value?.trim();
  const storage = document.getElementById("productStorage")?.value?.trim();
  const imageUrl = document.getElementById('productImageUrl')?.value?.trim();

  console.log('🔍 Dữ liệu từ form:', { productName, sku, category, brandId, imageUrl });
  console.log('🔍 Brand ID chi tiết:', {
    value: brandId,
    type: typeof brandId,
    isEmpty: brandId === '',
    isZero: brandId === '0',
    element: document.getElementById("productBrand"),
    allOptions: Array.from(document.getElementById("productBrand")?.options || []).map(o => ({ value: o.value, text: o.text }))
  });

  // Kiểm tra dữ liệu bắt buộc
  if (!productName || !sku || !category || !brandId || !priceStr || !costStr || !stockStr) {
    showToast("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc (*)", "error");
    console.warn("⚠️ Dữ liệu thiếu:", { productName, sku, category, brandId, priceStr, costStr, stockStr });
    return;
  }

  // Kiểm tra brand_id hợp lệ (phải là số nguyên dương)
  if (!brandId || brandId === "" || brandId === "0") {
    showToast("Lỗi", "Vui lòng chọn thương hiệu", "error");
    console.warn("⚠️ Thương hiệu chưa được chọn");
    return;
  }

  try {
    // Chuyển đổi dữ liệu số
    const price = parseFloat(priceStr) || 0;
    const costPrice = parseFloat(costStr) || 0;
    const stock = parseInt(stockStr, 10) || 0;
    const stockAlert = parseInt(stockAlertStr, 10) || 5;
    const brandIdNumber = parseInt(brandId, 10);

    if (Number.isNaN(brandIdNumber)) {
      showToast("Lỗi", "Thương hiệu không hợp lệ", "error");
      console.warn("⚠️ brandId không hợp lệ", { brandId });
      return;
    }

    // Lấy giá trị status - GIỮ NGUYÊN KHÔNG CHUYỂN ĐỔI
    let statusValue = document.querySelector('input[name="productStatus"]:checked')?.value || 'Available';
    console.log("🔍 Status gửi lên:", statusValue, "(Type:", typeof statusValue, ")");

    // Tạo object dữ liệu gửi lên API - QUAN TRỌNG: KHỚP VỚI DB SCHEMA
    const formData = {
      product_name: productName,
      sku: sku,
      category: category,
      brand_id: brandIdNumber, // ĐÚNG: brand_id (foreign key)
      price: price,
      cost_price: costPrice,
      stock: stock,
      stock_alert: stockAlert,
      description: description || null,
      status: statusValue,
      image: imageUrl || null, // URL ảnh
      ram: ram || null, // RAM
      storage: storage || null // Bộ nhớ
    };

    console.log("📦 Dữ liệu sẽ gửi (khớp DB schema):", formData);
    console.log("📝 Chế độ:", isEditing ? "Chỉnh sửa" : "Thêm mới");
    console.log("🖼️ URL ảnh:", imageUrl ? `Có (${imageUrl})` : "Không có");

    let response;

    if (isEditing && currentProductId) {
      // Chế độ chỉnh sửa: Gọi API update
      console.log(`✏️ Cập nhật sản phẩm ID: ${currentProductId}`);

      if (typeof productAPI.updateProduct !== 'function') {
        console.error("❌ API method updateProduct không tồn tại");
        showToast("Lỗi", "API updateProduct chưa được implement", "error");
        return;
      }

      response = await productAPI.updateProduct(currentProductId, formData);
    } else {
      // Chế độ thêm: Gọi API create với xử lý ảnh
      console.log("➕ Thêm sản phẩm mới");

      // TRY: Nếu có URL ảnh, gửi dùng createProduct (JSON)
      // Nếu không có ảnh hoặc API yêu cầu FormData, sẽ fallback
      if (typeof productAPI.createProduct !== 'function') {
        console.error("❌ API method createProduct không tồn tại");
        showToast("Lỗi", "API createProduct chưa được implement", "error");
        return;
      }

      // Luôn gửi dữ liệu dưới dạng JSON (có hỗ trợ URL ảnh)
      response = await productAPI.createProduct(formData);
    }

    console.log("📨 Response từ API:", response);

    // Xử lý response - Kiểm tra nhiều định dạng thành công
    let success = false;
    let message = "";

    if (response) {
      if (response.success) {
        success = true;
        message = response.message || "Thành công";
      } else if (response.status === 'success') {
        success = true;
        message = response.message || "Thành công";
      } else if (response.message && response.message.toLowerCase().includes('thành công')) {
        success = true;
        message = response.message;
      } else if (response.id || response.product_id) {
        // Nếu response có ID, coi như thành công
        success = true;
        message = "Thành công";
      }
    }

    if (success) {
      closeProductModal();
      currentPage = 1;
      await renderProductsTable();

      const toastMessage = isEditing ? "Đã cập nhật sản phẩm thành công" : "Đã thêm sản phẩm thành công";
      showToast("Thành công", toastMessage, "success");
      console.log("✅ " + toastMessage);
    } else {
      const errorMsg = response?.message || "Không thể lưu sản phẩm";
      showToast("Lỗi", errorMsg, "error");
      console.error("❌ Lỗi từ API:", response);
    }
  } catch (error) {
    // Xử lý lỗi chi tiết
    console.error("💥 Lỗi khi lưu sản phẩm:", error.message);

    let errorMessage = error.message || "Không thể lưu sản phẩm";

    // Nếu là lỗi HTTP 422 (Validation Error)
    if (error.status === 422) {
      console.error("📋 Chi tiết lỗi validation:", error.data);

      if (error.data?.errors) {
        const validationErrors = error.data.errors;
        const errorList = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');

        errorMessage = `Lỗi validation:\n${errorList}`;
      }
    }
    // Nếu là lỗi HTTP 500 (Server Error)
    else if (error.status === 500) {
      console.error("🔥 Chi tiết lỗi server:", error.data);
      
      // Extract more specific error info
      if (error.data?.data?.message) {
        const serverMsg = error.data.data.message;
        console.error("📝 Server message:", serverMsg);
        
        // Parse common constraint violations
        if (serverMsg.includes('brand_id')) {
          // Lấy danh sách brand hiện có để hiển thị
          const brandSelect = document.getElementById('productBrand');
          const availableBrands = Array.from(brandSelect?.options || [])
            .filter(o => o.value && o.value !== '')
            .map(o => `${o.text} (ID: ${o.value})`)
            .join(', ');
          
          errorMessage = `Thương hiệu không tồn tại trong database!\n\n`;
          errorMessage += `Brand ID bạn chọn không hợp lệ.\n`;
          errorMessage += availableBrands 
            ? `Các thương hiệu có sẵn: ${availableBrands}` 
            : 'Không có thương hiệu nào trong hệ thống. Vui lòng thêm thương hiệu trước!';
          
          console.error('❌ Brand ID error. Available brands:', availableBrands);
        } else if (serverMsg.includes('Duplicate') && serverMsg.includes('sku')) {
          errorMessage = "Mã SKU đã tồn tại. Vui lòng sử dụng mã SKU khác.";
        }
      }
    }

    showToast("Lỗi", errorMessage, "error");
    console.error("Error details:", {
      status: error.status,
      message: error.message,
      data: error.data
    });
  }
}

/**
 * 🧹 Xóa tất cả filter
 */
function clearAllFilters() {
  if (categoryFilter) categoryFilter.value = "";
  if (brandFilter) brandFilter.value = "";
  if (stockFilter) stockFilter.value = "";
  if (priceFilter) priceFilter.value = "";
  if (searchInput) searchInput.value = "";

  currentPage = 1;
  renderProductsTable();
  showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

// ============================================
// 🏪 PHẦN 13: KHỞI TẠO ỨNG DỤNG
// ============================================

/**
 * 🚀 Khởi tạo ứng dụng
 */
async function initializeApp() {
  try {
    // 1. Lấy các phần tử DOM
    initializeDOMElements();

    // 2. Kiểm tra kết nối API
    await testAPIConnection();

    // 3. Tải thống kê
    await loadStats();

    // 4. Tải filter options
    await loadFilterOptions();

    // 5. Tải danh sách sản phẩm
    await renderProductsTable();

    // 6. Thiết lập sự kiện
    setupAllEvents();

    console.log("🎉 ===== ỨNG DỤNG ĐÃ KHỞI TẠO THÀNH CÔNG =====");
    showToast("Thành công", "Ứng dụng đã sẵn sàng", "success");

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
  productsTableBody = document.getElementById("productsTableBody");
  categoryFilter = document.getElementById("categoryFilter");
  brandFilter = document.getElementById("brandFilter");
  productBrandSelect = document.getElementById("productBrand");
  stockFilter = document.getElementById("stockFilter");
  priceFilter = document.getElementById("priceFilter");
  searchInput = document.querySelector(".search-box input");
  rowsPerPageSelect = document.getElementById("rowsPerPage");
  addProductBtn = document.getElementById("addProductBtn");
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
  setupImageUpload();

  // ===== SỰ KIỆN MODAL THÊM/SỬA SẢN PHẨM =====

  // Nút thêm sản phẩm
  if (addProductBtn) {
    addProductBtn.addEventListener("click", openAddModal);
  }

  // Nút lưu sản phẩm
  const saveProductBtn = document.getElementById("saveProductBtn");
  if (saveProductBtn) {
    saveProductBtn.addEventListener("click", saveProduct);
  }

  // Nút hủy / đóng modal
  const closeModalBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const productModal = document.getElementById("productModal");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeProductModal);
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeProductModal);
  }

  // Đóng modal khi click bên ngoài
  if (productModal) {
    productModal.addEventListener("click", function (event) {
      if (event.target === productModal) {
        closeProductModal();
      }
    });
  }

  // ===== SỰ KIỆN MODAL XÓA SẢN PHẨM =====

  // Nút xóa sản phẩm
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", deleteProduct);
  }

  // Nút hủy xóa / đóng modal
  const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const deleteModal = document.getElementById("deleteModal");

  if (closeDeleteModalBtn) {
    closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
  }
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  }

  // Đóng modal xóa khi click bên ngoài
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

  // ===== SIDEBAR =====
  const toggleSidebar = document.getElementById('toggleSidebar');
  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", function () {
      document.querySelector(".sidebar").classList.toggle("collapsed");
      const icon = this.querySelector("i");
      icon.style.transform = "rotate(180deg)";
      setTimeout(() => {
        icon.style.transform = "";
      }, 300);
    });
  }

  console.log("✅ Đã thiết lập tất cả sự kiện");
}

/**
 * 🔌 Kiểm tra kết nối API
 */
async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      showToast("Cảnh báo", `API trả về lỗi ${response.status}`, "warning");
    } else {
      console.log("✅ Kết nối API thành công");
    }
  } catch (error) {
    showToast(
      "Lỗi kết nối",
      `Không thể kết nối đến ${API_BASE_URL}`,
      "error"
    );
  }
}

// ============================================
// 🏪 PHẦN 14: CHẠY ỨNG DỤNG
// ============================================

/**
 * 🏁 Chạy ứng dụng khi DOM đã sẵn sàng
 */
document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo ứng dụng
  initializeApp();

  // Hiệu ứng cho thẻ thống kê
  document.querySelectorAll(".stat-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
});

// ============================================
// 🏪 PHẦN 15: EXPORT HÀM RA GLOBAL SCOPE
// ============================================

// 📤 Xuất hàm ra global scope để có thể gọi từ HTML
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.showDeleteModal = showDeleteModal;
window.clearAllFilters = clearAllFilters;
window.renderProductsTable = renderProductsTable;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;

console.log("🚀 Tất cả hàm đã được xuất ra global scope");