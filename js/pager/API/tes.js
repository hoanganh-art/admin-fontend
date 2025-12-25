// ========== DỮ LIỆU MẪU ==========
const sampleCustomers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    birthday: "1990-05-15",
    gender: "male",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    tier: "vip",
    status: "active",
    totalOrders: 12,
    totalSpent: 85650000,
    lastOrder: "2024-10-15",
    joinDate: "2023-01-10",
    notes: "Khách hàng VIP, thường xuyên mua sản phẩm cao cấp",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    birthday: "1992-08-22",
    gender: "female",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    tier: "gold",
    status: "active",
    totalOrders: 8,
    totalSpent: 45200000,
    lastOrder: "2024-10-14",
    joinDate: "2023-03-15",
    notes: "Yêu thích sản phẩm Samsung",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    birthday: "1985-12-03",
    gender: "male",
    address: "789 Đường DEF, Quận 5, TP.HCM",
    tier: "silver",
    status: "active",
    totalOrders: 5,
    totalSpent: 21500000,
    lastOrder: "2024-10-14",
    joinDate: "2023-05-20",
    notes: "Mua nhiều phụ kiện",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0934567890",
    birthday: "1995-03-18",
    gender: "female",
    address: "321 Đường GHI, Quận 7, TP.HCM",
    tier: "bronze",
    status: "active",
    totalOrders: 3,
    totalSpent: 9800000,
    lastOrder: "2024-10-13",
    joinDate: "2023-07-12",
    notes: "Khách hàng mới",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0945678901",
    birthday: "1988-07-30",
    gender: "male",
    address: "654 Đường JKL, Quận 10, TP.HCM",
    tier: "vip",
    status: "active",
    totalOrders: 15,
    totalSpent: 124500000,
    lastOrder: "2024-10-12",
    joinDate: "2022-11-05",
    notes: "Doanh nhân, mua hàng cho công ty",
  },
  {
    id: 6,
    name: "Vũ Thị F",
    email: "vuthif@email.com",
    phone: "0956789012",
    birthday: "1993-11-25",
    gender: "female",
    address: "987 Đường MNO, Quận Bình Thạnh, TP.HCM",
    tier: "gold",
    status: "inactive",
    totalOrders: 6,
    totalSpent: 32500000,
    lastOrder: "2024-08-20",
    joinDate: "2023-02-18",
    notes: "Đã chuyển sang sử dụng điện thoại khác",
  },
  {
    id: 7,
    name: "Đặng Văn G",
    email: "dangvang@email.com",
    phone: "0967890123",
    birthday: "1991-04-12",
    gender: "male",
    address: "147 Đường PQR, Quận Tân Bình, TP.HCM",
    tier: "silver",
    status: "active",
    totalOrders: 4,
    totalSpent: 18700000,
    lastOrder: "2024-10-11",
    joinDate: "2023-06-30",
    notes: "Thích mua đồ công nghệ mới",
  },
  {
    id: 8,
    name: "Bùi Thị H",
    email: "buithih@email.com",
    phone: "0978901234",
    birthday: "1987-09-08",
    gender: "female",
    address: "258 Đường STU, Quận Phú Nhuận, TP.HCM",
    tier: "bronze",
    status: "active",
    totalOrders: 2,
    totalSpent: 6500000,
    lastOrder: "2024-10-10",
    joinDate: "2023-09-15",
    notes: "Khách hàng mới, cần chăm sóc",
  },
  {
    id: 9,
    name: "Ngô Văn I",
    email: "ngovani@email.com",
    phone: "0989012345",
    birthday: "1994-06-19",
    gender: "male",
    address: "369 Đường VWX, Quận Gò Vấp, TP.HCM",
    tier: "vip",
    status: "active",
    totalOrders: 18,
    totalSpent: 156800000,
    lastOrder: "2024-10-09",
    joinDate: "2022-08-22",
    notes: "Khách hàng thân thiết, giới thiệu nhiều người",
  },
  {
    id: 10,
    name: "Trịnh Văn K",
    email: "trinhvank@email.com",
    phone: "0990123456",
    birthday: "1983-01-27",
    gender: "male",
    address: "753 Đường YZ, Quận Thủ Đức, TP.HCM",
    tier: "gold",
    status: "inactive",
    totalOrders: 7,
    totalSpent: 41200000,
    lastOrder: "2024-07-15",
    joinDate: "2023-04-10",
    notes: "Chuyển công tác ra Hà Nội",
  },
  {
    id: 11,
    name: "Lương Thị L",
    email: "luongthil@email.com",
    phone: "0911122334",
    birthday: "1996-02-14",
    gender: "female",
    address: "159 Đường Hà Nội, Quận 2, TP.HCM",
    tier: "silver",
    status: "active",
    totalOrders: 5,
    totalSpent: 23100000,
    lastOrder: "2024-10-08",
    joinDate: "2023-08-05",
    notes: "Sinh viên, thích sản phẩm giá rẻ",
  },
  {
    id: 12,
    name: "Võ Văn M",
    email: "vovanm@email.com",
    phone: "0922233445",
    birthday: "1989-10-05",
    gender: "male",
    address: "357 Đường Sài Gòn, Quận 4, TP.HCM",
    tier: "bronze",
    status: "active",
    totalOrders: 3,
    totalSpent: 12400000,
    lastOrder: "2024-10-07",
    joinDate: "2023-10-01",
    notes: "Nhân viên văn phòng",
  },
];

