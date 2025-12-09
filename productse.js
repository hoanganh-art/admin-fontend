// ========== DỮ LIỆU MẪU ==========
const sampleProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro 128GB",
    sku: "IP15P-128-BLK",
    category: "smartphone",
    brand: "apple",
    price: 25490000,
    cost: 22000000,
    stock: 45,
    stockAlert: 5,
    status: "active",
    description:
      "iPhone 15 Pro với chip A17 Pro, camera 48MP, màn hình Super Retina XDR.",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra",
    sku: "SGSU-512-GRY",
    category: "smartphone",
    brand: "samsung",
    price: 28990000,
    cost: 25000000,
    stock: 32,
    stockAlert: 5,
    status: "active",
    description: "Galaxy S23 Ultra với bút S-Pen, camera 200MP, pin 5000mAh.",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Xiaomi 13 Pro",
    sku: "XM13P-256-BLK",
    category: "smartphone",
    brand: "xiaomi",
    price: 18990000,
    cost: 16000000,
    stock: 28,
    stockAlert: 5,
    status: "active",
    description: "Xiaomi 13 Pro với camera Leica, chip Snapdragon 8 Gen 2.",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w-400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    sku: "AWS9-45-BLK",
    category: "watch",
    brand: "apple",
    price: 11990000,
    cost: 10000000,
    stock: 3,
    stockAlert: 5,
    status: "low-stock",
    description: "Apple Watch Series 9 với chip S9, màn hình Retina luôn bật.",
    image:
      "https://images.unsplash.com/photo-1434493650001-5d43a6fea0a2?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Samsung Galaxy Tab S9",
    sku: "SGTS9-256-SLV",
    category: "tablet",
    brand: "samsung",
    price: 21990000,
    cost: 18500000,
    stock: 15,
    stockAlert: 5,
    status: "active",
    description: "Galaxy Tab S9 với S-Pen, màn hình Dynamic AMOLED 2X.",
    image:
      "https://images.unsplash.com/photo-1546054450-4699c0fa43ea?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "AirPods Pro 2",
    sku: "APP2-WHT",
    category: "accessory",
    brand: "apple",
    price: 6490000,
    cost: 5200000,
    stock: 0,
    stockAlert: 5,
    status: "out-of-stock",
    description:
      "AirPods Pro thế hệ 2 với công nghệ Active Noise Cancellation.",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Oppo Find X6 Pro",
    sku: "OFX6P-512-BLK",
    category: "smartphone",
    brand: "oppo",
    price: 22990000,
    cost: 19500000,
    stock: 18,
    stockAlert: 5,
    status: "active",
    description:
      "Oppo Find X6 Pro với camera Hasselblad, chip Snapdragon 8 Gen 2.",
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Xiaomi Smart Band 8",
    sku: "XMSB8-BLK",
    category: "watch",
    brand: "xiaomi",
    price: 1290000,
    cost: 950000,
    stock: 56,
    stockAlert: 5,
    status: "active",
    description:
      "Xiaomi Smart Band 8 với màn hình AMOLED 1.62 inch, theo dõi sức khỏe.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Vivo X90 Pro",
    sku: "VX90P-256-BLK",
    category: "smartphone",
    brand: "vivo",
    price: 19990000,
    cost: 17000000,
    stock: 22,
    stockAlert: 5,
    status: "active",
    description: "Vivo X90 Pro với camera Zeiss, chip MediaTek Dimensity 9200.",
    image:
      "https://images.unsplash.com/photo-1598327105854-c8674faddf74?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    name: "Samsung Galaxy Buds2 Pro",
    sku: "SGB2P-WHT",
    category: "accessory",
    brand: "samsung",
    price: 3990000,
    cost: 3200000,
    stock: 42,
    stockAlert: 5,
    status: "active",
    description: "Galaxy Buds2 Pro với công nghệ chống ồn chủ động 360°.",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
  },
  {
    id: 11,
    name: "iPad Pro 12.9 M2",
    sku: "IPDP-1TB-GRY",
    category: "tablet",
    brand: "apple",
    price: 38990000,
    cost: 34000000,
    stock: 8,
    stockAlert: 5,
    status: "active",
    description: "iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    name: "Realme GT 5",
    sku: "RGT5-256-BLK",
    category: "smartphone",
    brand: "realme",
    price: 16990000,
    cost: 14500000,
    stock: 2,
    stockAlert: 5,
    status: "low-stock",
    description: "Realme GT 5 với chip Snapdragon 8 Gen 2, sạc nhanh 240W.",
    image:
      "https://images.unsplash.com/photo-1596558450265-85d6bcc0db8c?w=400&h=400&fit=crop",
  },
];

