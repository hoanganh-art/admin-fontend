// products.js - Quản lý hiển thị và thao tác sản phẩm

// ========== BIẾN TOÀN CỤC ==========
let currentPage = 1;          // Trang hiện tại
let rowsPerPage = 12;         // Số sản phẩm/trang
let filteredProducts = [];    // Danh sách sau khi lọc
let productToDelete = null;   // ID sản phẩm cần xóa
let isEditing = false;        // Chế độ chỉnh sửa
let currentProductId = null;  // ID sản phẩm đang sửa

// ========== DOM ELEMENTS ==========
const productsTableBody = document.getElementById("productsTableBody"); // Thân bảng sản phẩm
const categoryFilter = document.getElementById("categoryFilter"); //Bộ lọc sản phẩm
const brandFilter = document.getElementById("brandFilter"); // Bộ lọc thương hiệu
const stockFilter = document.getElementById("stockFilter"); // Bộ lọc trạng thái kho
const priceFilter = document.getElementById("priceFilter"); // Bộ lọc khoảng giá
const searchInput = document.querySelector(".search-box input"); // Input tìm kiếm
const rowsPerPageSelect = document.getElementById("rowsPerPage"); // Chọn số dòng/trang
const addProductBtn = document.getElementById("addProductBtn"); // Nút thêm sản phẩm
const applyFilters = document.getElementById("applyFilters"); // Nút áp dụng bộ lọc
const clearFilters = document.getElementById("clearFilters"); // Nút xóa bộ lọc

// ========== HÀM CHÍNH ==========

/**
 * Lấy và hiển thị danh sách sản phẩm
 * Xử lý phân trang, tìm kiếm, lọc dữ liệu
 */
async function renderProductsTable() {
  try {
    showLoadingState();
    
    // Tạo đối tượng filter từ các input
    const filters = {
      page: currentPage,
      per_page: rowsPerPage,
      ...(categoryFilter.value && { category: categoryFilter.value }), // Thêm bộ lọc nếu có giá trị
      ...(brandFilter.value && { brand: brandFilter.value }), // Thêm bộ lọc nếu có giá trị
      ...(stockFilter.value && { stock_status: stockFilter.value }), // Thêm bộ lọc nếu có giá trị
      ...(priceFilter.value && { price_range: priceFilter.value }), // Thêm bộ lọc nếu có giá trị
      ...(searchInput.value.trim() && { search: searchInput.value.trim() }) // Thêm tìm kiếm nếu có giá trị
    };

    // Gọi API lấy dữ liệu
    const response = await productAPI.getProducts(filters);
    
    // Xử lý response từ API
    let products = [];
    let paginationData = {};
    
    const dataField = response.data || response['dữ liệu'] || response.dữ_liệu;
    
    if (dataField) {
      const productsArray = dataField.data || dataField['dữ liệu'] || dataField.dữ_liệu;
      
      if (Array.isArray(productsArray)) {
        products = productsArray; 
        paginationData = {
          current_page: dataField.current_page || dataField['trang_hiện tại'] || 1,
          total: dataField.total || dataField['tổng'] || 0,
          per_page: dataField.per_page || dataField['mỗi_trang'] || rowsPerPage,
          last_page: dataField.last_page || dataField['trang_cuối_cùng'] || 
                     Math.ceil((dataField.total || dataField['tổng'] || 0) / 
                     (dataField.per_page || dataField['mỗi_trang'] || rowsPerPage))
        };
      }
    } else if (Array.isArray(response)) {
      products = response;
      paginationData = {
        total: products.length,
        page: 1,
        per_page: rowsPerPage,
        last_page: 1
      };
    }
    
    if (products.length > 0) {
      filteredProducts = products;
      renderProductsList(products);
      
      // Cập nhật thông tin phân trang
      if (paginationData.total !== undefined) updateTableInfo(paginationData);
      if (paginationData.page !== undefined) updatePaginationInfo(paginationData);
      
      console.log(`✅ Đã tải ${products.length} sản phẩm`);
    } else {
      filteredProducts = [];
      renderProductsList([]);
    }
    
  } catch (error) {
    console.error("💥 Lỗi khi tải sản phẩm:", error);
    showErrorState(error.message);
    showToast("Lỗi", `Không thể tải dữ liệu: ${error.message}`, "error");
  }
}

/**
 * Hiển thị danh sách sản phẩm lên bảng
 */