// ========== KHỞI TẠO BIẾN ==========
let currentPage = 1;
let rowsPerPage = 10;
let filteredCustomers = [...sampleCustomers];
let currentFilter = "all";
let currentCustomerDetail = null;
let isEditingCustomer = false;

// DOM Elements
const toggleSidebar = document.getElementById("toggleSidebar");
const addCustomerBtn = document.getElementById("addCustomerBtn");
const sendBulkMsgBtn = document.getElementById("sendBulkMsgBtn");
const customerDetailModal = document.getElementById("customerDetailModal");
const customerFormModal = document.getElementById("customerFormModal");
const closeCustomerModal = document.getElementById("closeCustomerModal");
const closeFormModal = document.getElementById("closeFormModal");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const saveCustomerBtn = document.getElementById("saveCustomerBtn");
const customersTableBody = document.getElementById("customersTableBody");
const selectAll = document.getElementById("selectAll");
const tierFilter = document.getElementById("tierFilter");
const statusFilter = document.getElementById("statusFilter");
const ageFilter = document.getElementById("ageFilter");
const spendingFilter = document.getElementById("spendingFilter");
const applyFilters = document.getElementById("applyFilters");
const clearFilters = document.getElementById("clearFilters");
const resetFilters = document.getElementById("resetFilters");
const rowsPerPageSelect = document.getElementById("rowsPerPage");
const refreshTable = document.getElementById("refreshTable");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.querySelector(".search-box input");
const modalTitle = document.getElementById("modalTitle");
const customerDetailContent = document.getElementById("customerDetailContent");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const updateTierBtn = document.getElementById("updateTierBtn");
const editCustomerBtn = document.getElementById("editCustomerBtn");
const deactivateCustomerBtn = document.getElementById("deactivateCustomerBtn");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");
const closeToast = document.getElementById("closeToast");
const statCards = document.querySelectorAll(".stat-card");

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

