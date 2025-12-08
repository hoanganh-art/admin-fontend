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
 * 🔄 HÀM CHÍNH: Lấy dữ liệu từ API và hiển thị lên bảng
 * 
 * TÁC DỤNG:
 *   - Gọi API lấy dữ liệu sản phẩm dựa trên các bộ lọc và phân trang
 *   - Xử lý các định dạng phản hồi khác nhau từ API
 *   - Cập nhật giao diện bảng sản phẩm với dữ liệu mới
 *   - Cập nhật thông tin phân trang
 * 
 * CÔNG DỤNG:
 *   - Là hàm trung tâm của ứng dụng, được gọi mỗi khi cần refresh dữ liệu
 *   - Xử lý filter, tìm kiếm, phân trang từ giao diện
 *   - Hiển thị loading state, error state hoặc empty state khi cần
 * 
 * THAM SỐ:
 *   - Không có tham số (sử dụng biến global)
 * 
 * TRẢ VỀ:
 *   - Không có (async function, update giao diện trực tiếp)
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
 * 📋 Hiển thị danh sách sản phẩm lên bảng HTML
 * 
 * TÁC DỤNG:
 *   - Duyệt qua mảng sản phẩm và tạo từng dòng (row) trong bảng
 *   - Định dạng dữ liệu (giá tiền, trạng thái kho, ảnh...)
 *   - Tạo các nút thao tác (xem, sửa, xóa) cho mỗi sản phẩm
 *   - Hiển thị empty state khi không có sản phẩm
 * 
 * CÔNG DỤNG:
 *   - Tạo UI bảng sản phẩm từ dữ liệu JSON
 *   - Cho phép người dùng tương tác với từng sản phẩm
 * 
 * THAM SỐ:
 *   - products (Array): Mảng các object sản phẩm từ API
 *     Ví dụ: [{id: 1, product_name: "iPhone", price: 15000000, ...}, ...]
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật innerHTML của productsTableBody)
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
 * 💰 Định dạng số tiền (thêm dấu chấm phân cách hàng nghìn)
 * 
 * TÁC DỤNG:
 *   - Chuyển số tiền thành chuỗi với dấu chấm phân cách
 *   - Làm cho giá tiền dễ đọc hơn
 * 
 * CÔNG DỤNG:
 *   - Hiển thị giá tiền đẹp mắt: 25490000 -> "25.490.000"
 * 
 * THAM SỐ:
 *   - price (number): Số tiền cần định dạng
 * 
 * TRẢ VỀ:
 *   - String: Giá tiền đã định dạng (vd: "25.490.000")
 */
