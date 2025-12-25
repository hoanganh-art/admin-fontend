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

// Tạo instance toàn cục của API service 
const orderAPI = new OrderAPIService();
// ============================================
// 📦 PHẦN 2: QUẢN LÝ ĐƠN HÀNG - BIẾN VÀ DOM
// ============================================

// ========== BIẾN TOÀN CỤC ==========
let currentPage = 1; // Trang hiện tại
let rowsPerPage = 10; // Số dòng trên mỗi trang
let filteredOrders = []; // Mảng lưu trữ đơn hàng đã lọc
let currentStatusFilter = "all"; // Bộ lọc trạng thái hiện tại
let currentOrderId = null; // ID đơn hàng hiện tại (cho chi tiết/sửa/xóa)

// ========== DOM ELEMENTS ==========

//Lấy các phần tử DOM từ HTML
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