// ========== RENDER BẢNG KHÁCH HÀNG ==========
function renderCustomersTable() {
  customersTableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const customersToShow = filteredCustomers.slice(start, end);

  if (customersToShow.length === 0) {
    customersTableBody.innerHTML = `
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <i class="fas fa-user-friends"></i>
                                <h3>Không tìm thấy khách hàng</h3>
                                <p>Không có khách hàng nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                                <button class="btn btn-primary" onclick="clearAllFilters()">
                                    <i class="fas fa-times"></i>
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
    return;
  }

  customersToShow.forEach((customer) => {
    const tierClass = getTierClass(customer.tier);
    const tierText = getTierText(customer.tier);
    const statusClass = getStatusClass(customer.status);
    const statusText = getStatusText(customer.status);
    const initials = getInitials(customer.name);

    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>
                        <input type="checkbox" class="customer-checkbox" data-id="${
                          customer.id
                        }">
                    </td>
                    <td>
                        <div class="customer-info">
                            <div class="customer-avatar">${initials}</div>
                            <div class="customer-details">
                                <div class="customer-name">${
                                  customer.name
                                }</div>
                                <div class="customer-email">${
                                  customer.email
                                }</div>
                            </div>
                        </div>
                    </td>
                    <td class="customer-phone">${customer.phone}</td>
                    <td>
                        <span class="customer-tier ${tierClass}">${tierText}</span>
                    </td>
                    <td>
                        <span class="customer-status ${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        <div class="customer-stats">
                            <div class="stat-item">
                                <i class="fas fa-shopping-cart"></i>
                                <span>${customer.totalOrders} đơn hàng</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>${formatPrice(
                                  customer.totalSpent
                                )}₫</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="customer-actions">
                            <button class="action-btn view" onclick="viewCustomerDetail(${
                              customer.id
                            })" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="editCustomer(${
                              customer.id
                            })" title="Chỉnh sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn message" onclick="sendMessageToCustomer(${
                              customer.id
                            })" title="Gửi tin nhắn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                            <button class="action-btn delete" onclick="deactivateCustomer(${
                              customer.id
                            })" title="Ngừng kích hoạt">
                                <i class="fas fa-user-slash"></i>
                            </button>
                        </div>
                    </td>
                `;
    customersTableBody.appendChild(row);
  });

  updateTableInfo();
  updatePagination();
}

// ========== HÀM HỖ TRỢ ==========
function getTierClass(tier) {
  const classes = {
    vip: "tier-vip",
    gold: "tier-gold",
    silver: "tier-silver",
    bronze: "tier-bronze",
  };
  return classes[tier] || "tier-bronze";
}

function getTierText(tier) {
  const texts = {
    vip: "VIP",
    gold: "Vàng",
    silver: "Bạc",
    bronze: "Đồng",
  };
  return texts[tier] || tier;
}

function getStatusClass(status) {
  const classes = {
    active: "status-active",
    inactive: "status-inactive",
  };
  return classes[status] || "status-active";
}

