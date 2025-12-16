// ============================================
// 📦 PHẦN 1: CẤU HÌNH API & SERVICE (QUAN TRỌNG)
// ============================================

// ========== CẤU HÌNH API ENDPOINTS ==========

// 📍 Địa chỉ backend server - THAY ĐỔI PORT NÀY THEO SERVER CỦA BẠN
// Mặc định Laravel: http://localhost:8000
// Nếu bạn chạy `php artisan serve --port=6346` thì dùng port 6346
const API_BASE_URL = "http://127.0.0.1:6346"; // ❗ SỬA PORT NẾU CẦN

// 📋 Danh sách các API endpoints - KHỚP VỚI routes trong api.php
const API_ENDPOINTS = {
  // 🛒 ĐƠN HÀNG (Endpoints chính)
  orders: "/api/invoices", // GET: Lấy danh sách, POST: Tạo mới
  orderDetail: (id) => `/api/invoices/${id}`, // GET: Chi tiết, PUT: Sửa, DELETE: Xóa
  orderStatus: (id) => `/api/invoices/${id}/status`, // PUT: Cập nhật trạng thái
  ordersStats: "/api/invoices/stats", // GET: Thống kê đơn hàng

  // 👥 KHÁCH HÀNG & NHÂN VIÊN (Để hiển thị thông tin)
  customers: "/api/customers", // GET: Danh sách khách hàng
  employees: "/api/employees", // GET: Danh sách nhân viên
  // 📱 SẢN PHẨM (Để hiển thị trong chi tiết đơn)
  products: "/api/products", // GET: Danh sách sản phẩm
  productDetail: (id) => `/api/products/${id}`, // GET: Chi tiết sản phẩm
};

// ========== LỚP API SERVICE ==========

// 🚀 Lớp OrderAPIService - chứa tất cả phương thức gọi API liên quan đến đơn hàng
class OrderAPIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json", // Dữ liệu gửi đi là JSON
      Accept: "application/json", // Chấp nhận dữ liệu trả về là JSON
    };
  }

  /**
   * 🔄 Hàm request chung để gọi API
   * @param {string} endpoint - Đường dẫn API (vd: "/api/orders")
   * @param {object} options - Tùy chọn request (method, body, headers)
   * @returns {Promise} - Promise chứa dữ liệu từ API
   */
  async request(endpoint, options = {}) {
    try {
      // Tạo URL đầy đủ bằng cách nối baseUrl và endpoint
      const url = `${this.baseUrl}${endpoint}`;

      console.log("🔗 API Request URL:", url); // Debug: In ra URL được gọi
      if (options.body) {
        console.log("📦 Request body:", JSON.parse(options.body));
      }

      // Gửi request tới server bằng fetch API
      const response = await fetch(url, {
        ...options, // Sao chép các tùy chọn từ tham số
        headers: { ...this.headers, ...options.headers }, // Kết hợp headers
      });

      // Lấy dữ liệu từ response
      let data;
      try {
        data = await response.json(); // Cố gắng parse thành JSON
      } catch (e) {
        // Nếu response không phải JSON, lấy text
        data = await response.text();
      }

      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        console.error("❌ API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Tạo error message chi tiết
        let userMessage = `Lỗi ${response.status}: ${response.statusText}`;
        if (data?.message) userMessage = data.message;

        const error = new Error(userMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      console.log("✅ API Response received:", data); // Log dữ liệu nhận được
      return data;
    } catch (error) {
      console.error("💥 API Request Error:", error.message);
      throw error;
    }
  }

  // ========== PHƯƠNG THỨC API CHO ĐƠN HÀNG ==========

  /**
   * 📋 Lấy danh sách đơn hàng với filter và pagination
   * @param {object} params - Tham số filter (page, status, payment_method, ...)
   * @returns {Promise} - Danh sách đơn hàng
   */
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.orders}?${queryString}`
      : API_ENDPOINTS.orders;

    console.log("📋 Fetching orders with params:", params);
    return this.request(endpoint);
  }

  /**
   * 📊 Lấy thống kê đơn hàng
   * @returns {Promise} - Dữ liệu thống kê (tổng, pending, completed, ...)
   */
  async getOrderStats() {
    console.log("📊 Fetching order statistics");
    return this.request(API_ENDPOINTS.ordersStats);
  }

  /**
   * 👁️ Lấy chi tiết đơn hàng theo ID
   * @param {number|string} id - ID đơn hàng
   * @returns {Promise} - Chi tiết đơn hàng
   */
  async getOrderById(id) {
    console.log(`👁️ Fetching order details for ID: ${id}`);
    return this.request(API_ENDPOINTS.orderDetail(id));
  }

  /**
   * ➕ Tạo đơn hàng mới
   * @param {object} orderData - Dữ liệu đơn hàng mới
   * @returns {Promise} - Kết quả tạo đơn hàng
   */
  async createOrder(orderData) {
    console.log("➕ Creating new order:", orderData);
    return this.request(API_ENDPOINTS.orders, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  /**
   * ✏️ Cập nhật đơn hàng
   * @param {number|string} id - ID đơn hàng cần cập nhật
   * @param {object} orderData - Dữ liệu đơn hàng mới
   * @returns {Promise} - Kết quả cập nhật
   */
  async updateOrder(id, orderData) {
    console.log(`✏️ Updating order ID: ${id}`, orderData);
    return this.request(API_ENDPOINTS.orderDetail(id), {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  }

  /**
   * 🔄 Cập nhật trạng thái đơn hàng
   * @param {number|string} id - ID đơn hàng
   * @param {string} status - Trạng thái mới (paid, unpaid, pending)
   * @param {string} note - Ghi chú (tùy chọn)
   * @returns {Promise} - Kết quả cập nhật trạng thái
   */
  async updateOrderStatus(id, status, note = "") {
    console.log(`🔄 Updating status for order ${id} to: ${status}`);

    // Chuẩn hóa status về enum hợp lệ
    const normalizedStatus = (status || "").toString().trim().toLowerCase();
    const allowedStatuses = ["paid", "unpaid", "pending"];
    const finalStatus = allowedStatuses.includes(normalizedStatus)
      ? normalizedStatus
      : "pending";

    // Backend chỉ hỗ trợ PUT (cần full data), không hỗ trợ PATCH
    // Bước 1: Lấy thông tin đơn hàng hiện tại
    const currentOrder = await this.getOrderById(id);
    console.log(`📥 Current order data:`, currentOrder);

    // Lấy dữ liệu từ response
    let orderData = currentOrder;
    if (currentOrder.success && currentOrder.data) {
      orderData = currentOrder.data;
    } else if (currentOrder.data) {
      orderData = currentOrder.data;
    }

    // Bước 2: Merge status mới vào dữ liệu hiện tại
    const updatedData = {
      customer_id: orderData.customer_id,
      employee_id: orderData.employee_id,
      invoice_date: orderData.invoice_date,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method || "cash",
      status: finalStatus // Status mới đã chuẩn hóa
    };

    console.log(`📤 Updated order data:`, updatedData);

    // Bước 3: Gửi PUT request với full data
    return this.request(API_ENDPOINTS.orderDetail(id), {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
  }

  /**
   * 🗑️ Xóa đơn hàng
   * @param {number|string} id - ID đơn hàng cần xóa
   * @returns {Promise} - Kết quả xóa
   */
  async deleteOrder(id) {
    console.log(`🗑️ Deleting order ID: ${id}`);
    return this.request(API_ENDPOINTS.orderDetail(id), {
      method: "DELETE",
    });
  }

  // ========== PHƯƠNG THỨC API BỔ SUNG ==========

  /**
   * 👥 Lấy danh sách khách hàng
   * @returns {Promise} - Danh sách khách hàng
   */
  async getCustomers() {
    console.log("👥 Fetching customers list");
    return this.request(API_ENDPOINTS.customers);
  }

  /**
   * 👔 Lấy danh sách nhân viên
   * @returns {Promise} - Danh sách nhân viên
   */
  async getEmployees() {
    console.log("👔 Fetching employees list");
    return this.request(API_ENDPOINTS.employees);
  }

  /**
   * 📱 Lấy danh sách sản phẩm
   * @param {object} params - Tham số filter (đơn giản)
   * @returns {Promise} - Danh sách sản phẩm
   */
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.products}?${queryString}`
      : API_ENDPOINTS.products;

    console.log("📱 Fetching products for order");
    return this.request(endpoint);
  }
}

