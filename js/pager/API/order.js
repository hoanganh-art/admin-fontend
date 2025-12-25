// ============================================
// 📦 PHẦN 1: CẤU HÌNH API & SERVICE (QUAN TRỌNG)
// ============================================

// ========== CẤU HÌNH API ENDPOINTS ==========

const API_BASE_URL = "http://127.0.0.1:6346";

const API_ENDPOINTS = {
  // 🛒 ĐƠN HÀNG (Endpoints chính)
  orders: "/api/invoices", // GET: Lấy danh sách, POST: Tạo mới
  orderDetail: (id) => `/api/invoices/${id}`, // GET: Chi tiết, PUT: Sửa, DELETE: Xóa
  orderStatus: (id) => `/api/invoices/${id}/status`, // PUT: Cập nhật trạng thái
  ordersStats: "/api/invoices/stats", // GET: Thống kê đơn hàng

  // 👥 KHÁCH HÀNG & NHÂN VIÊN
  customers: "/api/customers",
  employees: "/api/employees",
  // 📱 SẢN PHẨM
  products: "/api/products",
  productDetail: (id) => `/api/products/${id}`,
};

// ========== LỚP API SERVICE ==========

class OrderAPIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      console.log("🔗 API Request URL:", url);
      if (options.body) {
        console.log("📦 Request body:", JSON.parse(options.body));
      }

      const response = await fetch(url, {
        ...options,
        headers: { ...this.headers, ...options.headers },
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }

      if (!response.ok) {
        console.error("❌ API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        let userMessage = `Lỗi ${response.status}: ${response.statusText}`;
        if (data?.message) userMessage = data.message;

        const error = new Error(userMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      console.log("✅ API Response received:", data);
      return data;
    } catch (error) {
      console.error("💥 API Request Error:", error.message);
      throw error;
    }
  }

  // ========== PHƯƠNG THỨC API CHO ĐƠN HÀNG ==========

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.orders}?${queryString}`
      : API_ENDPOINTS.orders;

    console.log("📋 Fetching orders with params:", params);
    return this.request(endpoint);
  }

  async getOrderStats() {
    console.log("📊 Fetching order statistics");
    return this.request(API_ENDPOINTS.ordersStats);
  }

  async getOrderById(id) {
    console.log(`👁️ Fetching order details for ID: ${id}`);
    return this.request(API_ENDPOINTS.orderDetail(id));
  }

  async createOrder(orderData) {
    console.log("➕ Creating new order:", orderData);
    return this.request(API_ENDPOINTS.orders, {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id, orderData) {
    console.log(`✏️ Updating order ID: ${id}`, orderData);
    return this.request(API_ENDPOINTS.orderDetail(id), {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  }

  /**
   * 🔄 Cập nhật trạng thái đơn hàng - FIXED VERSION
   * @param {number|string} id - ID đơn hàng
   * @param {string} status - Trạng thái mới (paid, unpaid, pending)
   * @param {string} note - Ghi chú (tùy chọn)
   * @returns {Promise} - Kết quả cập nhật trạng thái
   */
  async updateOrderStatus(id, status, note = "") {
    console.log(`🔄 Updating status for order ${id} to: ${status}`);

    // Chuẩn hóa status về enum hợp lệ - CHỈ 3 GIÁ TRỊ
    const normalizedStatus = (status || "").toString().trim().toLowerCase();
    const allowedStatuses = [
      "paid",
      "unpaid",
      "pending",
      "processing",
      "shipping",
      "completed",
      "cancelled",
    ];
    const finalStatus = allowedStatuses.includes(normalizedStatus)
      ? normalizedStatus
      : "pending";

    // ⚠️ QUAN TRỌNG: Gọi endpoint riêng cho cập nhật trạng thái
    // PUT /api/invoices/{id}/status (thay vì PUT /api/invoices/{id})
    return this.request(API_ENDPOINTS.orderStatus(id), {
      method: "PUT",
      body: JSON.stringify({
        status: finalStatus,
        note: note,
      }),
    });
  }

  async deleteOrder(id) {
    console.log(`🗑️ Deleting order ID: ${id}`);
    return this.request(API_ENDPOINTS.orderDetail(id), {
      method: "DELETE",
    });
  }

  // ========== PHƯƠNG THỨC API BỔ SUNG ==========

  async getCustomers() {
    console.log("👥 Fetching customers list");
    return this.request(API_ENDPOINTS.customers);
  }

  async getEmployees() {
    console.log("👔 Fetching employees list");
    return this.request(API_ENDPOINTS.employees);
  }

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

let currentPage = 1;
let rowsPerPage = 10;
let filteredOrders = [];
let currentStatusFilter = "all";
let currentOrderId = null;

// ========== DOM ELEMENTS ==========

let ordersTableBody, statusFilter, paymentFilter, amountFilter;
let dateFrom, dateTo, searchInput, rowsPerPageSelect;
let createOrderBtn, applyFiltersBtn, clearFiltersBtn;

// ============================================
// 📦 PHẦN 3: HIỂN THỊ DANH SÁCH ĐƠN HÀNG
// ============================================

async function renderOrdersTable() {
  try {
    showLoadingState();

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
    } else if (response.success && response.data) {
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
    } else if (Array.isArray(response)) {
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
      renderOrdersList(orders);
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

function renderOrdersList(orders) {
  if (!ordersTableBody) return;

  ordersTableBody.innerHTML = "";

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
    const orderId = order.id || order.invoice_id;
    const orderCode =
      order.invoice_code ||
      order.code ||
      `DH${String(orderId).padStart(6, "0")}`;

    let customerName = "Không xác định";
    let customerPhone = "";

    if (order.customer) {
      if (typeof order.customer === "object") {
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

    const totalAmount = order.total_amount || order.total || 0;
    const formattedTotal = formatPrice(totalAmount);

    const paymentMethod = order.payment_method || "cash";
    const paymentText = getPaymentMethodText(paymentMethod);

    const status = order.status || "pending";
    const statusText = getStatusText(status);
    const statusClass = getStatusClass(status);

    const orderDate =
      order.invoice_date ||
      order.created_at ||
      order.order_date ||
      new Date().toISOString();

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
function getStatusText(status) {
  const statusMap = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán"
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  const classMap = {
    pending: "status-pending",
    processing: "status-processing",
    shipping: "status-shipping",
    completed: "status-completed",
    cancelled: "status-cancelled",
    paid: "status-paid",
    unpaid: "status-unpaid"
  };
  return classMap[status] || "status-pending";
}

function getPaymentMethodText(method) {
  const methodMap = {
    cash: "Tiền mặt",
    credit_card: "Thẻ tín dụng",
    bank_transfer: "Chuyển khoản",
    cod: "Thanh toán khi nhận hàng",
    momo: "Ví MoMo",
  };
  return methodMap[method] || method;
}

// Sửa hàm loadOrderStats để hỗ trợ các trạng thái mới
async function loadOrderStats() {
  try {
    const response = await orderAPI.getOrderStats();
    console.log("📊 Order stats response:", response);

    let stats = {};
    if (response.success && response.data) {
      stats = response.data;
    } else if (response.data) {
      stats = response.data;
    } else {
      stats = response;
    }

    console.log("📊 Stats data:", stats);

    // Cập nhật tất cả thẻ thống kê
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
      statsCards[2].querySelector(".stat-number").textContent =
        stats.processing || 0;
    }
    if (statsCards[3]) {
      statsCards[3].querySelector(".stat-number").textContent =
        stats.shipping || 0;
    }
    if (statsCards[4]) {
      statsCards[4].querySelector(".stat-number").textContent =
        stats.completed || 0;
    }
    if (statsCards[5]) {
      statsCards[5].querySelector(".stat-number").textContent =
        stats.cancelled || 0;
    }
    if (statsCards[6]) {
      statsCards[6].querySelector(".stat-number").textContent = stats.paid || 0;
    }
    if (statsCards[7]) {
      statsCards[7].querySelector(".stat-number").textContent =
        stats.unpaid || 0;
    }

    updateTabBadges(stats);
  } catch (error) {
    console.error("❌ Error loading order stats:", error);
  }
}

// Sửa hàm updateTabBadges
function updateTabBadges(stats) {
  const tabs = document.querySelectorAll(".tab-btn");

  // Tab "Tất cả"
  if (tabs[0]) {
    const total = stats.total || 0;
    tabs[0].querySelector(".tab-badge").textContent = total;
  }

  // Các tab khác
  const tabStatusMap = {
    1: "pending",
    2: "processing",
    3: "shipping",
    4: "completed",
    5: "cancelled",
    6: "paid",
    7: "unpaid",
  };

  for (let i = 1; i <= 7; i++) {
    if (tabs[i]) {
      const status = tabStatusMap[i];
      const count = stats[status] || 0;
      tabs[i].querySelector(".tab-badge").textContent = count;
      tabs[i].setAttribute("data-status", status);
    }
  }
}

// Sửa hàm showUpdateStatusModal để thêm các option trạng thái mới
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

    // Cập nhật options trong select với tất cả trạng thái
    newStatusSelect.innerHTML = `
      <option value="pending" ${
        status === "pending" ? "selected" : ""
      }>Chờ xử lý</option>
      <option value="processing" ${
        status === "processing" ? "selected" : ""
      }>Đang xử lý</option>
      <option value="shipping" ${
        status === "shipping" ? "selected" : ""
      }>Đang giao hàng</option>
      <option value="completed" ${
        status === "completed" ? "selected" : ""
      }>Hoàn thành</option>
      <option value="cancelled" ${
        status === "cancelled" ? "selected" : ""
      }>Đã hủy</option>
      <option value="paid" ${
        status === "paid" ? "selected" : ""
      }>Đã thanh toán</option>
      <option value="unpaid" ${
        status === "unpaid" ? "selected" : ""
      }>Chưa thanh toán</option>
    `;

    modal.classList.add("active");
  } catch (error) {
    console.error("❌ Error loading order for status update:", error);
    showToast("Lỗi", "Không thể tải thông tin đơn hàng", "error");
  }
}

// Sửa hàm saveOrderStatus để hỗ trợ các trạng thái mới
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
  console.log("Note:", note);

  // Validate status trước khi gửi
  const validStatuses = [
    "pending",
    "processing",
    "shipping",
    "completed",
    "cancelled",
    "paid",
    "unpaid",
  ];
  if (!validStatuses.includes(newStatus)) {
    showToast(
      "Lỗi",
      `Trạng thái không hợp lệ: "${newStatus}". Chỉ chấp nhận: ${validStatuses.join(
        ", "
      )}`,
      "error"
    );
    return;
  }

  try {
    const response = await orderAPI.updateOrderStatus(
      currentOrderId,
      newStatus,
      note
    );

    console.log("✅ Update response:", response);

    // Đóng modal
    closeUpdateStatusModal();

    // Làm mới danh sách và thống kê
    await renderOrdersTable();
    await loadOrderStats();

    showToast("Thành công", "Đã cập nhật trạng thái đơn hàng", "success");
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    console.error("Full error:", error);

    let errorMessage = error.message;
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    }
    if (error.status === 422 && error.data && error.data.errors) {
      const errors = Object.values(error.data.errors).flat().join(", ");
      errorMessage = `Dữ liệu không hợp lệ: ${errors}`;
    }

    showToast("Lỗi", `Không thể cập nhật trạng thái: ${errorMessage}`, "error");
  }
}

function formatPrice(price) {
  if (!price || isNaN(price)) return "0";
  const priceNumber = parseInt(price, 10);
  return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  } catch (e) {
    return dateString;
  }
}

function getStatusText(status) {
  const statusMap = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  const classMap = {
    paid: "status-completed",
    unpaid: "status-cancelled",
    pending: "status-pending",
  };
  return classMap[status] || "status-pending";
}

function getPaymentMethodText(method) {
  if (!method || method === "") {
    return "Chưa xác định";
  }

  const methodMap = {
    cash: "Tiền mặt",
    credit_card: "Thẻ tín dụng",
    bank_transfer: "Chuyển khoản",
  };
  return methodMap[method] || method;
}

// ============================================
// 📦 PHẦN 5: PHÂN TRANG
// ============================================

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

function updatePaginationInfo(paginationData) {
  if (!paginationData) return;

  const currentPageNum = paginationData.current_page || 1;
  const totalItems = paginationData.total || 0;
  const itemsPerPage = paginationData.per_page || rowsPerPage;
  const totalPages =
    paginationData.last_page || Math.ceil(totalItems / itemsPerPage) || 1;

  updatePaginationButtons(currentPageNum, totalPages);
}

function updatePaginationButtons(currentPageNum, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

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

  const firstPageBtn = document.getElementById("firstPage");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const lastPageBtn = document.getElementById("lastPage");

  if (firstPageBtn) firstPageBtn.disabled = currentPageNum === 1;
  if (prevPageBtn) prevPageBtn.disabled = currentPageNum === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentPageNum === totalPages;
  if (lastPageBtn) lastPageBtn.disabled = currentPageNum === totalPages;

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

async function loadOrderStats() {
  try {
    const response = await orderAPI.getOrderStats();
    console.log("📊 Order stats response:", response);

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
      statsCards[0].setAttribute("data-filter", "all");
    }
    if (statsCards[1]) {
      statsCards[1].querySelector(".stat-number").textContent =
        stats.pending || 0;
      statsCards[1].setAttribute("data-filter", "pending");
    }
    if (statsCards[2]) {
      statsCards[2].querySelector(".stat-number").textContent = stats.paid || 0;
      statsCards[2].querySelector(".stat-label").textContent = "Đã Thanh Toán";
      statsCards[2].setAttribute("data-filter", "paid");
    }
    if (statsCards[3]) {
      statsCards[3].querySelector(".stat-number").textContent =
        stats.unpaid || 0;
      statsCards[3].querySelector(".stat-label").textContent =
        "Chưa Thanh Toán";
      statsCards[3].setAttribute("data-filter", "unpaid");
    }
    if (statsCards[4]) {
      statsCards[4].querySelector(".stat-number").textContent = 0;
      statsCards[4].style.opacity = "0.5";
      statsCards[4].style.pointerEvents = "none";
    }

    updateTabBadges(stats);
  } catch (error) {
    console.error("❌ Error loading order stats:", error);
  }
}

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
    tabs[1].setAttribute("data-status", "pending");
  }

  // Tab "Đã thanh toán" = paid
  if (tabs[2]) {
    const paid = stats.paid || 0;
    tabs[2].querySelector(".tab-badge").textContent = paid;
    tabs[2].querySelector("span:not(.tab-badge)").textContent = "Đã Thanh Toán";
    tabs[2].setAttribute("data-status", "paid");
  }

  // Tab "Chưa thanh toán" = unpaid
  if (tabs[3]) {
    const unpaid = stats.unpaid || 0;
    tabs[3].querySelector(".tab-badge").textContent = unpaid;
    tabs[3].querySelector("span:not(.tab-badge)").textContent =
      "Chưa Thanh Toán";
    tabs[3].setAttribute("data-status", "unpaid");
  }

  // Ẩn tab thứ 5 nếu có
  if (tabs[4]) {
    tabs[4].querySelector(".tab-badge").textContent = 0;
    tabs[4].style.opacity = "0.5";
    tabs[4].style.pointerEvents = "none";
  }
}

// ============================================
// 📦 PHẦN 7: XEM CHI TIẾT ĐƠN HÀNG
// ============================================

async function viewOrderDetail(orderId) {
  try {
    console.log(`👁️ Viewing order details for ID: ${orderId}`);

    const response = await orderAPI.getOrderById(orderId);

    console.log("📄 Order detail response:", response);

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

  const employee = order.employee || {};
  const employeeName =
    employee.full_name ||
    employee.name ||
    employee.employee_name ||
    "Không xác định";

  const paymentMethod = order.payment_method || "cash";
  const paymentText = getPaymentMethodText(paymentMethod);

  const status = order.status || "pending";
  const statusText = getStatusText(status);
  const statusClass = getStatusClass(status);

  const totalAmount = order.total_amount || order.total || 0;
  const formattedTotal = formatPrice(totalAmount);

  const notes = order.notes || "Không có ghi chú";

  let itemsHTML = "";
  const orderItems = order.invoice_details || order.items || [];

  if (Array.isArray(orderItems) && orderItems.length > 0) {
    orderItems.forEach((item, index) => {
      const product = item.product || {};
      const productName =
        product.product_name || product.name || item.product_name || "Sản phẩm";
      const quantity = item.quantity || 1;
      const price = item.price || item.unit_price || 0;
      const subtotal = item.subtotal || item.total || quantity * price;

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
  } else {
    itemsHTML =
      '<tr><td colspan="5" style="text-align: center;">Không có sản phẩm</td></tr>';
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

  if (currentStatusEl) {
    currentStatusEl.innerHTML = `
      Trạng thái: <span class="order-status ${statusClass}">${statusText}</span>
    `;
  }

  modal.classList.add("active");
}

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

    // Cập nhật options trong select cho khớp với migration
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
      <option value="cancelled" ${
        status === "cancelled" ? "selected" : ""
      }>Đã hủy</option>
      <option value="completed" ${
        status === "completed" ? "selected" : ""
      }>Hoàn thành</option>
      <option value="processing" ${
        status === "processing" ? "selected" : ""
      }>Đang xử lý</option>
      <option value="shipping" ${
        status === "shipping" ? "selected" : ""
      }>Đang giao hàng</option>
    `;

    modal.classList.add("active");
  } catch (error) {
    console.error("❌ Error loading order for status update:", error);
    showToast("Lỗi", "Không thể tải thông tin đơn hàng", "error");
  }
}

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
  console.log("Note:", note);

  // Validate status trước khi gửi - CHỈ 3 GIÁ TRỊ
  const validStatuses = ["paid", "unpaid", "pending", "cancelled", "completed", "processing", "shipping"];
  if (!validStatuses.includes(newStatus)) {
    showToast(
      "Lỗi",
      `Trạng thái không hợp lệ: "${newStatus}". Chỉ chấp nhận: ${validStatuses.join(
        ", "
      )}`,
      "error"
    );
    return;
  }

  try {
    // ⚠️ QUAN TRỌNG: Gọi API cập nhật trạng thái qua endpoint riêng
    const response = await orderAPI.updateOrderStatus(
      currentOrderId,
      newStatus,
      note
    );

    console.log("✅ Update response:", response);

    // Đóng modal
    closeUpdateStatusModal();

    // Làm mới danh sách và thống kê
    await renderOrdersTable();
    await loadOrderStats();

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
      const errors = Object.values(error.data.errors).flat().join(", ");
      errorMessage = `Dữ liệu không hợp lệ: ${errors}`;
    }

    showToast("Lỗi", `Không thể cập nhật trạng thái: ${errorMessage}`, "error");
  }
}

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