function getStatusText(status) {
  const texts = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
  };
  return texts[status] || status;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function calculateAge(birthday) {
  if (!birthday) return "N/A";
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function updateTableInfo() {
  const total = filteredCustomers.length;
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, total);
  const infoElement = document.querySelector(".table-info");
  if (infoElement) {
    infoElement.innerHTML = `Hiển thị <strong>${start}-${end}</strong> trong tổng số <strong>${total}</strong> khách hàng`;
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
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
function applyCustomerFilters() {
  filteredCustomers = sampleCustomers.filter((customer) => {
    // Lọc theo hạng thành viên
    if (tierFilter.value && customer.tier !== tierFilter.value) {
      return false;
    }

    // Lọc theo trạng thái
    if (statusFilter.value && customer.status !== statusFilter.value) {
      return false;
    }

    // Lọc theo độ tuổi
    if (ageFilter.value) {
      const age = calculateAge(customer.birthday);
      if (age === "N/A") return false;

      switch (ageFilter.value) {
        case "18-25":
          if (age < 18 || age > 25) return false;
          break;
        case "26-35":
          if (age < 26 || age > 35) return false;
          break;
        case "36-45":
          if (age < 36 || age > 45) return false;
          break;
        case "46+":
          if (age < 46) return false;
          break;
      }
    }

    // Lọc theo tổng chi tiêu
    if (spendingFilter.value) {
      const spent = customer.totalSpent;
      switch (spendingFilter.value) {
        case "low":
          if (spent >= 10000000) return false;
          break;
        case "medium":
          if (spent < 10000000 || spent > 50000000) return false;
          break;
        case "high":
          if (spent < 50000000) return false;
          break;
      }
    }

    return true;
  });

  currentPage = 1;
  renderCustomersTable();
  updateStatsCards();
}

function clearAllFilters() {
  tierFilter.value = "";
  statusFilter.value = "";
  ageFilter.value = "";
  spendingFilter.value = "";
  searchInput.value = "";
  currentFilter = "all";

  // Reset stat cards
  statCards.forEach((card) => {
    card.classList.remove("active");
    if (card.dataset.filter === "all") {
      card.classList.add("active");
    }
  });

  filteredCustomers = [...sampleCustomers];
  currentPage = 1;
  renderCustomersTable();
  updateStatsCards();
  showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

function updateStatsCards() {
  const stats = {
    all: filteredCustomers.length,
    active: filteredCustomers.filter((c) => c.status === "active").length,
    new: filteredCustomers.filter((c) => {
      const joinDate = new Date(c.joinDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return joinDate > thirtyDaysAgo;
    }).length,
    vip: filteredCustomers.filter((c) => c.tier === "vip").length,
    inactive: filteredCustomers.filter((c) => c.status === "inactive").length,
  };

  // Cập nhật số liệu trên stat cards
  statCards.forEach((card) => {
    const filter = card.dataset.filter;
    const numberElement = card.querySelector(".stat-number");
    if (numberElement) {
      numberElement.textContent = stats[filter] || 0;
    }
  });
}

// ========== CUSTOMER DETAIL FUNCTIONS ==========
function viewCustomerDetail(customerId) {
  const customer = sampleCustomers.find((c) => c.id === customerId);
  if (!customer) return;

  currentCustomerDetail = customer;

  // Render chi tiết khách hàng
  const tierClass = getTierClass(customer.tier);
  const tierText = getTierText(customer.tier);
  const statusClass = getStatusClass(customer.status);
  const statusText = getStatusText(customer.status);
  const initials = getInitials(customer.name);
  const age = calculateAge(customer.birthday);
  const genderText =
    customer.gender === "male"
      ? "Nam"
      : customer.gender === "female"
      ? "Nữ"
      : "Khác";

  // Giả lập dữ liệu đơn hàng
  const sampleOrders = [
    {
      id: "HD20241015-001",
      products: "iPhone 15 Pro",
      amount: 25490000,
      status: "completed",
    },
    {
      id: "HD20241010-012",
      products: "AirPods Pro 2",
      amount: 6490000,
      status: "completed",
    },
    {
      id: "HD20240928-045",
      products: "Samsung Galaxy S23",
      amount: 18990000,
      status: "completed",
    },
    {
      id: "HD20240915-023",
      products: "iPad Air",
      amount: 15990000,
      status: "completed",
    },
    {
      id: "HD20240830-067",
      products: "Apple Watch",
      amount: 11990000,
      status: "completed",
    },
  ];

  let ordersHtml = "";
  sampleOrders.forEach((order) => {
    const statusClass =
      order.status === "completed" ? "status-active" : "status-pending";
    const statusText =
      order.status === "completed" ? "Hoàn thành" : "Đang xử lý";

    ordersHtml += `
                    <div class="order-history-item">
                        <div class="order-id">${order.id}</div>
                        <div class="order-products">${order.products}</div>
                        <div class="order-amount">${formatPrice(
                          order.amount
                        )}₫</div>
                        <div class="order-status-small ${statusClass}">${statusText}</div>
                    </div>
                `;
  });

  customerDetailContent.innerHTML = `
                <div>
                    <div class="detail-section">
                        <div class="customer-profile-header">
                            <div class="customer-avatar-large">${initials}</div>
                            <div class="customer-basic-info">
                                <h3>${customer.name}</h3>
                                <p>${customer.email}</p>
                                <p>${customer.phone}</p>
                                <p>Tham gia: ${formatDate(
                                  customer.joinDate
                                )}</p>
                            </div>
                        </div>
                        
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Hạng thành viên</span>
                                <span class="info-value"><span class="customer-tier ${tierClass}">${tierText}</span></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Trạng thái</span>
                                <span class="info-value"><span class="customer-status ${statusClass}">${statusText}</span></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Ngày sinh</span>
                                <span class="info-value">${
                                  customer.birthday
                                    ? formatDate(customer.birthday) +
                                      ` (${age} tuổi)`
                                    : "N/A"
                                }</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Giới tính</span>
                                <span class="info-value">${genderText}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3 class="section-title">
                            <i class="fas fa-map-marker-alt"></i>
                            Thông Tin Liên Hệ
                        </h3>
                        <div style="margin-bottom: 16px;">
                            <div class="info-label">Địa chỉ</div>
                            <div class="info-value">${
                              customer.address || "Chưa cập nhật"
                            }</div>
                        </div>
                        <div>
                            <div class="info-label">Ghi chú</div>
                            <div class="info-value">${
                              customer.notes || "Không có ghi chú"
                            }</div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3 class="section-title">
                            <i class="fas fa-chart-line"></i>
                            Hoạt Động Gần Đây
                        </h3>
                        <div class="chart-container">
                            Biểu đồ hoạt động sẽ hiển thị ở đây
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="detail-section">
                        <h3 class="section-title">
                            <i class="fas fa-shopping-cart"></i>
                            Thống Kê Mua Hàng
                        </h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Tổng đơn hàng</span>
                                <span class="info-value" style="font-size: 24px; color: var(--primary-color);">${
                                  customer.totalOrders
                                }</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Tổng chi tiêu</span>
                                <span class="info-value" style="font-size: 24px; color: var(--primary-color);">${formatPrice(
                                  customer.totalSpent
                                )}₫</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Đơn hàng trung bình</span>
                                <span class="info-value">${formatPrice(
                                  Math.round(
                                    customer.totalSpent / customer.totalOrders
                                  )
                                )}₫</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Đơn hàng cuối</span>
                                <span class="info-value">${formatDate(
                                  customer.lastOrder
                                )}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3 class="section-title">
                            <i class="fas fa-history"></i>
                            Lịch Sử Đơn Hàng
                        </h3>
                        <div class="order-history">
                            ${ordersHtml}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3 class="section-title">
                            <i class="fas fa-gift"></i>
                            Ưu Đãi Đặc Biệt
                        </h3>
                        <div style="text-align: center; padding: 20px;">
                            <i class="fas fa-tag" style="font-size: 48px; color: var(--primary-color); margin-bottom: 16px;"></i>
                            <h4 style="margin-bottom: 8px; color: var(--gray-800);">Khách hàng ${tierText}</h4>
                            <p style="color: var(--gray-600); margin-bottom: 16px;">Được hưởng ưu đãi đặc biệt cho hạng thành viên</p>
                            <button class="btn btn-primary">
                                <i class="fas fa-gift"></i>
                                Xem Ưu Đãi
                            </button>
                        </div>
                    </div>
                </div>
            `;

  // Cập nhật hạng thành viên hiện tại
  document.querySelector(
    "#currentCustomerTier .customer-tier"
  ).className = `customer-tier ${tierClass}`;
  document.querySelector("#currentCustomerTier .customer-tier").textContent =
    tierText;

  customerDetailModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCustomerModalFunc() {
  customerDetailModal.classList.remove("active");
  document.body.style.overflow = "auto";
  currentCustomerDetail = null;
}

function closeFormModalFunc() {
  customerFormModal.classList.remove("active");
  document.body.style.overflow = "auto";
  isEditingCustomer = false;
}

function openCustomerForm(editMode = false, customerData = null) {
  if (editMode && customerData) {
    modalTitle.textContent = "Chỉnh Sửa Khách Hàng";
    isEditingCustomer = true;
    currentCustomerDetail = customerData;

    // Điền dữ liệu vào form
    document.getElementById("customerName").value = customerData.name;
    document.getElementById("customerEmail").value = customerData.email;
    document.getElementById("customerPhone").value = customerData.phone;
    document.getElementById("customerBirthday").value =
      customerData.birthday || "";
    document.getElementById("customerGender").value = customerData.gender || "";
    document.getElementById("customerTier").value = customerData.tier;
    document.getElementById("customerAddress").value =
      customerData.address || "";
    document.getElementById("customerNotes").value = customerData.notes || "";

    // Đặt trạng thái
    const statusRadio = document.querySelector(
      `input[name="customerStatus"][value="${customerData.status}"]`
    );
    if (statusRadio) statusRadio.checked = true;
  } else {
    modalTitle.textContent = "Thêm Khách Hàng Mới";
    isEditingCustomer = false;
    currentCustomerDetail = null;
    document.getElementById("customerForm").reset();
  }

  customerFormModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function saveCustomer() {
  // Lấy dữ liệu từ form
  const formData = {
    id: isEditingCustomer
      ? currentCustomerDetail.id
      : sampleCustomers.length + 1,
    name: document.getElementById("customerName").value,
    email: document.getElementById("customerEmail").value,
    phone: document.getElementById("customerPhone").value,
    birthday: document.getElementById("customerBirthday").value || null,
    gender: document.getElementById("customerGender").value,
    address: document.getElementById("customerAddress").value,
    tier: document.getElementById("customerTier").value,
    status: document.querySelector('input[name="customerStatus"]:checked')
      .value,
    notes: document.getElementById("customerNotes").value,
    totalOrders: isEditingCustomer ? currentCustomerDetail.totalOrders : 0,
    totalSpent: isEditingCustomer ? currentCustomerDetail.totalSpent : 0,
    lastOrder: isEditingCustomer ? currentCustomerDetail.lastOrder : null,
    joinDate: isEditingCustomer
      ? currentCustomerDetail.joinDate
      : new Date().toISOString().split("T")[0],
  };

  // Validate dữ liệu
  if (!formData.name || !formData.email || !formData.phone) {
    showToast("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
    return;
  }

  // Hiệu ứng loading
  saveCustomerBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
  saveCustomerBtn.disabled = true;

  // Giả lập lưu dữ liệu
  setTimeout(() => {
    if (isEditingCustomer) {
      // Cập nhật khách hàng
      const index = sampleCustomers.findIndex(
        (c) => c.id === currentCustomerDetail.id
      );
      if (index !== -1) {
        sampleCustomers[index] = formData;
      }
    } else {
      // Thêm khách hàng mới
      sampleCustomers.unshift(formData);
    }

    // Cập nhật UI
    applyCustomerFilters();
    closeFormModalFunc();

    // Hiển thị thông báo
    showToast(
      "Thành công",
      isEditingCustomer
        ? "Đã cập nhật khách hàng thành công"
        : "Đã thêm khách hàng mới thành công",
      "success"
    );

    // Reset nút
    saveCustomerBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Khách Hàng';
    saveCustomerBtn.disabled = false;
  }, 1500);
}

function editCustomer(customerId) {
  const customer = sampleCustomers.find((c) => c.id === customerId);
  if (customer) {
    openCustomerForm(true, customer);
  }
}

function sendMessageToCustomer(customerId) {
  const customer = sampleCustomers.find((c) => c.id === customerId);
  if (customer) {
    showToast(
      "Gửi tin nhắn",
      `Đang mở hộp thoại gửi tin nhắn cho ${customer.name}...`,
      "success"
    );
  }
}

function deactivateCustomer(customerId) {
  const customer = sampleCustomers.find((c) => c.id === customerId);
  if (!customer) return;

  if (customer.status === "inactive") {
    showToast("Thông báo", "Khách hàng đã ngừng hoạt động", "warning");
    return;
  }

  if (
    confirm(
      `Bạn có chắc chắn muốn ngừng kích hoạt khách hàng ${customer.name}?`
    )
  ) {
    // Hiệu ứng loading
    showToast(
      "Đang xử lý",
      `Đang cập nhật trạng thái khách hàng ${customer.name}...`,
      "warning"
    );

    // Giả lập cập nhật
    setTimeout(() => {
      const customerIndex = sampleCustomers.findIndex(
        (c) => c.id === customerId
      );
      if (customerIndex !== -1) {
        sampleCustomers[customerIndex].status = "inactive";
      }

      // Cập nhật UI
      applyCustomerFilters();

      // Hiển thị thông báo
      showToast(
        "Thành công",
        `Đã ngừng kích hoạt khách hàng ${customer.name}`,
        "success"
      );
    }, 1000);
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
addCustomerBtn.addEventListener("click", () => openCustomerForm());
sendBulkMsgBtn.addEventListener("click", () => {
  showToast(
    "Gửi thông báo hàng loạt",
    "Đang mở hộp thoại gửi thông báo...",
    "success"
  );
});

closeCustomerModal.addEventListener("click", closeCustomerModalFunc);
closeFormModal.addEventListener("click", closeFormModalFunc);
cancelFormBtn.addEventListener("click", closeFormModalFunc);
saveCustomerBtn.addEventListener("click", saveCustomer);
sendMessageBtn.addEventListener("click", () => {
  if (currentCustomerDetail) {
    sendMessageToCustomer(currentCustomerDetail.id);
  }
});
updateTierBtn.addEventListener("click", () => {
  if (currentCustomerDetail) {
    showToast(
      "Đổi hạng",
      `Đang mở hộp thoại đổi hạng cho ${currentCustomerDetail.name}...`,
      "success"
    );
  }
});
editCustomerBtn.addEventListener("click", () => {
  if (currentCustomerDetail) {
    editCustomer(currentCustomerDetail.id);
  }
});
deactivateCustomerBtn.addEventListener("click", () => {
  if (currentCustomerDetail) {
    deactivateCustomer(currentCustomerDetail.id);
  }
});

// Filter events
applyFilters.addEventListener("click", applyCustomerFilters);
clearFilters.addEventListener("click", () => {
  tierFilter.value = "";
  statusFilter.value = "";
  ageFilter.value = "";
  spendingFilter.value = "";
  applyCustomerFilters();
  showToast("Thành công", "Đã xóa bộ lọc", "success");
});

resetFilters.addEventListener("click", clearAllFilters);

// Stat cards events
statCards.forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.dataset.filter;

    // Update active state
    statCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");

    currentFilter = filter;

    // Áp dụng filter tương ứng
    switch (filter) {
      case "all":
        clearAllFilters();
        break;
      case "active":
        statusFilter.value = "active";
        break;
      case "new":
        // Filter khách hàng mới (30 ngày)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredCustomers = sampleCustomers.filter((c) => {
          const joinDate = new Date(c.joinDate);
          return joinDate > thirtyDaysAgo;
        });
        currentPage = 1;
        renderCustomersTable();
        break;
      case "vip":
        tierFilter.value = "vip";
        break;
      case "inactive":
        statusFilter.value = "inactive";
        break;
    }

    if (filter !== "new") {
      applyCustomerFilters();
    }
  });
});

// Search event
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    const searchTerm = searchInput.value.toLowerCase();
    filteredCustomers = sampleCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
    currentPage = 1;
    renderCustomersTable();
    showToast(
      "Tìm kiếm",
      `Tìm thấy ${filteredCustomers.length} khách hàng phù hợp`,
      "success"
    );
  }
});