// ========== KHỞI TẠO BIẾN ==========
let currentPage = 1;
let rowsPerPage = 12;
let filteredProducts = [...sampleProducts];
let productToDelete = null;
let isEditing = false;
let currentProductId = null;

// DOM Elements
const toggleSidebar = document.getElementById("toggleSidebar");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const deleteModal = document.getElementById("deleteModal");
const closeModal = document.getElementById("closeModal");
const closeDeleteModal = document.getElementById("closeDeleteModal");
const cancelBtn = document.getElementById("cancelBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const productsTableBody = document.getElementById("productsTableBody");
const selectAll = document.getElementById("selectAll");
const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const stockFilter = document.getElementById("stockFilter");
const priceFilter = document.getElementById("priceFilter");
const applyFilters = document.getElementById("applyFilters");
const clearFilters = document.getElementById("clearFilters");
const resetFilters = document.getElementById("resetFilters");
const rowsPerPageSelect = document.getElementById("rowsPerPage");
const refreshTable = document.getElementById("refreshTable");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.querySelector(".search-box input");
const modalTitle = document.getElementById("modalTitle");
const deleteProductName = document.getElementById("deleteProductName");
const productForm = document.getElementById("productForm");
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");
const closeToast = document.getElementById("closeToast");

// ========== SIDEBAR TOGGLE ==========
toggleSidebar.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("collapsed");
  const icon = this.querySelector("i");
  icon.style.transform = "rotate(180deg)";
  setTimeout(() => {
    icon.style.transform = "";
  }, 300);
});

// ========== MENU ACTIVE STATE ==========
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    if (this.getAttribute("href") === "#") {
      e.preventDefault();
    }
    menuItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
  });
});

// ========== RENDER BẢNG SẢN PHẨM ==========
async function renderProductsTable() {
  try {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i class="fas fa-spinner fa-spin" style="color: var(--primary-color); font-size: 32px; margin-bottom: 16px;"></i>
            <p style="color: var(--gray-600);">Đang tải dữ liệu...</p>
          </div>
        </td>
      </tr>
    `;

    // Lấy dữ liệu từ API
    const filters = {
      category: categoryFilter.value || undefined,
      brand_id: brandFilter.value || undefined,
      stock_status: stockFilter.value || undefined,
      price_range: priceFilter.value || undefined,
      search: searchInput.value.trim() || undefined,
      page: currentPage,
      per_page: rowsPerPage
    };

    const response = await apiService.getProducts(filters);
    
    if (response.success && response.data) {
      const products = response.data.data || [];
      filteredProducts = products;
      renderProductsList(products);
      updateTableInfo(response.data);
      updatePaginationInfo(response.data);
    } else {
      throw new Error(response.message || "Lỗi tải dữ liệu");
    }
  } catch (error) {
    console.error("Error loading products:", error);
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: var(--danger-color); font-size: 32px; margin-bottom: 16px;"></i>
            <h3 style="color: var(--gray-800); margin-bottom: 12px;">Lỗi tải dữ liệu</h3>
            <p style="color: var(--gray-600); margin-bottom: 16px;">${error.message}</p>
            <button class="btn btn-primary" onclick="renderProductsTable()">
              <i class="fas fa-redo"></i> Thử lại
            </button>
          </div>
        </td>
      </tr>
    `;
  }
}

