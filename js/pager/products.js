// products.js
// File này xử lý logic hiển thị dữ liệu từ API lên giao diện

// ========== PHẦN 1: KHAI BÁO BIẾN TOÀN CỤC ==========

// Các biến lưu trạng thái của ứng dụng
let currentPage = 1;          // Số trang hiện tại (bắt đầu từ 1)
let rowsPerPage = 12;         // Số sản phẩm hiển thị mỗi trang
let filteredProducts = [];     // Mảng lưu danh sách sản phẩm sau khi filter
let productToDelete = null;   // Lưu ID sản phẩm cần xóa (dùng cho modal xác nhận)
let isEditing = false;        // Cờ kiểm tra đang ở chế độ chỉnh sửa (true) hay thêm mới (false)
let currentProductId = null;  // Lưu ID sản phẩm đang được chỉnh sửa

// ========== PHẦN 2: LẤY CÁC PHẦN TỬ HTML TRONG DOM ==========

// Lấy phần tử tbody của bảng để chèn dữ liệu
const productsTableBody = document.getElementById("productsTableBody");

// Lấy các ô input filter
const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const stockFilter = document.getElementById("stockFilter");
const priceFilter = document.getElementById("priceFilter");

// Lấy ô tìm kiếm
const searchInput = document.querySelector(".search-box input");

// Lấy các nút phân trang
const rowsPerPageSelect = document.getElementById("rowsPerPage");

// Lấy các nút thao tác
const addProductBtn = document.getElementById("addProductBtn");
const applyFilters = document.getElementById("applyFilters");
const clearFilters = document.getElementById("clearFilters");

// ========== PHẦN 3: HÀM CHÍNH - LẤY VÀ HIỂN THỊ SẢN PHẨM ==========

/**
 * Hàm chính: Lấy dữ liệu từ API và hiển thị lên bảng
 */
async function renderProductsTable() {
  try {
    // 1. Hiển thị trạng thái loading
    showLoadingState();
    
    // 2. Tạo object filters từ giá trị của các ô filter
    const filters = {
      page: currentPage,                            // Trang hiện tại
      per_page: rowsPerPage                         // Số item mỗi trang
    };
    
    // Chỉ thêm filter nếu có giá trị (không gửi undefined)
    if (categoryFilter.value) filters.category = categoryFilter.value;
    if (brandFilter.value) filters.brand = brandFilter.value;
    if (stockFilter.value) filters.stock_status = stockFilter.value;
    if (priceFilter.value) filters.price_range = priceFilter.value;
    if (searchInput.value.trim()) filters.search = searchInput.value.trim();
    
    console.log("🔍 Filters đang dùng:", filters);

    // 3. GỌI API ĐỂ LẤY DỮ LIỆU
    // productAPI.getProducts() trả về Promise
    const response = await productAPI.getProducts(filters);
    
    console.log("📦 Dữ liệu nhận từ API:", response);
    console.log("📦 Type of response:", typeof response);
    console.log("📦 Is array:", Array.isArray(response));
    console.log("📦 response.data:", response?.data);
    console.log("📦 response.data.data:", response?.data?.data);

    // 4. KIỂM TRA KẾT QUẢ TỪ API - Xử lý flexible với các format khác nhau
    let products = [];
    let paginationData = {};
    
    // API trả về: {data: {current_page, data: [...], total, per_page, ...}} hoặc tiếng Việt
    // Normalize response data - xử lý cả tiếng Anh và tiếng Việt
    const dataField = response.data || response['dữ liệu'] || response.dữ_liệu;
    
    if (dataField) {
      // Lấy mảng sản phẩm - xử lý cả tiếng Anh và tiếng Việt
      const productsArray = dataField.data || dataField['dữ liệu'] || dataField.dữ_liệu;
      
      if (Array.isArray(productsArray)) {
        products = productsArray;
        
        // Normalize pagination data - xử lý cả tiếng Anh và tiếng Việt
        paginationData = {
          current_page: dataField.current_page || dataField['trang_hiện tại'] || 1,
          page: dataField.current_page || dataField['trang_hiện tại'] || 1,
          total: dataField.total || dataField['tổng'] || 0,
          per_page: dataField.per_page || dataField['mỗi_trang'] || rowsPerPage,
          last_page: dataField.last_page || dataField['trang_cuối_cùng'] || 
                     Math.ceil((dataField.total || dataField['tổng'] || 0) / (dataField.per_page || dataField['mỗi_trang'] || rowsPerPage))
        };
        console.log("✅ Format detected: response.data (Laravel paginated - English or Vietnamese)");
      }
    }
    // Fallback: response là mảng trực tiếp
    else if (Array.isArray(response)) {
      products = response;
      paginationData = {
        total: products.length,
        page: 1,
        per_page: rowsPerPage,
        last_page: 1
      };
      console.log("✅ Format detected: response is array");
    }
    
    console.log("📦 Extracted products count:", products.length);
    console.log("📦 Sample product:", products[0]);
    console.log("📦 Pagination data:", paginationData);
    
    if (products.length > 0) {
      // Lưu vào biến filteredProducts để dùng sau
      filteredProducts = products;
      
      // 5. HIỂN THỊ DANH SÁCH SẢN PHẨM LÊN BẢNG
      renderProductsList(products);
      
      // 6. CẬP NHẬT THÔNG TIN PHÂN TRANG
      if (paginationData.total !== undefined) {
        updateTableInfo(paginationData);
      }
      if (paginationData.page !== undefined) {
        updatePaginationInfo(paginationData);
      }
      
      console.log(`✅ Đã tải ${products.length} sản phẩm`);
    } else {
      // Nếu không có dữ liệu nhưng API trả về success, hiển thị empty state
      console.warn("⚠️ Không có sản phẩm nào");
      console.warn("Response structure:", {
        hasData: 'data' in response,
        responseKeys: Object.keys(response),
        dataKeys: response.data ? Object.keys(response.data) : null
      });
      filteredProducts = [];
      renderProductsList([]); // Hiển thị empty state
    }
    
  } catch (error) {
    // XỬ LÝ LỖI NẾU CÓ
    console.error("💥 Lỗi khi tải sản phẩm:", error);
    
    // Hiển thị thông báo lỗi lên giao diện
    showErrorState(error.message);
    
    // Hiển thị toast thông báo
    showToast("Lỗi", `Không thể tải dữ liệu: ${error.message}`, "error");
  }
}