function renderProductsList(products) {
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

  products.forEach((product) => {
    // Chuẩn hóa dữ liệu sản phẩm
    const productName = product.product_name || product['tên_sản_phẩm'] || 'N/A';
    const categoryText = getCategoryText(product.category || product['danh_mục']);
    const brandText = (product.brand && product.brand.brand_name) || 
                      product.brand_name || 
                      product['tên_thương_hiệu'] || 
                      product.brand || 
                      "Không xác định";
    const stock = product.stock || product['tồn_kho'] || 0;
    const stockStatus = getStockStatus(stock);
    const formattedPrice = formatPrice(product.price || product['giá'] || 0);
    const sku = product.sku || product['mã_sku'] || 'N/A';
    const image = product.image || product['hình_ảnh'] || null;
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
      <td>
        <div class="product-info">
          <div class="product-image">
            <img src="${image || 'https://via.placeholder.com/50'}" 
                 alt="${productName}"
                 onerror="this.src='https://via.placeholder.com/50'">
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
          <button class="action-btn view" onclick="viewProduct(${product.id})" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editProduct(${product.id})" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="showDeleteModal(${product.id}, '${escapeHtml(productName)}')" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    productsTableBody.appendChild(row);
  });
}

// ========== HÀM ĐỊNH DẠNG ==========

/** Định dạng giá tiền: 25490000 → "25.490.000" */
function formatPrice(price) {
  if (!price || isNaN(price)) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Chuyển mã danh mục thành tên tiếng Việt */
function getCategoryText(category) {
  const categoryMap = {
    smartphone: "Điện thoại",
    tablet: "Máy tính bảng", 
    accessory: "Phụ kiện",
    watch: "Đồng hồ thông minh",
    laptop: "Laptop",
  };
  return categoryMap[category] || category;
}

/** Xác định trạng thái kho hàng */
function getStockStatus(stock) {
  if (stock === undefined || stock === null) return "unknown";
  if (stock === 0) return "out-of-stock";
  if (stock <= 5) return "low-stock";
  return "in-stock";
}

/** Chuyển mã trạng thái thành text tiếng Việt */
function getStockStatusText(status) {
  const statusMap = {
    "in-stock": "Còn hàng",
    "low-stock": "Sắp hết", 
    "out-of-stock": "Hết hàng",
    "unknown": "Không xác định"
  };
  return statusMap[status] || status;
}

/** Escape HTML để tránh XSS */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== HÀM PHÂN TRANG ==========

/** Cập nhật thông tin "Hiển thị 1-12 trong 150 sản phẩm" */
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

/** Cập nhật thông tin phân trang */
function updatePaginationInfo(paginationData) {
  if (!paginationData) return;
  
  const currentPage = paginationData.current_page || paginationData.page || 1;
  const totalItems = paginationData.total || 0;
  const itemsPerPage = paginationData.per_page || rowsPerPage || 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || paginationData.last_page || 1;
  
  updatePaginationButtons(currentPage, totalPages);
}

/** Cập nhật giao diện các nút phân trang */
function updatePaginationButtons(currentPage, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;
  
  // Cập nhật nút số trang
  const pageButtons = paginationContainer.querySelectorAll(
    '.pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)'
  );
  
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  pageButtons.forEach((btn, index) => {
    const pageNum = startPage + index;
    
    if (pageNum <= endPage && pageNum <= totalPages) {
      btn.textContent = pageNum;
      btn.style.display = 'flex';
      btn.classList.toggle('active', pageNum === currentPage);
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
  
  if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
  if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
  
  // Gán sự kiện cho nút điều hướng
  if (firstPageBtn) firstPageBtn.onclick = () => { if (currentPage > 1) { currentPage = 1; renderProductsTable(); } };
  if (prevPageBtn) prevPageBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderProductsTable(); } };
  if (nextPageBtn) nextPageBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderProductsTable(); } };
  if (lastPageBtn) lastPageBtn.onclick = () => { if (currentPage < totalPages) { currentPage = totalPages; renderProductsTable(); } };
}

// ========== HÀM THỐNG KÊ ==========

/** Lấy thống kê sản phẩm từ API */
async function loadStats() {
  try {
    const response = await productAPI.getStats();
    
    if (response.success && response.data) {
      const stats = response.data;
      
      // Cập nhật 4 thẻ thống kê
      const totalElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
      const availableElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
      const lowStockElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
      const outOfStockElement = document.querySelector('.stat-card:nth-child(4) .stat-number');
      
      if (totalElement) totalElement.textContent = stats.total || 0;
      if (availableElement) availableElement.textContent = stats.available || 0;
      if (lowStockElement) lowStockElement.textContent = stats.low_stock || 0;
      if (outOfStockElement) outOfStockElement.textContent = stats.out_of_stock || 0;
    }
  } catch (error) {
    console.error("❌ Lỗi khi tải thống kê:", error);
  }
}