function setupFilterEvents() {
  [statusFilter, paymentFilter, amountFilter].forEach((filter) => {
    if (filter) {
      filter.addEventListener("change", () => {
        currentPage = 1;
        renderOrdersTable();
      });
    }
  });

  [dateFrom, dateTo].forEach((dateInput) => {
    if (dateInput) {
      dateInput.addEventListener("change", () => {
        currentPage = 1;
        renderOrdersTable();
      });
    }
  });

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", () => {
      currentPage = 1;
      renderOrdersTable();
      showToast("Thành công", "Đã áp dụng bộ lọc", "success");
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }
}

function setupPaginationEvents() {
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener("change", function (e) {
      rowsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderOrdersTable();
    });
  }

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

function clearAllFilters() {
  if (statusFilter) statusFilter.value = "";
  if (paymentFilter) paymentFilter.value = "";
  if (amountFilter) amountFilter.value = "";
  if (dateFrom) dateFrom.value = "";
  if (dateTo) dateTo.value = "";
  if (searchInput) searchInput.value = "";

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

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const statCards = document.querySelectorAll(".stat-card");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const status = this.getAttribute("data-status");

      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      statCards.forEach((card) => card.classList.remove("active"));
      const matchingCard = document.querySelector(
        `.stat-card[data-filter="${status}"]`
      );
      if (matchingCard) {
        matchingCard.classList.add("active");
      }

      currentStatusFilter = status;
      currentPage = 1;
      renderOrdersTable();
    });
  });

  statCards.forEach((card) => {
    card.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      statCards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");

      tabs.forEach((tab) => tab.classList.remove("active"));
      const matchingTab = document.querySelector(
        `.tab-btn[data-status="${filter}"]`
      );
      if (matchingTab) {
        matchingTab.classList.add("active");
      }

      currentStatusFilter = filter;
      currentPage = 1;
      renderOrdersTable();
    });
  });
}