function formatPrice(price) {
  // Kiểm tra nếu price không phải số
  if (!price || isNaN(price)) return "0";
  
  // Chuyển số thành chuỗi và thêm dấu chấm mỗi 3 chữ số
  // Ví dụ: 25490000 => "25.490.000"
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * 🏷️ Chuyển mã danh mục thành tên hiển thị tiếng Việt
 * 
 * TÁC DỤNG:
 *   - Ánh xạ mã danh mục (tiếng Anh) thành tên tiếng Việt
 *   - Nếu không tìm thấy trong map, giữ nguyên mã
 * 
 * CÔNG DỤNG:
 *   - Hiển thị tên danh mục thân thiện với người dùng Việt
 * 
 * THAM SỐ:
 *   - category (string): Mã danh mục (vd: "smartphone", "tablet", "laptop")
 * 
 * TRẢ VỀ:
 *   - String: Tên danh mục tiếng Việt (vd: "Điện thoại", "Máy tính bảng")
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
 * 📦 Xác định trạng thái kho hàng dựa trên số lượng
 * 
 * TÁC DỤNG:
 *   - Kiểm tra số lượng tồn kho
 *   - Trả về mã trạng thái tương ứng
 * 
 * CÔNG DỤNG:
 *   - Xác định màu sắc và text hiển thị trong bảng
 * 
 * THAM SỐ:
 *   - stock (number): Số lượng tồn kho
 * 
 * TRẢ VỀ:
 *   - String: Mã trạng thái
 *     - "out-of-stock": Hết hàng (stock = 0)
 *     - "low-stock": Sắp hết (stock <= 5)
 *     - "in-stock": Còn hàng (stock > 5)
 *     - "unknown": Không xác định (nếu stock bị null)
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
 * 🏷️ Chuyển mã trạng thái kho thành text tiếng Việt
 * 
 * TÁC DỤNG:
 *   - Ánh xạ mã trạng thái thành text hiển thị
 * 
 * CÔNG DỤNG:
 *   - Hiển thị trạng thái kho bằng tiếng Việt thân thiện
 * 
 * THAM SỐ:
 *   - status (string): Mã trạng thái ("in-stock", "low-stock", "out-of-stock", "unknown")
 * 
 * TRẢ VỀ:
 *   - String: Text hiển thị ("Còn hàng", "Sắp hết", "Hết hàng", "Không xác định")
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
 * 🔐 Escape HTML để tránh tấn công XSS (Cross-Site Scripting)
 * 
 * TÁC DỤNG:
 *   - Chuyển các ký tự HTML đặc biệt thành mã HTML an toàn
 *   - Ngăn chặn code JavaScript độc hại được thực thi
 * 
 * CÔNG DỤNG:
 *   - Bảo mật: Khi hiển thị dữ liệu từ người dùng hoặc API
 *   - Ví dụ: "<img src=x onerror=alert('hacked')>" được chuyển thành chuỗi an toàn
 * 
 * THAM SỐ:
 *   - text (string): Chuỗi cần escape
 * 
 * TRẢ VỀ:
 *   - String: Chuỗi đã escape (an toàn hiển thị trong HTML)
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
 * 📋 Cập nhật thông tin phân trang dưới bảng (hiển thị "1-12 trong 150 sản phẩm")
 * 
 * TÁC DỤNG:
 *   - Cập nhật text thông tin phân trang
 *   - Hiển thị sản phẩm bắt đầu, kết thúc, và tổng số
 * 
 * CÔNG DỤNG:
 *   - Người dùng biết đang xem sản phẩm nào trong danh sách
 * 
 * THAM SỐ:
 *   - paginationData (object): Dữ liệu phân trang từ API
 *     {total: 150, from: 1, to: 12, ...}
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật .table-info element)
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
 * 📄 Cập nhật thông tin phân trang (tính tổng số trang)
 * 
 * TÁC DỤNG:
 *   - Tính toán tổng số trang dựa trên tổng sản phẩm và số item mỗi trang
 *   - Gọi hàm cập nhật nút phân trang
 * 
 * CÔNG DỤNG:
 *   - Chuẩn bị dữ liệu để hiển thị nút phân trang (1, 2, 3, ...)
 * 
 * THAM SỐ:
 *   - paginationData (object): {total: 150, per_page: 12, current_page: 1, ...}
 * 
 * TRẢ VỀ:
 *   - Không có (gọi updatePaginationButtons)
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
 * 🖱️ Cập nhật trạng thái các nút phân trang (1, 2, 3, ... First, Prev, Next, Last)
 * 
 * TÁC DỤNG:
 *   - Hiển thị/ẩn các nút số trang (chỉ hiển thị 5 nút quanh trang hiện tại)
 *   - Đánh dấu nút trang hiện tại là active
 *   - Vô hiệu hóa nút First/Prev nếu ở trang 1
 *   - Vô hiệu hóa nút Next/Last nếu ở trang cuối
 *   - Gán sự kiện click cho các nút
 * 
 * CÔNG DỤNG:
 *   - Cho phép người dùng chuyển trang
 *   - Hiển thị UI phân trang chuyên nghiệp
 * 
 * THAM SỐ:
 *   - currentPage (number): Trang hiện tại (vd: 2)
 *   - totalPages (number): Tổng số trang (vd: 13)
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật DOM)
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
 * 📊 Lấy thống kê sản phẩm từ API và cập nhật lên 4 thẻ thống kê
 * 
 * TÁC DỤNG:
 *   - Gọi API lấy thống kê: tổng sản phẩm, đang bán, sắp hết, hết hàng
 *   - Cập nhật các thẻ thống kê trên trang chủ
 * 
 * CÔNG DỤNG:
 *   - Hiển thị overview nhanh về số lượng sản phẩm
 *   - Giúp quản lý nhìn tổng quan tình hình kho
 * 
 * THAM SỐ:
 *   - Không có
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật .stat-card elements)
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
 * 🔧 Lấy danh sách thương hiệu và danh mục từ API để điền vào dropdown filter
 * 
 * TÁC DỤNG:
 *   - Gọi API lấy danh sách brands và categories
 *   - Cập nhật dropdown filter với dữ liệu mới
 * 
 * CÔNG DỤNG:
 *   - Người dùng chỉ nhìn thấy các brand/category thực tế từ database
 *   - Tránh hardcode dữ liệu
 * 
 * THAM SỐ:
 *   - Không có
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật dropdown options)
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
 * 🏷️ Cập nhật dropdown thương hiệu với dữ liệu từ API
 * 
 * TÁC DỤNG:
 *   - Xóa các option cũ trong dropdown brand
 *   - Thêm từng brand từ mảng vào dropdown
 *   - Giữ lại option "Tất cả thương hiệu" đầu tiên
 * 
 * CÔNG DỤNG:
 *   - Tạo danh sách filter động
 * 
 * THAM SỐ:
 *   - brands (Array): Mảng {id, brand_name} từ API
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật brandFilter innerHTML)
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
 * 📂 Cập nhật dropdown danh mục với dữ liệu từ API
 * 
 * TÁC DỤNG:
 *   - Xóa các option cũ trong dropdown category
 *   - Thêm từng danh mục từ mảng vào dropdown
 *   - Giữ lại option "Tất cả danh mục" đầu tiên
 * 
 * CÔNG DỤNG:
 *   - Tạo danh sách filter danh mục động
 * 
 * THAM SỐ:
 *   - categories (Array): Mảng category hoặc {id, label} từ API
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật categoryFilter innerHTML)
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
 * 🔍 Xử lý sự kiện tìm kiếm real-time (debounce)
 * 
 * TÁC DỤNG:
 *   - Lắng nghe sự kiện input trên ô tìm kiếm
 *   - Chờ 500ms sau khi ngừng gõ mới gọi API (debounce)
 *   - Reset về trang 1 khi tìm kiếm
 *   - Nếu ô search trống, load lại dữ liệu gốc
 * 
 * CÔNG DỤNG:
 *   - Tìm kiếm sản phẩm real-time mà không gây lag
 *   - Tiết kiệm API call bằng debounce
 * 
 * THAM SỐ:
 *   - Không có (sử dụng biến global searchInput)
 * 
 * TRẢ VỀ:
 *   - Không có (gán event listener)
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
 * ⚙️ Xử lý sự kiện cho các nút filter (category, brand, stock, price)
 * 
 * TÁC DỤNG:
 *   - Gán event listener cho các dropdown filter
 *   - Gán event listener cho nút "Áp dụng filter" và "Xóa filter"
 *   - Khi filter thay đổi, reset trang 1 và load lại dữ liệu
 * 
 * CÔNG DỤNG:
 *   - Cho phép người dùng lọc sản phẩm theo nhiều tiêu chí
 * 
 * THAM SỐ:
 *   - Không có (sử dụng biến global categoryFilter, brandFilter, ...)
 * 
 * TRẢ VỀ:
 *   - Không có (gán event listener)
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
 * 📑 Xử lý sự kiện phân trang (thay đổi rows per page, làm mới)
 * 
 * TÁC DỤNG:
 *   - Lắng nghe sự kiện thay đổi rows per page
 *   - Lắng nghe click nút "Làm mới" (refresh table)
 *   - Khi thay đổi, reset trang 1 và load lại dữ liệu
 * 
 * CÔNG DỤNG:
 *   - Người dùng có thể chọn xem 12, 25, 50... sản phẩm mỗi trang
 *   - Có nút refresh để cập nhật dữ liệu nhanh
 * 
 * THAM SỐ:
 *   - Không có (sử dụng biến global rowsPerPageSelect)
 * 
 * TRẢ VỀ:
 *   - Không có (gán event listener)
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
 * 👁️ Xem chi tiết sản phẩm
 * 
 * TÁC DỤNG:
 *   - Gọi API lấy chi tiết sản phẩm theo ID
 *   - Hiển thị thông tin sản phẩm trong alert (có thể thay bằng modal)
 * 
 * CÔNG DỤNG:
 *   - Người dùng có thể xem thông tin chi tiết một sản phẩm
 *   - Từ nút "Xem chi tiết" (mắt) trong bảng
 * 
 * THAM SỐ:
 *   - productId (number): ID sản phẩm cần xem
 * 
 * TRẢ VỀ:
 *   - Không có (hiển thị alert hoặc modal)
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
 * ✏️ Mở modal chỉnh sửa sản phẩm
 * 
 * TÁC DỤNG:
 *   - Gọi API lấy thông tin sản phẩm theo ID
 *   - Đánh dấu chế độ chỉnh sửa (isEditing = true)
 *   - Mở modal và điền dữ liệu vào form
 * 
 * CÔNG DỤNG:
 *   - Người dùng có thể sửa thông tin sản phẩm
 *   - Từ nút "Chỉnh sửa" (bút) trong bảng
 * 
 * THAM SỐ:
 *   - productId (number): ID sản phẩm cần sửa
 * 
 * TRẢ VỀ:
 *   - Không có (mở modal)
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
 * 🗑️ Hiển thị modal xác nhận xóa sản phẩm
 * 
 * TÁC DỤNG:
 *   - Lưu ID sản phẩm vào biến global productToDelete
 *   - Hiển thị tên sản phẩm trong modal
 *   - Thêm class 'active' để hiển thị modal
 * 
 * CÔNG DỤNG:
 *   - Xác nhận trước khi xóa (tránh xóa nhầm)
 *   - Từ nút "Xóa" (thùng rác) trong bảng
 * 
 * THAM SỐ:
 *   - productId (number): ID sản phẩm cần xóa
 *   - productName (string): Tên sản phẩm (hiển thị trong modal)
 * 
 * TRẢ VỀ:
 *   - Không có (hiển thị modal)
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
 * ✖️ Xóa sản phẩm sau khi xác nhận (gọi từ nút trong modal)
 * 
 * TÁC DỤNG:
 *   - Gọi API xóa sản phẩm
 *   - Đóng modal xóa
 *   - Load lại danh sách sản phẩm
 *   - Hiển thị thông báo thành công hoặc lỗi
 * 
 * CÔNG DỤNG:
 *   - Xóa sản phẩm khỏi database
 * 
 * THAM SỐ:
 *   - Không có (sử dụng biến global productToDelete)
 * 
 * TRẢ VỀ:
 *   - Không có (gọi API và cập nhật UI)
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
 * ✖️ Đóng modal xác nhận xóa
 * 
 * TÁC DỤNG:
 *   - Xóa class 'active' từ modal (ẩn modal)
 *   - Reset biến productToDelete về null
 * 
 * CÔNG DỤNG:
 *   - Tắt modal xóa (từ nút X hoặc Hủy)
 * 
 * THAM SỐ:
 *   - Không có
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật DOM)
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
 * ⏳ Hiển thị trạng thái loading khi đang tải dữ liệu
 * 
 * TÁC DỤNG:
 *   - Xóa nội dung bảng
 *   - Hiển thị spinner loading và text "Đang tải dữ liệu..."
 * 
 * CÔNG DỤNG:
 *   - Feedback trực quan cho người dùng biết đang tải
 * 
 * THAM SỐ:
 *   - Không có
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật innerHTML productsTableBody)
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
 * 💥 Hiển thị thông báo lỗi khi không tải được dữ liệu
 * 
 * TÁC DỤNG:
 *   - Xóa nội dung bảng
 *   - Hiển thị biểu tượng cảnh báo và thông báo lỗi
 *   - Cung cấp nút "Thử lại" và "Xóa bộ lọc"
 * 
 * CÔNG DỤNG:
 *   - Hiển thị lỗi một cách thân thiện
 * 
 * THAM SỐ:
 *   - errorMessage (string): Nội dung thông báo lỗi
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật innerHTML productsTableBody)
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
 * 🔔 Hiển thị thông báo toast (góc trên cùng màn hình)
 * 
 * TÁC DỤNG:
 *   - Hiển thị toast với tiêu đề, nội dung, và icon
 *   - Tự động ẩn sau 5 giây
 *   - Có 3 loại: success (xanh), error (đỏ), warning (vàng)
 * 
 * CÔNG DỤNG:
 *   - Thông báo kết quả thao tác (xóa, sửa, tìm kiếm...)
 *   - Thay thế alert() để UX tốt hơn
 * 
 * THAM SỐ:
 *   - title (string): Tiêu đề toast
 *   - message (string): Nội dung thông báo
 *   - type (string): "success" | "error" | "warning" (mặc định: "success")
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật DOM)
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
 * 🧹 Xóa tất cả filter và reset về trạng thái ban đầu
 * 
 * TÁC DỤNG:
 *   - Reset tất cả dropdown filter về giá trị rỗng
 *   - Xóa text trong ô tìm kiếm
 *   - Reset về trang 1
 *   - Load lại danh sách sản phẩm gốc
 *   - Hiển thị toast thông báo
 * 
 * CÔNG DỤNG:
 *   - Xóa toàn bộ bộ lọc bằng một cách nhấp
 *   - Từ nút "Xóa tất cả bộ lọc" trong empty state hoặc header
 * 
 * THAM SỐ:
 *   - Không có
 * 
 * TRẢ VỀ:
 *   - Không có (cập nhật UI)
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
 * 🚀 Hàm khởi tạo - chạy khi trang web được tải xong (DOMContentLoaded)
 * 
 * TÁC DỤNG:
 *   - Kiểm tra kết nối API
 *   - Tải thống kê (4 thẻ)
 *   - Tải filter options (brands, categories)
 *   - Tải danh sách sản phẩm đầu tiên
 *   - Gán event listener cho tất cả các nút và dropdown
 *   - Gán event listener cho nút thêm/xóa/sửa sản phẩm
 * 
 * CÔNG DỤNG:
 *   - Khởi tạo toàn bộ ứng dụng khi người dùng truy cập trang
 *   - Là điểm vào chính của ứng dụng
 * 
 * THAM SỐ:
 *   - Không có
 * 
 * TRẢ VỀ:
 *   - Không có (async function)
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
 * 🔌 Kiểm tra kết nối đến API backend
 * 
 * TÁC DỤNG:
 *   - Gửi request GET đến API_BASE_URL/products
 *   - Kiểm tra response status
 *   - Hiển thị thông báo kết quả
 * 
 * CÔNG DỤNG:
 *   - Đảm bảo backend đang chạy trước khi tải dữ liệu
 *   - Giúp debug vấn đề CORS hoặc kết nối
 * 
 * THAM SỐ:
 *   - Không có (sử dụng API_BASE_URL từ products_API.js)
 * 
 * TRẢ VỀ:
 *   - Boolean: true nếu thành công, false nếu lỗi
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