// ========== HÀM FILTER ==========

/** Lấy danh sách brands và categories cho dropdown */
async function loadFilterOptions() {
  try {
    // Lấy danh sách thương hiệu
    const brandsResponse = await productAPI.getBrands();
    if (brandsResponse.success && brandsResponse.data) {
      updateBrandFilter(brandsResponse.data);
    }
    
    // Lấy danh sách danh mục  
    const categoriesResponse = await productAPI.getCategories();
    if (categoriesResponse.success && categoriesResponse.data) {
      updateCategoryFilter(categoriesResponse.data);
    }
  } catch (error) {
    console.error("❌ Lỗi khi tải filter options:", error);
  }
}

/** Cập nhật dropdown thương hiệu */
function updateBrandFilter(brands) {
  if (!brandFilter) return;
  
  const firstOption = brandFilter.options[0];
  brandFilter.innerHTML = '';
  brandFilter.appendChild(firstOption);
  
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand.id || brand.value;
    option.textContent = brand.brand_name || brand.name || brand.label;
    brandFilter.appendChild(option);
  });
}

/** Cập nhật dropdown danh mục */
function updateCategoryFilter(categories) {
  if (!categoryFilter) return;
  
  const firstOption = categoryFilter.options[0];
  categoryFilter.innerHTML = '';
  categoryFilter.appendChild(firstOption);
  
  categories.forEach(category => {
    const option = document.createElement('option');
    const categoryValue = typeof category === 'object' ? category.value || category.id : category;
    const categoryLabel = typeof category === 'object' ? category.label || category.name : getCategoryText(category);
    
    option.value = categoryValue;
    option.textContent = categoryLabel;
    categoryFilter.appendChild(option);
  });
}

// ========== SỰ KIỆN ==========

/** Cài đặt tìm kiếm real-time với debounce */
function setupSearchEvent() {
  if (!searchInput) return;
  
  let searchTimeout;
  
  searchInput.addEventListener("input", function(e) {
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

/** Cài đặt sự kiện cho các filter */
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

/** Cài đặt sự kiện phân trang */
function setupPaginationEvents() {
  // Thay đổi số dòng/trang
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener("change", function(e) {
      rowsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderProductsTable();
    });
  }
  
  // Nút làm mới
  const refreshTable = document.getElementById("refreshTable");
  if (refreshTable) {
    refreshTable.addEventListener("click", function() {
      currentPage = 1;
      renderProductsTable();
      showToast("Thành công", "Đã làm mới danh sách sản phẩm", "success");
    });
  }
}

// ========== THAO TÁC SẢN PHẨM ==========

/** Xem chi tiết sản phẩm */
async function viewProduct(productId) {
  try {
    const response = await productAPI.getProductById(productId);
    
    if (response.success && response.data) {
      const product = response.data;
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
    }
  } catch (error) {
    showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
  }
}

/** Mở modal chỉnh sửa sản phẩm */
async function editProduct(productId) {
  try {
    const response = await productAPI.getProductById(productId);
    
    if (response.success && response.data) {
      openEditModal(response.data);
    } else {
      showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
    }
  } catch (error) {
    showToast("Lỗi", "Không thể tải thông tin sản phẩm", "error");
  }
}

/** Hiển thị modal xác nhận xóa */
function showDeleteModal(productId, productName) {
  productToDelete = productId;
  
  const deleteProductName = document.getElementById("deleteProductName");
  if (deleteProductName) deleteProductName.textContent = productName;
  
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) deleteModal.classList.add("active");
}

/** Xóa sản phẩm sau khi xác nhận */
async function deleteProduct() {
  if (!productToDelete) return;
  
  try {
    const response = await productAPI.deleteProduct(productToDelete);
    
    if (response.success) {
      closeDeleteModal();
      currentPage = 1;
      await renderProductsTable();
      showToast("Thành công", "Đã xóa sản phẩm thành công", "success");
    }
  } catch (error) {
    showToast("Lỗi", "Không thể xóa sản phẩm", "error");
  }
}

/** Đóng modal xóa */
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  if (deleteModal) deleteModal.classList.remove("active");
  productToDelete = null;
}