// Hàm render danh sách sản phẩm
function renderProductsList(products) {
  productsTableBody.innerHTML = "";

  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i class="fas fa-box-open" style="color: var(--gray-400); font-size: 32px; margin-bottom: 16px;"></i>
            <h3 style="color: var(--gray-800); margin-bottom: 12px;">Không tìm thấy sản phẩm</h3>
            <p style="color: var(--gray-600); margin-bottom: 16px;">Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
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
    const categoryClass = getCategoryClass(product.category);
    const categoryText = getCategoryText(product.category);
    const brandText = getBrandText(product.brand_id, product.brand);
    const stockStatus = getStockStatus(product.stock);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <input type="checkbox" class="product-checkbox" data-id="${product.id}">
      </td>
      <td>
        <div class="product-info">
          <div class="product-image">
            <img src="${product.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop'}" 
                 alt="${product.product_name}"
                 onerror="this.src='https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop'">
          </div>
          <div class="product-details">
            <div class="product-name">${product.product_name}</div>
            <div class="product-sku">SKU: ${product.sku || 'N/A'}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="product-category ${categoryClass}">${categoryText}</span>
      </td>
      <td>${brandText}</td>
      <td class="product-price">${formatPrice(product.price)}₫</td>
      <td>${product.stock}</td>
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
          <button class="action-btn delete" onclick="showDeleteModal(${product.id}, '${product.product_name.replace(/'/g, "\\'")}')" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    productsTableBody.appendChild(row);
  });
}

// ========== HÀM HỖ TRỢ ==========
function getCategoryClass(category) {
  const classes = {
    smartphone: "category-smartphone",
    tablet: "category-tablet",
    accessory: "category-accessory",
    watch: "category-watch",
  };
  return classes[category] || "category-smartphone";
}

function getCategoryText(category) {
  const texts = {
    smartphone: "Điện thoại",
    tablet: "Máy tính bảng",
    accessory: "Phụ kiện",
    watch: "Đồng hồ",
    laptop: "Laptop",
  };
  return texts[category] || category;
}

function getBrandText(brandId, brandObj) {
  if (brandObj && typeof brandObj === "object") {
    return brandObj.brand_name || "Không xác định";
  }
  // Nếu chỉ là ID, hiển thị ID
  return `Brand ID: ${brandId}`;
}

function getStockStatus(stock, alertLevel) {
  if (stock === 0) return "out-of-stock";
  if (stock <= 5) return "low-stock";
  return "in-stock";
}

function getStockStatusText(status) {
  const texts = {
    "in-stock": "Còn hàng",
    "low-stock": "Sắp hết",
    "out-of-stock": "Hết hàng",
  };
  return texts[status] || status;
}

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateTableInfo(paginationData) {
  if (!paginationData) return;
  const total = paginationData.total || 0;
  const from = paginationData.from || 0;
  const to = paginationData.to || 0;
  const infoElement = document.querySelector(".table-info");
  if (infoElement) {
    infoElement.innerHTML = `Hiển thị <strong>${from}-${to}</strong> trong tổng số <strong>${total}</strong> sản phẩm`;
  }
}

function updatePagination(paginationData) {
  if (!paginationData) return;
  const totalPages = paginationData.last_page || 1;
  const paginationContainer = document.querySelector(".pagination");
  const numberButtons = paginationContainer.querySelectorAll(
    ".pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)"
  );

  // Cập nhật số trang
  numberButtons.forEach((btn, index) => {
    const pageNum = index + 1;
    if (pageNum <= totalPages) {
      btn.textContent = pageNum;
      btn.style.display = "flex";
      btn.classList.toggle("active", pageNum === currentPage);
      btn.onclick = () => {
        currentPage = pageNum;
        renderProductsTable();
      };
    } else {
      btn.style.display = "none";
    }
  });

  // Cập nhật trạng thái nút điều hướng
  document.getElementById("firstPage").disabled = currentPage === 1;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
  document.getElementById("lastPage").disabled = currentPage === totalPages;
}