// Tạo instance toàn cục của API Service
const orderAPI = new OrderAPIService();

// ============================================
// 📦 PHẦN 2: QUẢN LÝ ĐƠN HÀNG - BIẾN VÀ DOM
// ============================================

// ========== BIẾN TOÀN CỤC ==========

let currentPage = 1; // Trang hiện tại
let rowsPerPage = 10; // Số đơn hàng/trang
let filteredOrders = []; // Danh sách đơn hàng sau khi lọc
let currentStatusFilter = "all"; // Trạng thái filter hiện tại
let currentOrderId = null; // ID đơn hàng đang xem/chỉnh sửa

// ========== DOM ELEMENTS ==========

// 📌 Lấy các phần tử DOM từ HTML
let ordersTableBody, statusFilter, paymentFilter, amountFilter;
let dateFrom, dateTo, searchInput, rowsPerPageSelect;
let createOrderBtn, applyFiltersBtn, clearFiltersBtn;

// ============================================
// 📦 PHẦN 3: HIỂN THỊ DANH SÁCH ĐƠN HÀNG
// ============================================

/**
 * 📋 Lấy và hiển thị danh sách đơn hàng từ API
 * Xử lý phân trang, tìm kiếm, lọc dữ liệu
 */
async function renderOrdersTable() {
  try {
    showLoadingState(); // Hiển thị trạng thái loading

    // Tạo đối tượng filter từ các input
    const filters = {
      page: currentPage,
      per_page: rowsPerPage,
      ...(currentStatusFilter !== "all" && { status: currentStatusFilter }),
      ...(statusFilter && statusFilter.value && { status: statusFilter.value }),
      ...(paymentFilter &&
        paymentFilter.value && { payment_method: paymentFilter.value }),
      ...(searchInput &&
        searchInput.value.trim() && { search: searchInput.value.trim() }),
      ...(dateFrom && dateFrom.value && { start_date: dateFrom.value }),
      ...(dateTo && dateTo.value && { end_date: dateTo.value }),
    };

    console.log("🔍 Fetching orders with filters:", filters);

    // Gọi API lấy dữ liệu
    const response = await orderAPI.getOrders(filters);

    console.log("📦 API Response:", response);

    // Xử lý response từ API
    let orders = [];
    let paginationData = {};

    // CÁCH 1: Response với data array (Laravel paginate)
    if (response.data && Array.isArray(response.data)) {
      orders = response.data;
      paginationData = {
        current_page: response.current_page || 1,
        total: response.total || 0,
        per_page: response.per_page || rowsPerPage,
        last_page: response.last_page || 1,
        from: response.from || 1,
        to: response.to || Math.min(orders.length, rowsPerPage),
      };
    }
    // CÁCH 2: Response với success flag
    else if (response.success && response.data) {
      if (Array.isArray(response.data)) {
        orders = response.data;
        paginationData = {
          current_page: response.current_page || 1,
          total: response.total || orders.length,
          per_page: response.per_page || rowsPerPage,
          last_page: response.last_page || 1,
          from: response.from || 1,
          to: response.to || Math.min(orders.length, rowsPerPage),
        };
      }
    }
    // CÁCH 3: Response trực tiếp là array
    else if (Array.isArray(response)) {
      orders = response;
      paginationData = {
        current_page: 1,
        total: orders.length,
        per_page: rowsPerPage,
        last_page: 1,
        from: 1,
        to: Math.min(orders.length, rowsPerPage),
      };
    }

    console.log(`✅ Loaded ${orders.length} orders`);

    if (orders.length > 0) {
      filteredOrders = orders;
      renderOrdersList(orders); // Hiển thị danh sách lên bảng

      // Cập nhật thông tin phân trang
      updateTableInfo(paginationData);
      updatePaginationInfo(paginationData);
    } else {
      filteredOrders = [];
      renderOrdersList([]);
      updateTableInfo({ total: 0, from: 0, to: 0 });
    }
  } catch (error) {
    console.error("💥 Error loading orders:", error);
    showErrorState(error.message);
    showToast("Lỗi", `Không thể tải dữ liệu: ${error.message}`, "error");
  }
}