// ========== HIỂN THỊ TRẠNG THÁI ==========

/** Hiển thị trạng thái loading */
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

/** Hiển thị thông báo lỗi */
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

/** Hiển thị toast thông báo */
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

// ========== TIỆN ÍCH ==========

/**
 * 📝 Mở modal thêm sản phẩm mới
 * 
 * TÁC DỤNG:
 *   - Reset form thêm sản phẩm (xóa dữ liệu cũ)
 *   - Cập nhật tiêu đề modal thành "Thêm Sản Phẩm Mới"
 *   - Hiển thị modal bằng class 'active'
 *   - Đánh dấu isEditing = false (chế độ thêm, không phải sửa)
 * 
 * CÔNG DỤNG:
 *   - Cho phép người dùng thêm sản phẩm mới
 *   - Gọi từ nút "Thêm Sản Phẩm" trên header
 * 
 * THAM SỐ: Không có
 * TRẢ VỀ: Không có
 */
function openAddModal() {
  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const productForm = document.getElementById("productForm");
  
  if (!productModal) {
    console.error("Không tìm thấy modal sản phẩm");
    return;
  }
  
  // Reset form
  if (productForm) productForm.reset();
  
  // Cập nhật tiêu đề
  if (modalTitle) modalTitle.textContent = "Thêm Sản Phẩm Mới";
  
  // Đánh dấu chế độ thêm
  isEditing = false;
  currentProductId = null;
  
  // Hiển thị modal
  productModal.classList.add("active");
  console.log("✅ Mở modal thêm sản phẩm");
}

/**
 * ✏️ Mở modal chỉnh sửa sản phẩm với dữ liệu sản phẩm
 * 
 * TÁC DỤNG:
 *   - Cập nhật tiêu đề modal thành "Chỉnh Sửa Sản Phẩm"
 *   - Điền dữ liệu sản phẩm vào các input trong form
 *   - Hiển thị modal
 *   - Đánh dấu isEditing = true (chế độ chỉnh sửa)
 * 
 * CÔNG DỤNG:
 *   - Cho phép người dùng sửa thông tin sản phẩm
 *   - Được gọi khi click nút "Sửa" trong bảng
 * 
 * THAM SỐ:
 *   - productData (object): Dữ liệu sản phẩm từ API
 *     {id, product_name, sku, price, stock, brand, category, ...}
 * 
 * TRẢ VỀ: Không có
 */
function openEditModal(productData) {
  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const productForm = document.getElementById("productForm");
  
  if (!productModal) {
    console.error("Không tìm thấy modal sản phẩm");
    return;
  }
  
  // Cập nhật tiêu đề
  if (modalTitle) modalTitle.textContent = "Chỉnh Sửa Sản Phẩm";
  
  // Đánh dấu chế độ chỉnh sửa
  isEditing = true;
  currentProductId = productData.id;
  
  // Điền dữ liệu vào form
  const fields = {
    productName: 'product_name',
    productSku: 'sku',
    productCategory: 'category',
    productBrand: 'brand_id', // hoặc brand tùy API
    productPrice: 'price',
    productCost: 'cost',
    productStock: 'stock',
    productStockAlert: 'stock_alert',
    productDescription: 'description'
  };
  
  // Điền từng trường dữ liệu
  Object.keys(fields).forEach(fieldId => {
    const element = document.getElementById(fieldId);
    const dataKey = fields[fieldId];
    
    if (element && productData[dataKey] !== undefined) {
      if (element.tagName === 'SELECT') {
        element.value = productData[dataKey];
      } else if (element.tagName === 'TEXTAREA') {
        element.textContent = productData[dataKey];
      } else {
        element.value = productData[dataKey];
      }
    }
  });
  
  // Điền radio button trạng thái
  const statusRadios = document.querySelectorAll('input[name="productStatus"]');
  statusRadios.forEach(radio => {
    radio.checked = radio.value === (productData.status || 'active');
  });
  
  // Hiển thị modal
  productModal.classList.add("active");
  console.log(`✅ Mở modal chỉnh sửa sản phẩm ID: ${productData.id}`);
}