// ========== FILTER FUNCTIONS ==========
function applyProductFilters() {
  filteredProducts = sampleProducts.filter((product) => {
    // Lọc theo danh mục
    if (categoryFilter.value && product.category !== categoryFilter.value) {
      return false;
    }

    // Lọc theo thương hiệu
    if (brandFilter.value && product.brand !== brandFilter.value) {
      return false;
    }

    // Lọc theo trạng thái kho
    if (stockFilter.value) {
      const stockStatus = getStockStatus(product.stock, product.stockAlert);
      if (stockStatus !== stockFilter.value) {
        return false;
      }
    }

    // Lọc theo giá
    if (priceFilter.value) {
      const price = product.price;
      switch (priceFilter.value) {
        case "low":
          if (price >= 5000000) return false;
          break;
        case "medium":
          if (price < 5000000 || price > 15000000) return false;
          break;
        case "high":
          if (price < 15000000 || price > 30000000) return false;
          break;
        case "premium":
          if (price < 30000000) return false;
          break;
      }
    }

    return true;
  });

  currentPage = 1;
  renderProductsTable();
}

function clearAllFilters() {
  categoryFilter.value = "";
  brandFilter.value = "";
  stockFilter.value = "";
  priceFilter.value = "";
  searchInput.value = "";
  filteredProducts = [];
  currentPage = 1;
  renderProductsTable();
  showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

// Chuẩn hóa payload gửi API từ form
function buildProductPayloadFromForm() {
  const brandValue = document.getElementById("productBrand").value;
  const statusRadio = document.querySelector('input[name="productStatus"]:checked');

  return {
    product_name: document.getElementById("productName").value.trim(),
    sku: document.getElementById("productSku").value.trim(),
    category: document.getElementById("productCategory").value,
    brand_id: brandValue ? Number(brandValue) || brandValue : null,
    price: parseInt(document.getElementById("productPrice").value, 10),
    cost: parseInt(document.getElementById("productCost").value, 10),
    stock: parseInt(document.getElementById("productStock").value, 10),
    stock_alert:
      parseInt(document.getElementById("productStockAlert").value, 10) || 5,
    status: statusRadio ? statusRadio.value : "active",
    description: document.getElementById("productDescription").value.trim(),
    image:
      imagePreview.style.display === "block"
        ? imagePreview.querySelector("img").src
        : "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
  };
}

// ========== MODAL FUNCTIONS ==========
function openProductModal(editMode = false, productData = null) {
  if (editMode && productData) {
    modalTitle.textContent = "Chỉnh Sửa Sản Phẩm";
    isEditing = true;
    currentProductId = productData.id;

    // Điền dữ liệu vào form
    document.getElementById("productName").value = productData.product_name;
    document.getElementById("productSku").value = productData.sku;
    document.getElementById("productCategory").value = productData.category;
    document.getElementById("productBrand").value = productData.brand_id;
    document.getElementById("productPrice").value = productData.price;
    document.getElementById("productCost").value = productData.cost;
    document.getElementById("productStock").value = productData.stock;
    document.getElementById("productStockAlert").value = productData.stock_alert;
    document.getElementById("productDescription").value =
      productData.description;

    // Đặt trạng thái
    const statusRadio = document.querySelector(
      `input[name="productStatus"][value="${productData.status}"]`
    );
    if (statusRadio) statusRadio.checked = true;

    // Hiển thị ảnh preview
    if (productData.image) {
      imagePreview.style.display = "block";
      imagePreview.querySelector("img").src = productData.image;
    }
  } else {
    modalTitle.textContent = "Thêm Sản Phẩm Mới";
    isEditing = false;
    currentProductId = null;
    productForm.reset();
    imagePreview.style.display = "none";
  }

  productModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProductModalFunc() {
  productModal.classList.remove("active");
  document.body.style.overflow = "auto";
  productForm.reset();
  imagePreview.style.display = "none";
  isEditing = false;
  currentProductId = null;
}

async function saveProduct() {
  try {
    // Lấy dữ liệu từ form
    const formData = buildProductPayloadFromForm();

    // Validate dữ liệu
    if (
      !formData.product_name ||
      !formData.sku ||
      !formData.category ||
      !formData.brand_id ||
      !formData.price ||
      !formData.cost ||
      formData.stock === undefined
    ) {
      showToast("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    // Hiệu ứng loading
    saveProductBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    saveProductBtn.disabled = true;

    let response;

    if (isEditing) {
      // Cập nhật sản phẩm qua API
      response = await apiService.updateProduct(currentProductId, formData);
    } else {
      // Thêm sản phẩm mới qua API
      response = await apiService.createProduct(formData);
    }

    if (response.success) {
      // Cập nhật UI
      currentPage = 1;
      await renderProductsTable();
      closeProductModalFunc();

      // Hiển thị thông báo
      showToast(
        "Thành công",
        isEditing
          ? "Đã cập nhật sản phẩm thành công"
          : "Đã thêm sản phẩm mới thành công",
        "success"
      );
    } else {
      showToast("Lỗi", response.message || "Có lỗi xảy ra khi lưu sản phẩm", "error");
    }
  } catch (error) {
    console.error("Error saving product:", error);
    showToast(
      "Lỗi",
      "Không thể kết nối API. Vui lòng kiểm tra máy chủ.",
      "error"
    );
  } finally {
    // Reset nút
    saveProductBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Sản Phẩm';
    saveProductBtn.disabled = false;
  }
}

function showDeleteModal(productId, productName) {
  productToDelete = productId;
  deleteProductName.textContent = productName;
  deleteModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDeleteModalFunc() {
  deleteModal.classList.remove("active");
  document.body.style.overflow = "auto";
  productToDelete = null;
}

async function deleteProduct() {
  if (!productToDelete) return;

  try {
    // Hiệu ứng loading
    confirmDeleteBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
    confirmDeleteBtn.disabled = true;

    // Gửi API xóa
    const response = await apiService.deleteProduct(productToDelete);

    if (response.success) {
      // Cập nhật UI
      currentPage = 1;
      await renderProductsTable();
      closeDeleteModalFunc();

      // Hiển thị thông báo
      showToast("Thành công", "Đã xóa sản phẩm thành công", "success");
    } else {
      showToast("Lỗi", response.message || "Có lỗi xảy ra khi xóa sản phẩm", "error");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    showToast(
      "Lỗi",
      "Không thể kết nối API. Vui lòng kiểm tra máy chủ.",
      "error"
    );
  } finally {
    // Reset nút
    confirmDeleteBtn.innerHTML = '<i class="fas fa-trash"></i> Xóa Sản Phẩm';
    confirmDeleteBtn.disabled = false;
  }
}

function viewProduct(productId) {
  const product = filteredProducts.find((p) => p.id === productId);
  if (product) {
    showToast(
      "Thông tin sản phẩm",
      `${product.product_name} - Giá: ${formatPrice(product.price)}₫ - Tồn kho: ${
        product.stock
      }`,
      "success"
    );
  }
}

function editProduct(productId) {
  const product = filteredProducts.find((p) => p.id === productId);
  if (product) {
    openProductModal(true, product);
  }
}

// ========== TOAST NOTIFICATION ==========
function showToast(title, message, type = "success") {
  toastTitle.textContent = title;
  toastMessage.textContent = message;

  // Đổi màu và icon theo type
  const icon = toastIcon.querySelector("i");
  switch (type) {
    case "success":
      toastIcon.className = "toast-icon success";
      icon.className = "fas fa-check";
      break;
    case "warning":
      toastIcon.className = "toast-icon warning";
      icon.className = "fas fa-exclamation-triangle";
      break;
    case "error":
      toastIcon.className = "toast-icon error";
      icon.className = "fas fa-times";
      break;
  }

  toast.classList.add("show");

  // Tự động đóng sau 5 giây
  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

// ========== EVENT LISTENERS ==========
// Modal events
addProductBtn.addEventListener("click", () => openProductModal());
closeModal.addEventListener("click", closeProductModalFunc);
closeDeleteModal.addEventListener("click", closeDeleteModalFunc);
cancelBtn.addEventListener("click", closeProductModalFunc);
cancelDeleteBtn.addEventListener("click", closeDeleteModalFunc);
saveProductBtn.addEventListener("click", saveProduct);
confirmDeleteBtn.addEventListener("click", deleteProduct);

// Filter events
applyFilters.addEventListener("click", applyProductFilters);
clearFilters.addEventListener("click", () => {
  categoryFilter.value = "";
  brandFilter.value = "";
  stockFilter.value = "";
  priceFilter.value = "";
  applyProductFilters();
  showToast("Thành công", "Đã xóa bộ lọc", "success");
});

resetFilters.addEventListener("click", clearAllFilters);

// Search event
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    const searchTerm = searchInput.value.toLowerCase();
    filteredProducts = sampleProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderProductsTable();
    showToast(
      "Tìm kiếm",
      `Tìm thấy ${filteredProducts.length} sản phẩm phù hợp`,
      "success"
    );
  }
});

// Pagination events
rowsPerPageSelect.addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderProductsTable();
});

refreshTable.addEventListener("click", () => {
  filteredProducts = [...sampleProducts];
  currentPage = 1;
  renderProductsTable();
  showToast("Thành công", "Đã làm mới danh sách sản phẩm", "success");
});

exportBtn.addEventListener("click", () => {
  showToast("Xuất file", "Đang xuất dữ liệu ra file Excel...", "success");
});

// Select all checkbox
selectAll.addEventListener("change", (e) => {
  const checkboxes = document.querySelectorAll(".product-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = e.target.checked;
  });
});

// Pagination button events
document.getElementById("firstPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage = 1;
    renderProductsTable();
  }
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderProductsTable();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderProductsTable();
  }
});