// ============================================
// 📦 PHẦN 11: HIỂN THỊ TRẠNG THÁI
// ============================================

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

async function initializeOrderApp() {
  try {
    console.log("🚀 Initializing Order Management App...");

    initializeDOMElements();
    await testAPIConnection();
    await loadOrderStats();
    await renderOrdersTable();
    setupAllEvents();

    console.log("🎉 Order Management App initialized successfully!");
    showToast("Thành công", "Ứng dụng quản lý đơn hàng đã sẵn sàng", "success");
  } catch (error) {
    console.error("❌ Error initializing order app:", error);
    showToast("Lỗi", "Không thể khởi tạo ứng dụng quản lý đơn hàng", "error");
  }
}

function initializeDOMElements() {
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

function setupAllEvents() {
  setupSearchEvent();
  setupFilterEvents();
  setupPaginationEvents();
  setupTabs();

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

  // Nút cập nhật trạng thái trong modal chi tiết
  const updateStatusBtn = document.getElementById("updateStatusBtn");
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener("click", () => {
      closeOrderDetailModal();
      if (currentOrderId) {
        showUpdateStatusModal(currentOrderId);
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

  // Sidebar
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

async function testAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/invoices`, {
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("📦 DOM loaded, starting order management app...");

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

window.renderOrdersTable = renderOrdersTable;
window.viewOrderDetail = viewOrderDetail;
window.showUpdateStatusModal = showUpdateStatusModal;
window.clearAllFilters = clearAllFilters;
window.closeOrderDetailModal = closeOrderDetailModal;
window.closeUpdateStatusModal = closeUpdateStatusModal;
window.saveOrderStatus = saveOrderStatus;

console.log("🚀 All functions exported to global scope");
