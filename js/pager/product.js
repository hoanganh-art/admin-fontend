//============Biến toàn cục============//
let currentPage = 1; // Trang hiện tại
let rowsPerPage = 12; // Số sản phẩm/trang
let filteredProducts = []; // Danh sách sau khi lọc
let productToDelete = null; // ID sản phẩm cần xóa
let isEditing = false; // Chế độ chỉnh sửa
let currentProductId = null; // ID sản phẩm đang sửa

//============Thành phầm DOM ============//
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

//=============Hàm Chính =============//

async function renderProductsTable() {
  try {
    showLoadingState(); // Hiển thị trạng thái tải

    //Tạo đối tượng filters từ các input
    const filters = {
      page: currentPage, // Trang hiện tại
      per_page: rowsPerPage, // Số sản phẩm/trang

      ...(categoryFilter.value ? { category: categoryFilter.value } : {}), // Thêm bộ lọc danh mục nếu có
      ...(brandFilter.value ? { brand: brandFilter.value } : {}), // Thêm bộ lọc thương hiệu nếu có
      ...(stockFilter.value ? { stock_status: stockFilter.value } : {}), // Thêm bộ lọc trạng thái kho nếu có
      ...(priceFilter.value ? { price_range: priceFilter.value } : {}), // Thêm bộ lọc khoảng giá nếu có
      ...(searchInput.value ? { search: searchInput.value.trim() } : {}), // Thêm từ khóa tìm kiếm nếu có
    };

    //Gọi API lấy dữ liệu
    const response = await productAPI.getProducts(filters); // Gọi API lấy danh sách sản phẩm với bộ lọc

    //xử lý response từ API
    let products = []; // Mảng lưu sản phẩm
    let paginationData = {}; // Dữ liệu phân trang

    const dataField = response.data || response; // Lấy trường data từ response

    // Kiểm tra nếu có phân trang
    if (dataField) {
      const dataField =
        response.data || response["dữ liệu"] || response.dữ_liệu; // Hỗ trợ nhiều ngôn ngữ

      // Kiểm tra nếu có phân trang
      if (Array.isArray(productsArray)) {
        products = productsArray; // Lấy mảng sản phẩm
        // Lấy dữ liệu phân trang
        paginationData = {
          current_page:
            dataField.current_page || dataField["trang_hiện tại"] || 1, // Trang hiện tại
          total: dataField.total || dataField["tổng"] || 0, // Tổng số sản phẩm
          per_page: dataField.per_page || dataField["mỗi_trang"] || rowsPerPage, // Số sản phẩm/trang
          last_page:
            dataField.last_page ||
            dataField["trang_cuối_cùng"] || // Tính tổng số trang
            Math.ceil(
              (dataField.total || dataField["tổng"] || 0) /
                (dataField.per_page || dataField["mỗi_trang"] || rowsPerPage)
            ),
        };
      } else if (Array.isArray(response)) {
        products = response; // Nếu response là mảng sản phẩm

        // Tạo dữ liệu phân trang giả định
        paginationData = {
          total: products.length, // Tổng số sản phẩm
          page: 1, // Trang hiện tại
          per_page: rowsPerPage, // Số sản phẩm/trang
          last_page: 1, // Chỉ có 1 trang
        };
      }

      // Hiển thị sản phẩm hoặc thông báo không có sản phẩm
      if (products.length > 0) {
        filteredProducts = products;
        renderProductsList(products);

        // Cập nhật thông tin phân trang
        if (paginationData.total !== undefined) updateTableInfo(paginationData);
        if (paginationData.page !== undefined)
          updatePaginationInfo(paginationData);

        console.log(`✅ Đã tải ${products.length} sản phẩm`);
      } else {
        filteredProducts = [];
        renderProductsList([]);
      }
    }
  } catch (error) {
    console.error("💥 Lỗi khi tải sản phẩm", error);
    showErrorState(error.message);
    showToast("Lỗi", `Không thể tải dữ liệu: ${error.message}`, "error");
  }
}

/**c\\
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
    const productName =
      product.product_name || product["tên_sản_phẩm"] || "N/A";
    const categoryText = getCategoryText(
      product.category || product["danh_mục"]
    );

    let brandText = "Không xác định";
    if (product.brand && typeof product.brand === "object") {
      brandText =
        product.brand.brand_name || product.brand.name || "Không xác định";
    } else if (product.brand_name) {
      brandText = product.brand_name;
    } else if (product.brand) {
      brandText = product.brand;
    }

    const stock = product.stock || product["tồn_kho"] || 0;
    const stockStatus = getStockStatus(stock);

    // FIX 1: Sửa hàm formatPrice để chắc chắn xử lý đúng
    const priceValue = product.price || product["giá"] || 0;
    const formattedPrice = formatPrice(priceValue);

    const sku = product.sku || product["mã_sku"] || "N/A";
    const image = product.image || product["hình_ảnh"] || null;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="product-checkbox" data-id="${
        product.id
      }"></td>
      <td>
        <div class="product-info">
          <div class="product-image">
            <img src="${image || "https://via.placeholder.com/50"}" 
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
          <button class="action-btn view" onclick="viewProduct(${
            product.id
          })" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editProduct(${
            product.id
          })" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="showDeleteModal(${
            product.id
          }, '${escapeHtml(productName)}')" title="Xóa">
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
    unknown: "Không xác định",
  };
  return statusMap[status] || status;
}

/** Escape HTML để tránh XSS */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