/**
 * 📊 Hiển thị danh sách đơn hàng lên bảng HTML
 * @param {Array} orders - Mảng đơn hàng cần hiển thị
 */
function renderOrdersList(orders) {
  if (!ordersTableBody) return;

  ordersTableBody.innerHTML = ""; // Xóa nội dung cũ

  // Hiển thị trạng thái "Không có dữ liệu" nếu mảng rỗng
  if (!orders || orders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <i class="fas fa-shopping-cart" style="color: #6c757d; font-size: 32px; margin-bottom: 16px;"></i>
            <h3 style="margin-bottom: 12px;">Không tìm thấy đơn hàng</h3>
            <p style="color: #6c757d; margin-bottom: 16px;">
              Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm của bạn.
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

  // Duyệt qua từng đơn hàng và tạo row cho bảng
  orders.forEach((order) => {
    // CHUẨN HÓA DỮ LIỆU ĐƠN HÀNG
    const orderId = order.id || order.invoice_id;
    const orderCode =
      order.invoice_code ||
      order.code ||
      `DH${String(orderId).padStart(6, "0")}`;

    // Xử lý thông tin khách hàng - KHỚP VỚI API
    let customerName = "Không xác định";
    let customerPhone = "";

    if (order.customer) {
      if (typeof order.customer === "object") {
        // API trả về full_name, không phải name
        customerName =
          order.customer.full_name ||
          order.customer.name ||
          order.customer.customer_name ||
          "Không xác định";
        customerPhone =
          order.customer.phone || order.customer.phone_number || "";
      } else {
        customerName = order.customer;
      }
    }

    // Xử lý sản phẩm trong đơn - KHỚP VỚI API (invoice_details, không phải items)
    let productCount = 0;
    let productNames = [];

    const orderItems = order.invoice_details || order.items || [];
    if (Array.isArray(orderItems)) {
      productCount = orderItems.length;
      productNames = orderItems.slice(0, 2).map((item) => {
        if (item.product) {
          return item.product.product_name || item.product.name || "Sản phẩm";
        }
        return item.product_name || item.name || "Sản phẩm";
      });
    }

    // Định dạng tổng tiền
    const totalAmount = order.total_amount || order.total || 0;
    const formattedTotal = formatPrice(totalAmount);

    // Xử lý phương thức thanh toán - API trả về rỗng nên cần default
    const paymentMethod = order.payment_method || "cash";
    const paymentText = getPaymentMethodText(paymentMethod);

    // Xử lý trạng thái đơn hàng
    const status = order.status || "pending";
    const statusText = getStatusText(status);
    const statusClass = getStatusClass(status);

    // Định dạng ngày - ƯU TIÊN invoice_date
    const orderDate =
      order.invoice_date ||
      order.created_at ||
      order.order_date ||
      new Date().toISOString();

    // Tạo HTML cho mỗi row đơn hàng
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="order-checkbox" data-id="${orderId}"></td>
      <td>
        <div class="order-code">
          <strong>${orderCode}</strong>
          <div class="order-date">
            ${formatDate(orderDate)}
          </div>
        </div>
      </td>
      <td>
        <div class="customer-info">
          <div class="customer-name">${customerName}</div>
          ${
            customerPhone
              ? `<div class="customer-phone">${customerPhone}</div>`
              : ""
          }
        </div>
      </td>
      <td>
        <div class="product-info">
          <div class="product-count">${productCount} sản phẩm</div>
          ${
            productNames.length > 0
              ? `
            <div class="product-list">${productNames.join(", ")}${
                  productCount > 2 ? "..." : ""
                }</div>
          `
              : ""
          }
        </div>
      </td>
      <td class="order-total">${formattedTotal}₫</td>
      <td>
        <span class="payment-method ${paymentMethod}">
          ${paymentText}
        </span>
      </td>
      <td>
        <span class="order-status ${statusClass}">
          ${statusText}
        </span>
      </td>
      <td>
        <div class="order-actions">
          <button class="action-btn view" onclick="viewOrderDetail(${orderId})" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editOrder(${orderId})" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn status" onclick="showUpdateStatusModal(${orderId})" title="Cập nhật trạng thái">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </td>
    `;
    ordersTableBody.appendChild(row);
  });
}

// ============================================
// 📦 PHẦN 4: HÀM TIỆN ÍCH - ĐỊNH DẠNG
// ============================================

/**
 * 💰 Định dạng giá tiền: 25490000 → "25.490.000"
 * @param {number|string} price - Giá cần định dạng
 * @returns {string} - Giá đã định dạng
 */
function formatPrice(price) {
  if (!price || isNaN(price)) return "0";
  const priceNumber = parseInt(price, 10);
  return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * 📅 Định dạng ngày tháng
 * @param {string} dateString - Chuỗi ngày
 * @returns {string} - Ngày đã định dạng
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch (e) {
    return dateString;
  }
}

/**
 * 📝 Chuyển mã trạng thái thành text tiếng Việt - KHỚP VỚI MIGRATION
 * @param {string} status - Mã trạng thái (paid, unpaid, pending)
 * @returns {string} - Tên trạng thái tiếng Việt
 */
function getStatusText(status) {
  const statusMap = {
    "paid": "Đã thanh toán",      // Đã thanh toán
    "unpaid": "Chưa thanh toán",  // Chưa thanh toán
    "pending": "Chờ xử lý"         // Chờ xử lý
  };
  return statusMap[status] || status;
}

/**
 * 🎨 Lấy CSS class cho trạng thái - KHỚP VỚI MIGRATION
 * @param {string} status - Mã trạng thái (paid, unpaid, pending)
 * @returns {string} - CSS class
 */
function getStatusClass(status) {
  const classMap = {
    "paid": "status-completed",      // Đã thanh toán - màu xanh
    "unpaid": "status-cancelled",    // Chưa thanh toán - màu đỏ
    "pending": "status-pending"       // Chờ xử lý - màu vàng
  };
  return classMap[status] || "status-pending";
}

/**
 * 💳 Chuyển mã phương thức thanh toán thành text - KHỚP VỚI MIGRATION
 * @param {string} method - Mã phương thức (cash, credit_card, bank_transfer)
 * @returns {string} - Tên phương thức
 */
function getPaymentMethodText(method) {
  // API có thể trả về empty string
  if (!method || method === "") {
    return "Chưa xác định";
  }
  
  const methodMap = {
    "cash": "Tiền mặt",               // Thanh toán tiền mặt
    "credit_card": "Thẻ tín dụng",    // Thanh toán bằng thẻ
    "bank_transfer": "Chuyển khoản"   // Chuyển khoản ngân hàng
  };
  return methodMap[method] || method;
}

// ============================================
// 📦 PHẦN 5: PHÂN TRANG
// ============================================

/**
 * 📊 Cập nhật thông tin "Hiển thị 1-10 trong 156 đơn hàng"
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
      Hiển thị <strong>${from}-${to}</strong> trong tổng số <strong>${total}</strong> đơn hàng
    `;
  }
}

/**
 * 🔢 Cập nhật giao diện phân trang
 * @param {object} paginationData - Dữ liệu phân trang
 */
function updatePaginationInfo(paginationData) {
  if (!paginationData) return;

  const currentPageNum = paginationData.current_page || 1;
  const totalItems = paginationData.total || 0;
  const itemsPerPage = paginationData.per_page || rowsPerPage;
  const totalPages =
    paginationData.last_page || Math.ceil(totalItems / itemsPerPage) || 1;

  updatePaginationButtons(currentPageNum, totalPages);
}

/**
 * 🎛️ Cập nhật các nút phân trang
 * @param {number} currentPageNum - Trang hiện tại
 * @param {number} totalPages - Tổng số trang
 */
function updatePaginationButtons(currentPageNum, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  // Cập nhật nút số trang
  const pageButtons = paginationContainer.querySelectorAll(
    ".pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)"
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
      btn.style.display = "flex";
      btn.classList.toggle("active", pageNum === currentPageNum);
      btn.onclick = () => {
        currentPage = pageNum;
        renderOrdersTable();
      };
    } else {
      btn.style.display = "none";
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
  if (firstPageBtn)
    firstPageBtn.onclick = () => {
      if (currentPageNum > 1) {
        currentPage = 1;
        renderOrdersTable();
      }
    };
  if (prevPageBtn)
    prevPageBtn.onclick = () => {
      if (currentPageNum > 1) {
        currentPage--;
        renderOrdersTable();
      }
    };
  if (nextPageBtn)
    nextPageBtn.onclick = () => {
      if (currentPageNum < totalPages) {
        currentPage++;
        renderOrdersTable();
      }
    };
  if (lastPageBtn)
    lastPageBtn.onclick = () => {
      if (currentPageNum < totalPages) {
        currentPage = totalPages;
        renderOrdersTable();
      }
    };
}

// ============================================
// 📦 PHẦN 6: THỐNG KÊ ĐƠN HÀNG
// ============================================

/**
 * 📈 Lấy thống kê đơn hàng từ API
 */
async function loadOrderStats() {
  try {
    const response = await orderAPI.getOrderStats();

    console.log("📊 Order stats response:", response);

    // Xử lý response
    let stats = {};

    if (response.success && response.data) {
      stats = response.data;
    } else if (response.data) {
      stats = response.data;
    } else {
      stats = response;
    }

    console.log("📊 Stats data:", stats);

    // Cập nhật 5 thẻ thống kê - chỉ 3 trạng thái từ migration
    const statsCards = document.querySelectorAll(".stat-card");

    if (statsCards[0]) {
      statsCards[0].querySelector(".stat-number").textContent =
        stats.total || 0;
    }
    if (statsCards[1]) {
      statsCards[1].querySelector(".stat-number").textContent =
        stats.pending || 0;
    }
    if (statsCards[2]) {
      // Thay "Đang Giao" bằng "Đã thanh toán"
      statsCards[2].querySelector(".stat-number").textContent = stats.paid || 0;
      statsCards[2].querySelector(".stat-label").textContent = "Đã Thanh Toán";
    }
    if (statsCards[3]) {
      // Thay "Hoàn Thành" bằng "Chưa thanh toán"
      statsCards[3].querySelector(".stat-number").textContent =
        stats.unpaid || 0;
      statsCards[3].querySelector(".stat-label").textContent =
        "Chưa Thanh Toán";
    }
    if (statsCards[4]) {
      // Ẩn thẻ thứ 5 hoặc đặt giá trị 0
      statsCards[4].querySelector(".stat-number").textContent = 0;
      statsCards[4].style.opacity = "0.5";
    }

    // Cập nhật tổng số trên tabs
    updateTabBadges(stats);
  } catch (error) {
    console.error("❌ Error loading order stats:", error);
  }
}

/**
 * 🔢 Cập nhật số lượng trên các tab
 */
function updateTabBadges(stats) {
  const tabs = document.querySelectorAll(".tab-btn");

  // Tab "Tất cả"
  if (tabs[0]) {
    const total = stats.total || 0;
    tabs[0].querySelector(".tab-badge").textContent = total;
  }

  // Tab "Chờ xử lý" = pending
  if (tabs[1]) {
    const pending = stats.pending || 0;
    tabs[1].querySelector(".tab-badge").textContent = pending;
  }

  // Tab "Đang giao" -> đổi thành "Đã thanh toán" = paid
  if (tabs[2]) {
    const paid = stats.paid || 0;
    tabs[2].querySelector(".tab-badge").textContent = paid;
    tabs[2].querySelector("span:not(.tab-badge)").textContent = "Đã Thanh Toán";
  }

  // Tab "Hoàn thành" -> đổi thành "Chưa thanh toán" = unpaid
  if (tabs[3]) {
    const unpaid = stats.unpaid || 0;
    tabs[3].querySelector(".tab-badge").textContent = unpaid;
    tabs[3].querySelector("span:not(.tab-badge)").textContent =
      "Chưa Thanh Toán";
  }

  // Tab "Đã hủy" -> có thể ẩn hoặc giữ 0
  if (tabs[4]) {
    tabs[4].querySelector(".tab-badge").textContent = 0;
  }
}

/**
 * 🔢 Cập nhật số lượng trên các tab
 * @param {object} stats - Dữ liệu thống kê
 */
function updateTabBadges(stats) {
  const tabs = document.querySelectorAll(".tab-btn");

  // Tab "Tất cả"
  if (tabs[0]) {
    const total = stats.total || 0;
    tabs[0].querySelector(".tab-badge").textContent = total;
  }

  // Tab "Chờ xử lý"
  if (tabs[1]) {
    const pending = stats.pending || 0;
    tabs[1].querySelector(".tab-badge").textContent = pending;
  }

  // Tab "Đang giao"
  if (tabs[2]) {
    const processing = stats.processing || 0;
    tabs[2].querySelector(".tab-badge").textContent = processing;
  }

  // Tab "Hoàn thành"
  if (tabs[3]) {
    const completed = stats.completed || 0;
    tabs[3].querySelector(".tab-badge").textContent = completed;
  }

  // Tab "Đã hủy"
  if (tabs[4]) {
    const cancelled = stats.cancelled || 0;
    tabs[4].querySelector(".tab-badge").textContent = cancelled;
  }
}

// ============================================
// 📦 PHẦN 7: XEM CHI TIẾT ĐƠN HÀNG
// ============================================

/**
 * 👁️ Xem chi tiết đơn hàng
 * @param {number} orderId - ID đơn hàng
 */
async function viewOrderDetail(orderId) {
  try {
    console.log(`👁️ Viewing order details for ID: ${orderId}`);

    const response = await orderAPI.getOrderById(orderId);

    console.log("📄 Order detail response:", response);

    // Xử lý response
    let order = response;
    if (response.success && response.data) {
      order = response.data;
    } else if (response.data) {
      order = response.data;
    }

    if (order) {
      displayOrderDetailModal(order);
    } else {
      showToast("Lỗi", "Không thể tải thông tin đơn hàng", "error");
    }
  } catch (error) {
    console.error("❌ Error loading order details:", error);
    showToast("Lỗi", "Không thể tải thông tin đơn hàng", "error");
  }
}

/**
 * 🪟 Hiển thị modal chi tiết đơn hàng
 * @param {object} order - Dữ liệu đơn hàng
 */
function displayOrderDetailModal(order) {
  const modal = document.getElementById("orderDetailModal");
  const content = document.getElementById("orderDetailContent");
  const currentStatusEl = document.getElementById("currentOrderStatus");

  if (!modal || !content) return;

  currentOrderId = order.id || order.invoice_id;

  // Chuẩn hóa dữ liệu
  const orderCode = order.invoice_code || order.code || `DH${currentOrderId}`;
  const createdAt = formatDateTime(order.created_at || order.order_date);
  const customer = order.customer || {};
  const customerName =
    customer.name || customer.customer_name || "Không xác định";
  const customerPhone = customer.phone || customer.phone_number || "N/A";
  const customerEmail = customer.email || "N/A";
  const customerAddress = customer.address || "N/A";

  // Thông tin nhân viên hỗ trợ đơn hàng
  const employee = order.employee || {};
  const employeeName =
    employee.full_name ||
    employee.name ||
    employee.employee_name ||
    "Không xác định";

  const paymentMethod = order.payment_method || "cod";
  const paymentText = getPaymentMethodText(paymentMethod);

  const status = order.status || "pending";
  const statusText = getStatusText(status);
  const statusClass = getStatusClass(status);

  const totalAmount = order.total_amount || order.total || 0;
  const formattedTotal = formatPrice(totalAmount);

  const notes = order.notes || "Không có ghi chú";

  // Tạo HTML cho chi tiết đơn hàng
  let itemsHTML = "";
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item, index) => {
      const product = item.product || {};
      const productName = product.product_name || product.name || "Sản phẩm";
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      const subtotal = item.subtotal || quantity * price;

      itemsHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${productName}</td>
          <td>${formatPrice(price)}₫</td>
          <td>${quantity}</td>
          <td>${formatPrice(subtotal)}₫</td>
        </tr>
      `;
    });
  }

  content.innerHTML = `
    <div class="order-detail-section">
      <h4>Thông Tin Đơn Hàng</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Mã đơn hàng:</span>
          <span class="detail-value">${orderCode}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Ngày đặt:</span>
          <span class="detail-value">${createdAt}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Phương thức thanh toán:</span>
          <span class="detail-value">${paymentText}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tổng tiền:</span>
          <span class="detail-value order-total">${formattedTotal}₫</span>
        </div>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h4>Thông Tin Khách Hàng</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Tên khách hàng:</span>
          <span class="detail-value">${customerName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Số điện thoại:</span>
          <span class="detail-value">${customerPhone}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${customerEmail}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Địa chỉ:</span>
          <span class="detail-value">${customerAddress}</span>
        </div>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h4>Nhân Viên Hỗ Trợ</h4>
      <div class="detail-grid">
        <!-- Tên nhân viên -->
        <div class="detail-item">
          <span class="detail-label">Tên nhân viên:</span>
          <span class="detail-value">${employeeName}</span>
        </div>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h4>Danh Sách Sản Phẩm</h4>
      <table class="order-items-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML || '<tr><td colspan="5">Không có sản phẩm</td></tr>'}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align: right; font-weight: bold;">Tổng cộng:</td>
            <td style="font-weight: bold;">${formattedTotal}₫</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div class="order-detail-section">
      <h4>Ghi Chú</h4>
      <div class="order-notes">
        ${notes}
      </div>
    </div>
  `;

  // Cập nhật trạng thái hiện tại
  if (currentStatusEl) {
    currentStatusEl.innerHTML = `
      Trạng thái: <span class="order-status ${statusClass}">${statusText}</span>
    `;
  }

  // Hiển thị modal
  modal.classList.add("active");
}

/**
 * 📅 Định dạng ngày giờ đầy đủ
 * @param {string} dateString - Chuỗi ngày
 * @returns {string} - Ngày giờ đã định dạng
 */
function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN")
    );
  } catch (e) {
    return dateString;
  }
}

/**
 * ❌ Đóng modal chi tiết đơn hàng
 */
function closeOrderDetailModal() {
  const modal = document.getElementById("orderDetailModal");
  if (modal) {
    modal.classList.remove("active");
  }
  currentOrderId = null;
}

// ============================================
// 📦 PHẦN 8: CẬP NHẬT TRẠNG THÁI
// ============================================

/**
 * ⚙️ Hiển thị modal cập nhật trạng thái
 * @param {number} orderId - ID đơn hàng
 */
/**
 * ⚙️ Hiển thị modal cập nhật trạng thái - FIXED
 */
async function showUpdateStatusModal(orderId) {
  try {
    console.log(`⚙️ Showing update status modal for order: ${orderId}`);

    const response = await orderAPI.getOrderById(orderId);
    let order = response;
    if (response.success && response.data) {
      order = response.data;
    } else if (response.data) {
      order = response.data;
    }

    const status = order.status || "pending";
    const statusText = getStatusText(status);
    const statusClass = getStatusClass(status);

    currentOrderId = orderId;

    const modal = document.getElementById("updateStatusModal");
    const currentStatusDisplay = document.getElementById(
      "currentStatusDisplay"
    );
    const newStatusSelect = document.getElementById("newStatusSelect");

    if (!modal || !currentStatusDisplay || !newStatusSelect) return;

    // Cập nhật trạng thái hiện tại
    currentStatusDisplay.textContent = statusText;
    currentStatusDisplay.className = `order-status ${statusClass}`;

    // ✅ Cập nhật options trong select cho khớp với migration
    newStatusSelect.innerHTML = `
      <option value="pending" ${
        status === "pending" ? "selected" : ""
      }>Chờ xử lý</option>
      <option value="paid" ${
        status === "paid" ? "selected" : ""
      }>Đã thanh toán</option>
      <option value="unpaid" ${
        status === "unpaid" ? "selected" : ""
      }>Chưa thanh toán</option>
    `;

    // Hiển thị modal
    modal.classList.add("active");
  } catch (error) {
    console.error("❌ Error loading order for status update:", error);
    showToast("Lỗi", "Không thể tải thông tin đơn hàng", "error");
  }
}

/**
 * 💾 Lưu trạng thái mới - FIXED
 */
async function saveOrderStatus() {
  if (!currentOrderId) {
    console.error("❌ No order ID");
    return;
  }

  const newStatusSelect = document.getElementById("newStatusSelect");
  const statusNote = document.getElementById("statusNote");

  if (!newStatusSelect) {
    console.error("❌ Status select element not found");
    return;
  }

  const newStatus = newStatusSelect.value;
  const note = statusNote ? statusNote.value.trim() : "";

  console.log("🔍 Debug saveOrderStatus:");
  console.log("Order ID:", currentOrderId);
  console.log("New Status:", newStatus);
  console.log("New Status length:", newStatus.length);
  console.log("New Status type:", typeof newStatus);
  console.log("New Status (JSON):", JSON.stringify(newStatus));
  console.log("Note:", note);

  // Validate status trước khi gửi - KHỚP VỚI MIGRATION
  const validStatuses = ['paid', 'unpaid', 'pending'];
  if (!validStatuses.includes(newStatus)) {
    showToast("Lỗi", `Trạng thái không hợp lệ: "${newStatus}". Chỉ chấp nhận: ${validStatuses.join(', ')}`, "error");
    return;
  }

  try {
    // Gọi API cập nhật trạng thái
    const response = await orderAPI.updateOrderStatus(
      currentOrderId,
      newStatus,
      note
    );

    console.log("✅ Update response:", response);
    console.log("✅ Response type:", typeof response);
    console.log("✅ Response.success:", response?.success);
    console.log("✅ Response.data:", response?.data);

    // Đóng modal ngay khi API trả về thành công (không có lỗi throw)
    closeUpdateStatusModal();

    // Làm mới danh sách
    await renderOrdersTable();
    
    // Load stats nếu có hàm
    if (typeof loadOrderStats === 'function') {
      await loadOrderStats();
    }

    showToast("Thành công", "Đã cập nhật trạng thái đơn hàng", "success");
    
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    console.error("Full error:", error);

    // Hiển thị thông báo lỗi chi tiết hơn
    let errorMessage = error.message;
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    }
    if (error.status === 422 && error.data && error.data.errors) {
      // Validation errors
      const errors = Object.values(error.data.errors).flat().join(", ");
      errorMessage = `Dữ liệu không hợp lệ: ${errors}`;
    }

    showToast("Lỗi", `Không thể cập nhật trạng thái: ${errorMessage}`, "error");
  }
}

/**
 * ❌ Đóng modal cập nhật trạng thái
 */
function closeUpdateStatusModal() {
  const modal = document.getElementById("updateStatusModal");
  const statusNote = document.getElementById("statusNote");

  if (modal) {
    modal.classList.remove("active");
  }

  if (statusNote) {
    statusNote.value = "";
  }

  currentOrderId = null;
}

// ============================================
// 📦 PHẦN 9: XỬ LÝ FILTER VÀ TÌM KIẾM
// ============================================

/**
 * 🔍 Thiết lập tìm kiếm real-time với debounce
 */
function setupSearchEvent() {
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (searchTerm === "") {
      currentPage = 1;
      renderOrdersTable();
      return;
    }

    searchTimeout = setTimeout(() => {
      currentPage = 1;
      renderOrdersTable();
    }, 500);
  });
}

/**
 * ⚙️ Thiết lập sự kiện cho các filter
 */
function setupFilterEvents() {
  // Lắng nghe thay đổi filter
  [statusFilter, paymentFilter, amountFilter].forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", () => {
        currentPage = 1;
        renderOrdersTable();
      });
    }
  });

  // Lắng nghe thay đổi ngày
  [dateFrom, dateTo].forEach((dateInput) => {
    if (dateInput) {
      dateInput.addEventListener("change", () => {
        currentPage = 1;
        renderOrdersTable();
      });
    }
  });

  // Nút áp dụng filter
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      currentPage = 1;
      renderOrdersTable();
      showToast("Thành công", "Đã áp dụng bộ lọc", "success");
    });
  }

  // Nút xóa filter
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }
}

/**
 * 🔢 Thiết lập sự kiện phân trang
 */
function setupPaginationEvents() {
  // Thay đổi số dòng/trang
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener("change", function (e) {
      rowsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderOrdersTable();
    });
  }

  // Nút làm mới
  const refreshTable = document.getElementById("refreshTable");
  if (refreshTable) {
    refreshTable.addEventListener("click", function () {
      currentPage = 1;
      renderOrdersTable();
      loadOrderStats();
      showToast("Thành công", "Đã làm mới danh sách đơn hàng", "success");
    });
  }
}

/**
 * 🧹 Xóa tất cả filter
 */
function clearAllFilters() {
  if (statusFilter) statusFilter.value = "";
  if (paymentFilter) paymentFilter.value = "";
  if (amountFilter) amountFilter.value = "";
  if (dateFrom) dateFrom.value = "";
  if (dateTo) dateTo.value = "";
  if (searchInput) searchInput.value = "";

  // Reset các tabs về "Tất cả"
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => tab.classList.remove("active"));
  if (tabs[0]) tabs[0].classList.add("active");
  currentStatusFilter = "all";

  currentPage = 1;
  renderOrdersTable();
  showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

// ============================================
// 📦 PHẦN 10: XỬ LÝ TABS
// ============================================

/**
 * 🏷️ Thiết lập sự kiện cho các tab
 */
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const statCards = document.querySelectorAll(".stat-card");

  // Tab click event
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const status = this.getAttribute("data-status");

      // Cập nhật active tab
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Cập nhật active stat card
      statCards.forEach((card) => card.classList.remove("active"));
      const matchingCard = document.querySelector(
        `.stat-card[data-filter="${status}"]`
      );
      if (matchingCard) {
        matchingCard.classList.add("active");
      }

      // Cập nhật filter
      currentStatusFilter = status;
      currentPage = 1;
      renderOrdersTable();
    });
  });

  // Stat card click event
  statCards.forEach((card) => {
    card.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Cập nhật active stat card
      statCards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");

      // Cập nhật active tab
      tabs.forEach((tab) => tab.classList.remove("active"));
      const matchingTab = document.querySelector(
        `.tab-btn[data-status="${filter}"]`
      );
      if (matchingTab) {
        matchingTab.classList.add("active");
      }

      // Cập nhật filter
      currentStatusFilter = filter;
      currentPage = 1;
      renderOrdersTable();
    });
  });
}

// ============================================
// 📦 PHẦN 11: HIỂN THỊ TRẠNG THÁI
// ============================================

/**
 * ⏳ Hiển thị trạng thái loading
 */
function showLoadingState() {
  if (!ordersTableBody) return;

  ordersTableBody.innerHTML = `
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
  if (!ordersTableBody) return;

  ordersTableBody.innerHTML = `
    <tr>
      <td colspan="8">
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #f72585; margin-bottom: 20px;"></i>
          <h3 style="margin-bottom: 12px; color: #495057;">Đã xảy ra lỗi</h3>
          <p style="color: #6c757d; margin-bottom: 20px;">${errorMessage}</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-primary" onclick="renderOrdersTable()">
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
      warning: {
        class: "toast-icon warning",
        icon: "fas fa-exclamation-triangle",
      },
    };

    const config = iconMap[type] || iconMap.success;
    toastIcon.className = config.class;
    icon.className = config.icon;
  }

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 5000);
}

// ============================================
// 📦 PHẦN 12: KHỞI TẠO ỨNG DỤNG
// ============================================

/**
 * 🚀 Khởi tạo ứng dụng quản lý đơn hàng
 */
async function initializeOrderApp() {
  try {
    console.log("🚀 Initializing Order Management App...");

    // 1. Lấy các phần tử DOM
    initializeDOMElements();

    // 2. Kiểm tra kết nối API
    await testAPIConnection();

    // 3. Tải thống kê
    await loadOrderStats();

    // 4. Tải danh sách đơn hàng
    await renderOrdersTable();

    // 5. Thiết lập sự kiện
    setupAllEvents();

    console.log("🎉 Order Management App initialized successfully!");
    showToast("Thành công", "Ứng dụng quản lý đơn hàng đã sẵn sàng", "success");
  } catch (error) {
    console.error("❌ Error initializing order app:", error);
    showToast("Lỗi", "Không thể khởi tạo ứng dụng quản lý đơn hàng", "error");
  }
}

/**
 * 🎯 Khởi tạo các phần tử DOM
 */
function initializeDOMElements() {
  // Lấy các phần tử DOM từ HTML
  ordersTableBody = document.getElementById("ordersTableBody");
  statusFilter = document.getElementById("statusFilter");
  paymentFilter = document.getElementById("paymentFilter");
  amountFilter = document.getElementById("amountFilter");
  dateFrom = document.getElementById("dateFrom");
  dateTo = document.getElementById("dateTo");
  searchInput = document.querySelector(".search-box input");
  rowsPerPageSelect = document.getElementById("rowsPerPage");
  createOrderBtn = document.getElementById("createOrderBtn");
  applyFiltersBtn = document.getElementById("applyFilters");
  clearFiltersBtn = document.getElementById("clearFilters");

  console.log("✅ DOM elements initialized");
}

/**
 * 🔗 Thiết lập tất cả sự kiện
 */
function setupAllEvents() {
  // Sự kiện tìm kiếm và filter
  setupSearchEvent();
  setupFilterEvents();
  setupPaginationEvents();
  setupTabs();

  // ===== SỰ KIỆN MODAL =====

  // Modal chi tiết đơn hàng
  const closeOrderModalBtn = document.getElementById("closeOrderModal");
  if (closeOrderModalBtn) {
    closeOrderModalBtn.addEventListener("click", closeOrderDetailModal);
  }

  const orderDetailModal = document.getElementById("orderDetailModal");
  if (orderDetailModal) {
    orderDetailModal.addEventListener("click", function (event) {
      if (event.target === orderDetailModal) {
        closeOrderDetailModal();
      }
    });
  }

  // Modal cập nhật trạng thái
  const closeStatusModalBtn = document.getElementById("closeStatusModal");
  const cancelStatusBtn = document.getElementById("cancelStatusBtn");
  const saveStatusBtn = document.getElementById("saveStatusBtn");

  if (closeStatusModalBtn) {
    closeStatusModalBtn.addEventListener("click", closeUpdateStatusModal);
  }
  if (cancelStatusBtn) {
    cancelStatusBtn.addEventListener("click", closeUpdateStatusModal);
  }
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener("click", saveOrderStatus);
  }

  const updateStatusModal = document.getElementById("updateStatusModal");
  if (updateStatusModal) {
    updateStatusModal.addEventListener("click", function (event) {
      if (event.target === updateStatusModal) {
        closeUpdateStatusModal();
      }
    });
  }

  // ===== NÚT HÀNH ĐỘNG TRONG MODAL CHI TIẾT =====

  // Nút cập nhật trạng thái trong modal chi tiết
  const updateStatusBtn = document.getElementById("updateStatusBtn");
  if (updateStatusBtn && currentOrderId) {
    updateStatusBtn.addEventListener("click", () => {
      closeOrderDetailModal();
      showUpdateStatusModal(currentOrderId);
    });
  }

  // ===== ĐÓNG TOAST =====

  const closeToastBtn = document.getElementById("closeToast");
  const toast = document.getElementById("toast");
  if (closeToastBtn && toast) {
    closeToastBtn.addEventListener("click", function () {
      toast.classList.remove("show");
    });
  }

  // ===== SIDEBAR =====

  const toggleSidebar = document.getElementById("toggleSidebar");
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

  console.log("✅ All events set up");
}

/**
 * 🔌 Kiểm tra kết nối API
 */
async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      showToast("Cảnh báo", `API trả về lỗi ${response.status}`, "warning");
      console.warn(`⚠️ API returned ${response.status}`);
    } else {
      console.log("✅ API connection successful");
    }
  } catch (error) {
    showToast("Lỗi kết nối", `Không thể kết nối đến ${API_BASE_URL}`, "error");
    console.error("❌ API connection failed:", error);
  }
}

// ============================================
// 📦 PHẦN 13: CHẠY ỨNG DỤNG
// ============================================

/**
 * 🏁 Chạy ứng dụng khi DOM đã sẵn sàng
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("📦 DOM loaded, starting order management app...");

  // Khởi tạo ứng dụng
  initializeOrderApp();

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
// 📦 PHẦN 14: EXPORT HÀM RA GLOBAL SCOPE
// ============================================

// 📤 Xuất hàm ra global scope để có thể gọi từ HTML
window.renderOrdersTable = renderOrdersTable;
window.viewOrderDetail = viewOrderDetail;
window.showUpdateStatusModal = showUpdateStatusModal;
window.clearAllFilters = clearAllFilters;
window.closeOrderDetailModal = closeOrderDetailModal;
window.closeUpdateStatusModal = closeUpdateStatusModal;
window.saveOrderStatus = saveOrderStatus;

console.log("🚀 All functions exported to global scope");