// ========== PHẦN 4: HÀM HIỂN THỊ DANH SÁCH SẢN PHẨM ==========

/**
 * Hiển thị danh sách sản phẩm lên bảng HTML
 * @param {Array} products - Mảng chứa các object sản phẩm
 */
function renderProductsList(products) {
  // 1. Xóa toàn bộ nội dung cũ trong tbody
  productsTableBody.innerHTML = "";

  // 2. KIỂM TRA NẾU KHÔNG CÓ SẢN PHẨM NÀO
  if (!products || products.length === 0) {
    // Hiển thị thông báo "không có dữ liệu"
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
    return; // Dừng hàm ngay tại đây
  }

  // 3. DUYỆT QUA TỪNG SẢN PHẨM VÀ TẠO HTML
  products.forEach((product) => {
    // 3.1. Xử lý dữ liệu để hiển thị đẹp
    // Normalize product data - xử lý cả tiếng Anh và tiếng Việt
    const productName = product.product_name || product['tên_sản_phẩm'] || 'N/A';
    const category = product.category || product['danh_mục'] || 'N/A';
    const categoryText = getCategoryText(category);
    const brandText = (product.brand && product.brand.brand_name) || 
                      product.brand_name || 
                      product['tên_thương_hiệu'] || 
                      product.brand || 
                      "Không xác định";
    const stock = product.stock || product['tồn_kho'] || 0;
    const stockStatus = getStockStatus(stock);
    const price = product.price || product['giá'] || 0;
    const formattedPrice = formatPrice(price);
    const sku = product.sku || product['mã_sku'] || 'N/A';
    const image = product.image || product['hình_ảnh'] || null;
    
    // 3.2. Tạo một dòng (row) mới trong bảng
    const row = document.createElement("tr");
    
    // 3.3. Tạo HTML cho dòng này
    row.innerHTML = `
      <td>
        <!-- Checkbox để chọn sản phẩm -->
        <input type="checkbox" class="product-checkbox" data-id="${product.id}">
      </td>
      <td>
        <!-- Cột thông tin sản phẩm -->
        <div class="product-info">
          <!-- Ảnh sản phẩm -->
          <div class="product-image">
            <img src="${image || 'https://via.placeholder.com/50'}" 
                 alt="${productName}"
                 onerror="this.src='https://via.placeholder.com/50'">
          </div>
          <!-- Tên và SKU -->
          <div class="product-details">
            <div class="product-name">${productName}</div>
            <div class="product-sku">SKU: ${sku}</div>
          </div>
        </div>
      </td>
      <td>
        <!-- Cột danh mục -->
        <span class="product-category">${categoryText}</span>
      </td>
      <td>
        <!-- Cột thương hiệu -->
        ${brandText}
      </td>
      <td class="product-price">
        <!-- Cột giá (đã định dạng) -->
        ${formattedPrice}₫
      </td>
      <td>
        <!-- Cột số lượng tồn kho -->
        ${stock}
      </td>
      <td>
        <!-- Cột trạng thái kho (có màu sắc) -->
        <span class="stock-status ${stockStatus}">
          ${getStockStatusText(stockStatus)}
        </span>
      </td>
      <td>
        <!-- Cột thao tác với các nút -->
        <div class="product-actions">
          <!-- Nút xem chi tiết -->
          <button class="action-btn view" onclick="viewProduct(${product.id})" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <!-- Nút chỉnh sửa -->
          <button class="action-btn edit" onclick="editProduct(${product.id})" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <!-- Nút xóa -->
          <button class="action-btn delete" onclick="showDeleteModal(${product.id}, '${escapeHtml(productName)}')" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    
    // 3.4. Thêm dòng vừa tạo vào bảng
    productsTableBody.appendChild(row);
  });
}

// ========== PHẦN 5: CÁC HÀM HỖ TRỢ ĐỊNH DẠNG DỮ LIỆU ==========

/**
 * Định dạng số tiền (thêm dấu chấm phân cách hàng nghìn)
 * @param {number} price - Số tiền cần định dạng
 * @returns {string} - Chuỗi đã định dạng
 */
function formatPrice(price) {
  // Kiểm tra nếu price không phải số
  if (!price || isNaN(price)) return "0";
  
  // Chuyển số thành chuỗi và thêm dấu chấm mỗi 3 chữ số
  // Ví dụ: 25490000 => "25.490.000"
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Chuyển mã danh mục thành tên hiển thị
 * @param {string} category - Mã danh mục (vd: "smartphone")
 * @returns {string} - Tên danh mục bằng tiếng Việt
 */
function getCategoryText(category) {
  // Object ánh xạ mã danh mục -> tên tiếng Việt
  const categoryMap = {
    smartphone: "Điện thoại",
    tablet: "Máy tính bảng", 
    accessory: "Phụ kiện",
    watch: "Đồng hồ thông minh",
    laptop: "Laptop",
  };
  
  // Nếu có trong map thì trả về tên, không thì giữ nguyên
  return categoryMap[category] || category;
}

/**
 * Xác định trạng thái kho hàng dựa trên số lượng
 * @param {number} stock - Số lượng tồn kho
 * @returns {string} - Mã trạng thái ("in-stock", "low-stock", "out-of-stock")
 */
function getStockStatus(stock) {
  // Kiểm tra stock có hợp lệ không
  if (stock === undefined || stock === null) return "unknown";
  
  // Xác định trạng thái dựa trên số lượng
  if (stock === 0) return "out-of-stock";       // Hết hàng nếu stock = 0
  if (stock <= 5) return "low-stock";          // Sắp hết nếu stock <= 5
  return "in-stock";                           // Còn hàng nếu stock > 5
}

/**
 * Chuyển mã trạng thái thành text hiển thị
 * @param {string} status - Mã trạng thái
 * @returns {string} - Text hiển thị bằng tiếng Việt
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
 * Escape HTML để tránh tấn công XSS (Cross-Site Scripting)
 * @param {string} text - Chuỗi cần escape
 * @returns {string} - Chuỗi đã escape
 */
function escapeHtml(text) {
  // Tạo một thẻ div ẩn
  const div = document.createElement('div');
  
  // Gán text vào textContent (tự động escape HTML)
  div.textContent = text;
  
  // Lấy lại nội dung đã được escape
  return div.innerHTML;
}

// ========== PHẦN 6: HÀM CẬP NHẬT THÔNG TIN BẢNG ==========

/**
 * Cập nhật thông tin phân trang dưới bảng
 * @param {object} paginationData - Dữ liệu phân trang từ API
 */
function updateTableInfo(paginationData) {
  // Kiểm tra nếu không có dữ liệu phân trang
  if (!paginationData) {
    console.warn("Không có dữ liệu phân trang");
    return;
  }
  
  // Lấy các thông số từ dữ liệu phân trang
  const total = paginationData.total || 0;         // Tổng số sản phẩm
  const from = paginationData.from || 0;           // Sản phẩm bắt đầu (vd: 1)
  const to = paginationData.to || 0;               // Sản phẩm kết thúc (vd: 12)
  
  // Tìm phần tử hiển thị thông tin
  const infoElement = document.querySelector(".table-info");
  
  if (infoElement) {
    // Cập nhật nội dung HTML
    infoElement.innerHTML = `
      Hiển thị <strong>${from}-${to}</strong> trong tổng số <strong>${total}</strong> sản phẩm
    `;
  }
}

/**
 * Cập nhật thông tin phân trang (số trang, nút next/prev)
 * @param {object} paginationData - Dữ liệu phân trang từ API
 */
function updatePaginationInfo(paginationData) {
  if (!paginationData) return;
  
  // Lấy thông tin phân trang - xử lý các format khác nhau từ API
  const currentPage = paginationData.current_page || paginationData.page || 1;
  const totalItems = paginationData.total || 0;
  const itemsPerPage = paginationData.per_page || rowsPerPage || 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || paginationData.last_page || 1;
  
  console.log(`📄 Phân trang: trang ${currentPage}/${totalPages}`);
  
  // Cập nhật các nút phân trang
  updatePaginationButtons(currentPage, totalPages);
}

/**
 * Cập nhật trạng thái các nút phân trang
 * @param {number} currentPage - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 */
function updatePaginationButtons(currentPage, totalPages) {
  // Lấy container chứa các nút phân trang
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;
  
  // 1. CẬP NHẬT CÁC NÚT SỐ TRANG (1, 2, 3, 4, 5)
  
  // Lấy tất cả nút số trang (không bao gồm nút điều hướng)
  const pageButtons = paginationContainer.querySelectorAll(
    '.pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)'
  );
  
  // Tính toán phạm vi trang hiển thị (chỉ hiển thị 5 trang quanh trang hiện tại)
  let startPage = Math.max(1, currentPage - 2);     // Trang bắt đầu
  let endPage = Math.min(totalPages, startPage + 4); // Trang kết thúc
  
  // Điều chỉnh nếu khoảng cách quá ngắn
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  // Duyệt qua 5 nút số trang
  pageButtons.forEach((btn, index) => {
    const pageNum = startPage + index; // Tính số trang cho nút này
    
    if (pageNum <= endPage && pageNum <= totalPages) {
      // Hiển thị nút này
      btn.textContent = pageNum;              // Đặt số trang
      btn.style.display = 'flex';             // Hiển thị nút
      btn.classList.toggle('active', pageNum === currentPage); // Đánh dấu trang active
      
      // Gán sự kiện click để chuyển trang
      btn.onclick = () => {
        console.log(`Chuyển đến trang ${pageNum}`);
        currentPage = pageNum;                // Cập nhật trang hiện tại
        renderProductsTable();                // Load lại dữ liệu
      };
    } else {
      // Ẩn nút này (không cần thiết)
      btn.style.display = 'none';
    }
  });
  
  // 2. CẬP NHẬT NÚT ĐIỀU HƯỚNG (First, Prev, Next, Last)
  
  // Lấy các nút điều hướng
  const firstPageBtn = document.getElementById("firstPage");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const lastPageBtn = document.getElementById("lastPage");
  
  // Vô hiệu hóa nút "First" và "Prev" nếu đang ở trang 1
  if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  
  // Vô hiệu hóa nút "Next" và "Last" nếu đang ở trang cuối
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
  if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
  
  // Gán sự kiện cho các nút điều hướng
  if (firstPageBtn) {
    firstPageBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage = 1;
        renderProductsTable();
      }
    };
  }
  
  if (prevPageBtn) {
    prevPageBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderProductsTable();
      }
    };
  }
  
  if (nextPageBtn) {
    nextPageBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProductsTable();
      }
    };
  }
  
  if (lastPageBtn) {
    lastPageBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage = totalPages;
        renderProductsTable();
      }
    };
  }
}

// ========== PHẦN 7: HÀM LOAD THỐNG KÊ ==========

/**
 * Lấy thống kê từ API và cập nhật lên giao diện
 */
async function loadStats() {
  try {
    console.log("📊 Đang tải thống kê...");
    
    // Gọi API lấy thống kê
    const response = await productAPI.getStats();
    
    // Kiểm tra kết quả
    if (response.success && response.data) {
      const stats = response.data;
      console.log("📊 Thống kê nhận được:", stats);
      
      // CẬP NHẬT 4 THẺ THỐNG KÊ TRÊN GIAO DIỆN
      
      // Thẻ 1: Tổng sản phẩm
      const totalElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
      if (totalElement) totalElement.textContent = stats.total || 0;
      
      // Thẻ 2: Đang bán (Available)
      const availableElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
      if (availableElement) availableElement.textContent = stats.available || 0;
      
      // Thẻ 3: Sắp hết hàng (Low stock)
      const lowStockElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
      if (lowStockElement) lowStockElement.textContent = stats.low_stock || 0;
      
      // Thẻ 4: Hết hàng (Out of stock)
      const outOfStockElement = document.querySelector('.stat-card:nth-child(4) .stat-number');
      if (outOfStockElement) outOfStockElement.textContent = stats.out_of_stock || 0;
      
      console.log("✅ Đã cập nhật thống kê");
      
    } else {
      console.warn("Không nhận được dữ liệu thống kê từ API");
    }
  } catch (error) {
    console.error("❌ Lỗi khi tải thống kê:", error);
  }
}

// ========== PHẦN 8: HÀM LOAD FILTER OPTIONS ==========

/**
 * Lấy danh sách thương hiệu và danh mục từ API để điền vào dropdown
 */
async function loadFilterOptions() {
  try {
    console.log("🔧 Đang tải filter options...");
    
    // 1. LẤY DANH SÁCH THƯƠNG HIỆU
    const brandsResponse = await productAPI.getBrands();
    if (brandsResponse.success && brandsResponse.data) {
      updateBrandFilter(brandsResponse.data);
    }
    
    // 2. LẤY DANH SÁCH DANH MỤC  
    const categoriesResponse = await productAPI.getCategories();
    if (categoriesResponse.success && categoriesResponse.data) {
      updateCategoryFilter(categoriesResponse.data);
    }
    
    console.log("✅ Đã tải filter options");
    
  } catch (error) {
    console.error("❌ Lỗi khi tải filter options:", error);
  }
}

/**
 * Cập nhật dropdown thương hiệu với dữ liệu từ API
 * @param {Array} brands - Mảng chứa các object thương hiệu
 */
function updateBrandFilter(brands) {
  // Kiểm tra nếu dropdown tồn tại
  if (!brandFilter) {
    console.warn("Không tìm thấy dropdown brandFilter");
    return;
  }
  
  // Lưu option đầu tiên ("Tất cả thương hiệu")
  const firstOption = brandFilter.options[0];
  
  // Xóa tất cả options cũ (giữ lại option đầu tiên nếu cần)
  brandFilter.innerHTML = '';
  
  // Thêm lại option "Tất cả"
  brandFilter.appendChild(firstOption);
  
  // Thêm từng thương hiệu vào dropdown
  brands.forEach(brand => {
    const option = document.createElement('option');
    
    // Giả sử API trả về object có trường id và brand_name
    option.value = brand.id || brand.value;          // Giá trị gửi lên API
    option.textContent = brand.brand_name || brand.name || brand.label; // Tên hiển thị
    
    brandFilter.appendChild(option);
  });
  
  console.log(`✅ Đã thêm ${brands.length} thương hiệu vào filter`);
}

/**
 * Cập nhật dropdown danh mục với dữ liệu từ API
 * @param {Array} categories - Mảng chứa các danh mục
 */
function updateCategoryFilter(categories) {
  if (!categoryFilter) {
    console.warn("Không tìm thấy dropdown categoryFilter");
    return;
  }
  
  const firstOption = categoryFilter.options[0];
  categoryFilter.innerHTML = '';
  categoryFilter.appendChild(firstOption);
  
  categories.forEach(category => {
    const option = document.createElement('option');
    
    // Giả sử categories là mảng string hoặc object
    const categoryValue = typeof category === 'object' ? category.value || category.id : category;
    const categoryLabel = typeof category === 'object' ? category.label || category.name : getCategoryText(category);
    
    option.value = categoryValue;
    option.textContent = categoryLabel;
    
    categoryFilter.appendChild(option);
  });
  
  console.log(`✅ Đã thêm ${categories.length} danh mục vào filter`);
}

// ========== PHẦN 9: HÀM XỬ LÝ SỰ KIỆN ==========

/**
 * Xử lý sự kiện tìm kiếm real-time
 */
function setupSearchEvent() {
  if (!searchInput) return;
  
  // Biến để debounce (tránh gọi API liên tục khi gõ)
  let searchTimeout;
  
  // Lắng nghe sự kiện input (gõ phím)
  searchInput.addEventListener("input", function(e) {
    // Lấy giá trị từ ô input, xóa khoảng trắng thừa
    const searchTerm = e.target.value.trim();
    
    console.log(`🔍 Đang tìm kiếm: "${searchTerm}"`);
    
    // Xóa timeout cũ (nếu có)
    clearTimeout(searchTimeout);
    
    // Nếu ô search trống, load lại dữ liệu gốc
    if (searchTerm === "") {
      currentPage = 1;
      renderProductsTable();
      return;
    }
    
    // Đợi 500ms sau khi ngừng gõ mới gọi API (debounce)
    searchTimeout = setTimeout(() => {
      currentPage = 1; // Reset về trang 1 khi tìm kiếm
      renderProductsTable(); // Gọi API với từ khóa tìm kiếm
    }, 500);
  });
}

/**
 * Xử lý sự kiện cho các nút filter
 */
function setupFilterEvents() {
  // Khi category thay đổi
  if (categoryFilter) {
    categoryFilter.addEventListener("change", function() {
      console.log(`🎯 Filter category: ${this.value}`);
      currentPage = 1; // Reset về trang 1
      renderProductsTable(); // Load lại với filter mới
    });
  }
  
  // Khi brand thay đổi
  if (brandFilter) {
    brandFilter.addEventListener("change", function() {
      console.log(`🏷️ Filter brand: ${this.value}`);
      currentPage = 1;
      renderProductsTable();
    });
  }
  
  // Khi stock status thay đổi
  if (stockFilter) {
    stockFilter.addEventListener("change", function() {
      console.log(`📦 Filter stock: ${this.value}`);
      currentPage = 1;
      renderProductsTable();
    });
  }
  
  // Khi price range thay đổi
  if (priceFilter) {
    priceFilter.addEventListener("change", function() {
      console.log(`💰 Filter price: ${this.value}`);
      currentPage = 1;
      renderProductsTable();
    });
  }
  
  // Nút "Áp dụng filter" (nếu có)
  if (applyFilters) {
    applyFilters.addEventListener("click", function() {
      console.log("✅ Áp dụng tất cả filter");
      currentPage = 1;
      renderProductsTable();
      showToast("Thành công", "Đã áp dụng bộ lọc", "success");
    });
  }
  
  // Nút "Xóa filter" (nếu có)
  if (clearFilters) {
    clearFilters.addEventListener("click", function() {
      console.log("🗑️ Xóa tất cả filter");
      clearAllFilters();
    });
  }
}

/**
 * Xử lý sự kiện phân trang
 */
function setupPaginationEvents() {
  // Khi thay đổi số dòng mỗi trang
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener("change", function(e) {
      // Cập nhật số dòng mỗi trang
      rowsPerPage = parseInt(e.target.value);
      currentPage = 1; // Reset về trang 1
      
      console.log(`📄 Thay đổi rows per page: ${rowsPerPage}`);
      
      // Load lại dữ liệu
      renderProductsTable();
    });
  }
  
  // Nút "Làm mới" bảng
  const refreshTable = document.getElementById("refreshTable");
  if (refreshTable) {
    refreshTable.addEventListener("click", function() {
      console.log("🔄 Làm mới bảng");
      currentPage = 1;
      renderProductsTable();
      showToast("Thành công", "Đã làm mới danh sách sản phẩm", "success");
    });
  }
}

// ========== PHẦN 10: HÀM XEM VÀ CHỈNH SỬA SẢN PHẨM ==========

/**
 * Xem chi tiết sản phẩm
 * @param {number} productId - ID sản phẩm
 */
async function viewProduct(productId) {
  try {
    console.log(`👁️ Đang xem sản phẩm ID: ${productId}`);
    
    // Gọi API lấy chi tiết sản phẩm
    const response = await productAPI.getProductById(productId);
    
    if (response.success && response.data) {
      const product = response.data;
      
      // Hiển thị thông tin trong alert (có thể thay bằng modal đẹp hơn)
      alert(`
        📱 THÔNG TIN SẢN PHẨM
        ---------------------
        Tên: ${product.product_name}
        SKU: ${product.sku || 'N/A'}
        Danh mục: ${getCategoryText(product.category)}
        Thương hiệu: ${product.brand || 'Không xác định'}
        Giá: ${formatPrice(product.price)}₫
        Tồn kho: ${product.stock}
        Trạng thái: ${getStockStatusText(getStockStatus(product.stock))}
        ${product.description ? `Mô tả: ${product.description}` : ''}
      `);
      
    } else {
      showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
    }
  } catch (error) {
    console.error("❌ Lỗi khi xem sản phẩm:", error);
    showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
  }
}

/**
 * Mở modal chỉnh sửa sản phẩm
 * @param {number} productId - ID sản phẩm
 */
async function editProduct(productId) {
  try {
    console.log(`✏️ Đang mở chỉnh sửa sản phẩm ID: ${productId}`);
    
    // Gọi API lấy thông tin sản phẩm
    const response = await productAPI.getProductById(productId);
    
    if (response.success && response.data) {
      // Đánh dấu đang ở chế độ chỉnh sửa
      isEditing = true;
      currentProductId = productId;
      
      // Mở modal và điền dữ liệu (hàm này bạn cần tự implement)
      openEditModal(response.data);
      
    } else {
      showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
    }
  } catch (error) {
    console.error("❌ Lỗi khi mở chỉnh sửa:", error);
    showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
  }
}

/**
 * Hiển thị modal xác nhận xóa
 * @param {number} productId - ID sản phẩm cần xóa
 * @param {string} productName - Tên sản phẩm (để hiển thị)
 */
function showDeleteModal(productId, productName) {
  console.log(`🗑️ Mở modal xóa sản phẩm: ${productName} (ID: ${productId})`);
  
  // Lưu ID sản phẩm cần xóa
  productToDelete = productId;
  
  // Hiển thị tên sản phẩm trong modal
  const deleteProductName = document.getElementById("deleteProductName");
  if (deleteProductName) {
    deleteProductName.textContent = productName;
  }
  
  // Hiển thị modal (thêm class 'active')
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.classList.add("active");
  }
}

/**
 * Xóa sản phẩm sau khi xác nhận
 */
async function deleteProduct() {
  if (!productToDelete) {
    console.warn("Không có sản phẩm nào để xóa");
    return;
  }
  
  try {
    console.log(`🗑️ Đang xóa sản phẩm ID: ${productToDelete}`);
    
    // Gọi API xóa sản phẩm
    const response = await productAPI.deleteProduct(productToDelete);
    
    if (response.success) {
      // Đóng modal
      closeDeleteModal();
      
      // Load lại danh sách sản phẩm
      currentPage = 1;
      await renderProductsTable();
      
      // Hiển thị thông báo thành công
      showToast("Thành công", "Đã xóa sản phẩm thành công", "success");
      
    } else {
      showToast("Lỗi", response.message || "Không thể xóa sản phẩm", "error");
    }
  } catch (error) {
    console.error("❌ Lỗi khi xóa sản phẩm:", error);
    showToast("Lỗi", "Không thể xóa sản phẩm", "error");
  }
}

/**
 * Đóng modal xóa
 */
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) {
    deleteModal.classList.remove("active");
  }
  productToDelete = null; // Reset ID sản phẩm cần xóa
}

// ========== PHẦN 11: HÀM HIỂN THỊ TRẠNG THÁI ==========

/**
 * Hiển thị trạng thái loading khi đang tải dữ liệu
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
 * Hiển thị thông báo lỗi khi không tải được dữ liệu
 * @param {string} errorMessage - Thông báo lỗi
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
 * Hiển thị thông báo toast
 * @param {string} title - Tiêu đề toast
 * @param {string} message - Nội dung toast
 * @param {string} type - Loại toast (success, error, warning)
 */
function showToast(title, message, type = "success") {
  // Tìm các phần tử toast trong DOM
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");
  
  if (!toast || !toastTitle || !toastMessage || !toastIcon) {
    console.warn("Không tìm thấy phần tử toast trong DOM");
    return;
  }
  
  // Cập nhật nội dung
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  
  // Cập nhật icon và màu sắc theo type
  const icon = toastIcon.querySelector("i");
  if (icon) {
    switch (type) {
      case "success":
        toastIcon.className = "toast-icon success";
        icon.className = "fas fa-check-circle";
        break;
      case "error":
        toastIcon.className = "toast-icon error";
        icon.className = "fas fa-times-circle";
        break;
      case "warning":
        toastIcon.className = "toast-icon warning";
        icon.className = "fas fa-exclamation-triangle";
        break;
      default:
        toastIcon.className = "toast-icon success";
        icon.className = "fas fa-info-circle";
    }
  }
  
  // Hiển thị toast
  toast.classList.add("show");
  
  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

// ========== PHẦN 12: HÀM TIỆN ÍCH ==========

/**
 * Xóa tất cả filter và reset về trạng thái ban đầu
 */
function clearAllFilters() {
  console.log("🧹 Đang xóa tất cả filter...");
  
  // Reset giá trị các ô filter
  if (categoryFilter) categoryFilter.value = "";
  if (brandFilter) brandFilter.value = "";
  if (stockFilter) stockFilter.value = "";
  if (priceFilter) priceFilter.value = "";
  if (searchInput) searchInput.value = "";
  
  // Reset về trang 1
  currentPage = 1;
  
  // Load lại dữ liệu
  renderProductsTable();
  
  // Hiển thị thông báo
  showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

// ========== PHẦN 13: KHỞI TẠO ỨNG DỤNG ==========

/**
 * Hàm khởi tạo - chạy khi trang web được tải xong
 */
async function initializeApp() {
  console.log("🚀 Đang khởi tạo ứng dụng Quản lý Sản phẩm...");
  
  try {
    // 1. Kiểm tra kết nối API
    await testAPIConnection();
    
    // 2. Tải thống kê
    await loadStats();
    
    // 3. Tải filter options (brands, categories)
    await loadFilterOptions();
    
    // 4. Tải danh sách sản phẩm đầu tiên
    await renderProductsTable();
    
    // 5. Thiết lập các sự kiện
    setupSearchEvent();
    setupFilterEvents();
    setupPaginationEvents();
    
    // 6. Thiết lập sự kiện cho nút "Thêm sản phẩm"
    if (addProductBtn) {
      addProductBtn.addEventListener("click", function() {
        console.log("➕ Mở modal thêm sản phẩm");
        // Reset cờ chỉnh sửa
        isEditing = false;
        currentProductId = null;
        // Mở modal (cần implement hàm openAddModal)
        // openAddModal();
      });
    }
    
    // 7. Thiết lập sự kiện cho nút xác nhận xóa
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", deleteProduct);
    }
    
    // 8. Thiết lập sự kiện đóng modal xóa
    const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
    if (closeDeleteModalBtn) {
      closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
    }
    
    // 9. Thiết lập sự kiện đóng modal xóa khi click bên ngoài
    window.addEventListener("click", function(event) {
      const deleteModal = document.getElementById("deleteModal");
      if (deleteModal && event.target === deleteModal) {
        closeDeleteModal();
      }
    });
    
    console.log("✅ Ứng dụng đã được khởi tạo thành công!");
    showToast("Thành công", "Ứng dụng đã sẵn sàng", "success");
    
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo ứng dụng:", error);
    showToast("Lỗi", "Không thể khởi tạo ứng dụng", "error");
  }
}

/**
 * Kiểm tra kết nối đến API backend
 */
async function testAPIConnection() {
  try {
    console.log("🔌 Đang kiểm tra kết nối API...");
    
    // Thử gọi API đơn giản (endpoint gốc hoặc /products)
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      console.log("✅ Kết nối API thành công!");
      return true;
    } else {
      console.warn(`⚠️ API trả về status: ${response.status}`);
      showToast("Cảnh báo", `API trả về lỗi ${response.status}`, "warning");
      return false;
    }
  } catch (error) {
    console.error("❌ Không thể kết nối đến API:", error.message);
    
    // Hiển thị thông báo chi tiết
    showToast(
      "Lỗi kết nối", 
      `Không thể kết nối đến ${API_BASE_URL}. Kiểm tra:\n1. Backend có đang chạy?\n2. Đúng cổng 6346?\n3. CORS đã cấu hình?`, 
      "error"
    );
    
    return false;
  }
}

// ========== PHẦN 14: CHẠY ỨNG DỤNG ==========

// Đợi cho đến khi toàn bộ DOM được tải xong
document.addEventListener("DOMContentLoaded", function() {
  console.log("📄 DOM đã được tải xong, bắt đầu khởi tạo...");
  
  // Chạy hàm khởi tạo
  initializeApp();
  
  // Thêm hiệu ứng cho các thẻ thống kê
  document.querySelectorAll(".stat-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    
    // Hiệu ứng xuất hiện lần lượt
    setTimeout(() => {
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100); // Mỗi card delay thêm 100ms
  });
});

// Xuất các hàm cần thiết ra global scope để có thể gọi từ HTML
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.showDeleteModal = showDeleteModal;
window.clearAllFilters = clearAllFilters;
window.renderProductsTable = renderProductsTable;