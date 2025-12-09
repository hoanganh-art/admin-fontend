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