document.getElementById("lastPage").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage = totalPages;
    renderProductsTable();
  }
});

// Image upload simulation
imageUpload.addEventListener("click", () => {
  // Trong thực tế, đây sẽ là input file thực
  const fakeImageUrl =
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop";
  imagePreview.style.display = "block";
  imagePreview.querySelector("img").src = fakeImageUrl;
  showToast("Tải ảnh", "Đã tải ảnh lên thành công", "success");
});

// Close toast
closeToast.addEventListener("click", () => {
  toast.classList.remove("show");
});

// Đóng modal khi click bên ngoài
window.addEventListener("click", (e) => {
  if (e.target === productModal) closeProductModalFunc();
  if (e.target === deleteModal) closeDeleteModalFunc();
});

// ========== KIỂM TRA KẾT NỐI API ==========
async function checkAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      console.log('✅ API kết nối thành công!');
      showToast('Thành công', 'API kết nối thành công', 'success');
      return true;
    } else {
      console.warn('⚠️ API trả về lỗi:', response.status);
      showToast('Cảnh báo', `API trả về lỗi ${response.status}`, 'warning');
      return false;
    }
  } catch (error) {
    console.error('❌ Không thể kết nối API:', error.message);
    showToast(
      'Lỗi',
      `Không thể kết nối API tại ${API_BASE_URL}. Vui lòng kiểm tra máy chủ backend.`,
      'error'
    );
    return false;
  }
}

// ========== KHỞI TẠO ==========
document.addEventListener("DOMContentLoaded", async () => {
  // Kiểm tra kết nối API
  await checkAPIConnection();

  // Render bảng sản phẩm ban đầu
  await renderProductsTable();

  // Thêm hiệu ứng load cho các stat cards
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