// Pagination events
rowsPerPageSelect.addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderCustomersTable();
});

refreshTable.addEventListener("click", () => {
  filteredCustomers = [...sampleCustomers];
  currentPage = 1;
  renderCustomersTable();
  showToast("Thành công", "Đã làm mới danh sách khách hàng", "success");
});

exportBtn.addEventListener("click", () => {
  showToast(
    "Xuất file",
    "Đang xuất dữ liệu khách hàng ra file Excel...",
    "success"
  );
});

// Select all checkbox
selectAll.addEventListener("change", (e) => {
  const checkboxes = document.querySelectorAll(".customer-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = e.target.checked;
  });
});

// Pagination button events
document.getElementById("firstPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage = 1;
    renderCustomersTable();
  }
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCustomersTable();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCustomersTable();
  }
});

document.getElementById("lastPage").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage = totalPages;
    renderCustomersTable();
  }
});

// Close toast
closeToast.addEventListener("click", () => {
  toast.classList.remove("show");
});

// Đóng modal khi click bên ngoài
window.addEventListener("click", (e) => {
  if (e.target === customerDetailModal) closeCustomerModalFunc();
  if (e.target === customerFormModal) closeFormModalFunc();
});

// ========== KHỞI TẠO ==========
document.addEventListener("DOMContentLoaded", () => {
  // Render bảng khách hàng ban đầu
  renderCustomersTable();

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

  // Thêm hiệu ứng cho progress bars
  setTimeout(() => {
    document.querySelectorAll(".segment-progress-bar").forEach((bar) => {
      bar.style.transition = "width 1.5s ease";
    });
  }, 500);
});