/**
 * ❌ Đóng modal sản phẩm
 * 
 * TÁC DỤNG:
 *   - Xóa class 'active' khỏi modal (ẩn modal)
 *   - Reset form để chuẩn bị mở lại
 * 
 * CÔNG DỤNG:
 *   - Tắt modal khi click nút "Hủy" hoặc "X"
 * 
 * THAM SỐ: Không có
 * TRẢ VỀ: Không có
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
 * 💾 Lưu sản phẩm (thêm hoặc chỉnh sửa)
 * 
 * TÁC DỤNG:
 *   - Kiểm tra form có hợp lệ không
 *   - Lấy dữ liệu từ các input
 *   - Gọi API thêm hoặc sửa sản phẩm
 *   - Đóng modal
 *   - Load lại danh sách sản phẩm
 *   - Hiển thị thông báo thành công hoặc lỗi
 * 
 * CÔNG DỤNG:
 *   - Lưu sản phẩm mới hoặc cập nhật sản phẩm cũ
 *   - Gọi từ nút "Lưu Sản Phẩm" trong modal
 * 
 * THAM SỐ: Không có (sử dụng dữ liệu từ form)
 * TRẢ VỀ: Không có
 */
async function saveProduct() {
  const productForm = document.getElementById("productForm");
  
  // Kiểm tra form có hợp lệ
  if (!productForm || !productForm.checkValidity()) {
    showToast("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
    return;
  }
  
  try {
    // Lấy dữ liệu từ form
    const formData = {
      product_name: document.getElementById("productName")?.value,
      sku: document.getElementById("productSku")?.value,
      category: document.getElementById("productCategory")?.value,
      brand: document.getElementById("productBrand")?.value,
      price: parseInt(document.getElementById("productPrice")?.value),
      cost: parseInt(document.getElementById("productCost")?.value),
      stock: parseInt(document.getElementById("productStock")?.value),
      stock_alert: parseInt(document.getElementById("productStockAlert")?.value),
      description: document.getElementById("productDescription")?.value,
      status: document.querySelector('input[name="productStatus"]:checked')?.value || 'active'
    };
    
    let response;
    
    if (isEditing && currentProductId) {
      // Chế độ chỉnh sửa: Gọi API update
      response = await productAPI.updateProduct(currentProductId, formData);
      console.log(`✏️ Cập nhật sản phẩm ID: ${currentProductId}`);
    } else {
      // Chế độ thêm: Gọi API create
      response = await productAPI.createProduct(formData);
      console.log("➕ Thêm sản phẩm mới");
    }
    
    if (response.success) {
      closeProductModal();
      currentPage = 1;
      await renderProductsTable();
      
      const message = isEditing ? "Đã cập nhật sản phẩm thành công" : "Đã thêm sản phẩm thành công";
      showToast("Thành công", message, "success");
    } else {
      showToast("Lỗi", response.message || "Không thể lưu sản phẩm", "error");
    }
  } catch (error) {
    console.error("❌ Lỗi khi lưu sản phẩm:", error);
    showToast("Lỗi", "Không thể lưu sản phẩm", "error");
  }
}

/** Xóa tất cả filter */
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

// ========== KHỞI TẠO ==========

/** Khởi tạo ứng dụng */
async function initializeApp() {
  try {
    await testAPIConnection();
    await loadStats();
    await loadFilterOptions();
    await renderProductsTable();
    
    // Thiết lập sự kiện
    setupSearchEvent();
    setupFilterEvents();
    setupPaginationEvents();
    
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
      productModal.addEventListener("click", function(event) {
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
      deleteModal.addEventListener("click", function(event) {
        if (event.target === deleteModal) {
          closeDeleteModal();
        }
      });
    }
    
    // Đóng toast
    const closeToastBtn = document.getElementById("closeToast");
    const toast = document.getElementById("toast");
    if (closeToastBtn && toast) {
      closeToastBtn.addEventListener("click", function() {
        toast.classList.remove("show");
      });
    }
    
    showToast("Thành công", "Ứng dụng đã sẵn sàng", "success");
  } catch (error) {
    showToast("Lỗi", "Không thể khởi tạo ứng dụng", "error");
  }
}

/** Kiểm tra kết nối API */
async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      showToast("Cảnh báo", `API trả về lỗi ${response.status}`, "warning");
    }
  } catch (error) {
    showToast(
      "Lỗi kết nối", 
      `Không thể kết nối đến ${API_BASE_URL}`, 
      "error"
    );
  }
}

// ========== CHẠY ỨNG DỤNG ==========

document.addEventListener("DOMContentLoaded", function() {
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

// Xuất hàm ra global scope
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.showDeleteModal = showDeleteModal;
window.clearAllFilters = clearAllFilters;
window.renderProductsTable = renderProductsTable;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;