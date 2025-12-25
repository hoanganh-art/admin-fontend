// ========== CẤU HÌNH API ==========
const API_BASE_URL = "http://127.0.0.1:6346";
const API_ENDPOINTS = {
  customers: "/api/customers",
  customersId: "/api/customers/{id}",
  customersStats: "/api/customers/stats",
};

// ========== XỬ LÝ RESPONSE API ==========
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ========== API SERVICE FUNCTIONS ==========
async function getCustomers(params = {}) {
  const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.customers}`);

  if (params) {
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        url.searchParams.append(key, params[key]);
      }
    });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

async function getCustomerStats() {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.customersStats}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    throw error;
  }
}

async function getCustomerById(id) {
  try {
    const endpoint = API_ENDPOINTS.customersId.replace("{id}", id);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error);
    throw error;
  }
}

async function createCustomer(customerData) {
  try {
    console.log("Creating customer with data:", customerData);
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.customers}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(customerData),
    });
    console.log("Response status:", response.status);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating customer:", error);
    console.error("Customer data was:", customerData);
    throw error;
  }
}

async function updateCustomer(id, customerData) {
  try {
    const endpoint = API_ENDPOINTS.customersId.replace("{id}", id);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(customerData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error updating customer with id ${id}:`, error);
    throw error;
  }
}

async function deleteCustomer(id) {
  try {
    const endpoint = API_ENDPOINTS.customersId.replace("{id}", id);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    throw error;
  }
}

// ========== KHỞI TẠO BIẾN (THAY THẾ DỮ LIỆU MẪU) ==========
let currentPage = 1;
let rowsPerPage = 10;
let currentFilter = "all";
let currentCustomerDetail = null;
let isEditingCustomer = false;
let apiCustomers = [];
let totalCustomers = 0;
let lastPage = 1;

// DOM Elements (sẽ được khởi tạo khi DOM ready)
let customersTableBody = null;
let customerDetailModal = null;
let customerDetailContent = null;
let customerFormModal = null;
let saveCustomerBtn = null;
let toast = null;
let toastIcon = null;
let toastTitle = null;
let toastMessage = null;

// ========== RENDER BẢNG KHÁCH HÀNG TỪ API ==========
async function renderCustomersTable() {
  try {
    // Hiển thị loading
    customersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--primary-color); margin-bottom: 16px;"></i>
                    <p>Đang tải dữ liệu...</p>
                </td>
            </tr>
        `;

    // Gọi API với các tham số filter và phân trang
    const params = {
      page: currentPage,
      per_page: rowsPerPage,
    };

    // Thêm search nếu có
    const searchValue = document.querySelector(".search-box input").value;
    if (searchValue) {
      params.search = searchValue;
    }

    // Thêm filter membership nếu có
    const tierValue = document.getElementById("tierFilter").value;
    if (tierValue) {
      params.membership = tierValue;
    }

    // Thêm filter status nếu có (chọn status thật, không phải gender)
    const statusValue = document.getElementById("statusFilter").value;
    if (statusValue) {
      params.status = statusValue;
    }

    const response = await getCustomers(params);

    apiCustomers = response.data || response; // Xử lý cả 2 trường hợp
    totalCustomers = response.total || apiCustomers.length;
    lastPage = response.last_page || Math.ceil(totalCustomers / rowsPerPage);
    currentPage = response.current_page || currentPage;

    customersTableBody.innerHTML = "";

    if (!apiCustomers || apiCustomers.length === 0) {
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
      updateTableInfo();
      updatePagination();
      return;
    }

    apiCustomers.forEach((customer) => {
      const tierClass = getTierClass(customer.membership);
      const tierText = getTierText(customer.membership);
      const statusClass = customer.status || "status-active";
      const statusText = customer.status ? "Ngừng hoạt động" : "Đang hoạt động";
      const initials = getInitials(customer.full_name);

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
                              customer.full_name || "N/A"
                            }</div>
                            <div class="customer-email">${
                              customer.email || "N/A"
                            }</div>
                        </div>
                    </div>
                </td>
                <td class="customer-phone">${customer.phone || "N/A"}</td>
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
                            <i class="fas fa-crown"></i>
                            <span>${customer.points || 0} điểm</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-calendar"></i>
                            <span>${
                              formatDate(customer.created_at) || "N/A"
                            }</span>
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
  } catch (error) {
    console.error("Error rendering customers table:", error);
    customersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle" style="color: var(--danger-color);"></i>
                        <h3>Lỗi tải dữ liệu</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary" onclick="renderCustomersTable()">
                            <i class="fas fa-redo"></i>
                            Thử lại
                        </button>
                    </div>
                </td>
            </tr>
        `;
  }
}

// ========== CẬP NHẬT THỐNG KÊ TỪ API ==========
async function updateStatsFromAPI() {
  try {
    const stats = await getCustomerStats();

    // Cập nhật stat cards
    const statCards = document.querySelectorAll(".stat-card");

    // Cập nhật tổng số khách hàng
    if (stats.total !== undefined) {
      document.querySelector('[data-filter="all"] .stat-number').textContent =
        stats.total;
      totalCustomers = stats.total;
    }

    // Cập nhật theo membership
    if (stats.by_membership) {
      const vipCount =
        stats.by_membership.find((m) => m.membership === "VIP")?.count || 0;
      const goldCount =
        stats.by_membership.find((m) => m.membership === "Vàng")?.count || 0;
      const silverCount =
        stats.by_membership.find((m) => m.membership === "Bạc")?.count || 0;
      const bronzeCount =
        stats.by_membership.find((m) => m.membership === "Đồng")?.count || 0;

      document.querySelector('[data-filter="vip"] .stat-number').textContent =
        vipCount;
      document.querySelector('[data-filter="new"] .stat-number').textContent =
        goldCount; // Tạm thời dùng gold cho new

      // Cập nhật tổng active (tổng tất cả trừ inactive)
      const activeCount =
        stats.total -
        (stats.by_status?.find((s) => s.status === "inactive")?.count || 0);
      document.querySelector(
        '[data-filter="active"] .stat-number'
      ).textContent = activeCount;

      // Cập nhật inactive
      const inactiveCount =
        stats.by_status?.find((s) => s.status === "inactive")?.count || 0;
      document.querySelector(
        '[data-filter="inactive"] .stat-number'
      ).textContent = inactiveCount;
    }

    // Cập nhật segment cards
    updateSegmentCards(stats);
  } catch (error) {
    console.error("Error updating stats from API:", error);
  }
}

// ========== CẬP NHẬT SEGMENT CARDS ==========
function updateSegmentCards(stats) {
  // Cập nhật phân bố theo giới tính
  if (stats.by_gender) {
    const maleCount =
      stats.by_gender.find((g) => g.gender === "Nam")?.count || 0;
    const femaleCount =
      stats.by_gender.find((g) => g.gender === "Nữ")?.count || 0;
    const otherCount =
      stats.by_gender.find((g) => g.gender === "Khác")?.count || 0;
    const totalGender = maleCount + femaleCount + otherCount;

    // Tính phần trăm
    const malePercent =
      totalGender > 0 ? ((maleCount / totalGender) * 100).toFixed(1) : 0;
    const femalePercent =
      totalGender > 0 ? ((femaleCount / totalGender) * 100).toFixed(1) : 0;
    const otherPercent =
      totalGender > 0 ? ((otherCount / totalGender) * 100).toFixed(1) : 0;

    // Cập nhật segment gender
    const genderSegment = document.querySelector(
      ".segments-container .segment-card:nth-child(1)"
    );
    if (genderSegment) {
      genderSegment.querySelector(".segment-details").innerHTML = `
                <span>Nam: ${maleCount} KH (${malePercent}%)</span>
                <span>Nữ: ${femaleCount} KH (${femalePercent}%)</span>
            `;

      // Cập nhật progress bars
      const progressBars = genderSegment.querySelectorAll(
        ".segment-progress-bar"
      );
      if (progressBars[0]) progressBars[0].style.width = `${malePercent}%`;
      if (progressBars[1]) progressBars[1].style.width = `${femalePercent}%`;
    }
  }

  // Cập nhật phân bố theo membership
  if (stats.by_membership) {
    const vipCount =
      stats.by_membership.find((m) => m.membership === "VIP")?.count || 0;
    const goldCount =
      stats.by_membership.find((m) => m.membership === "Vàng")?.count || 0;
    const silverCount =
      stats.by_membership.find((m) => m.membership === "Bạc")?.count || 0;
    const bronzeCount =
      stats.by_membership.find((m) => m.membership === "Đồng")?.count || 0;
    const totalMembership = vipCount + goldCount + silverCount + bronzeCount;

    // Tính phần trăm
    const vipPercent =
      totalMembership > 0 ? ((vipCount / totalMembership) * 100).toFixed(1) : 0;
    const goldPercent =
      totalMembership > 0
        ? ((goldCount / totalMembership) * 100).toFixed(1)
        : 0;
    const silverPercent =
      totalMembership > 0
        ? ((silverCount / totalMembership) * 100).toFixed(1)
        : 0;
    const bronzePercent =
      totalMembership > 0
        ? ((bronzeCount / totalMembership) * 100).toFixed(1)
        : 0;

    // Cập nhật segment membership
    const membershipSegment = document.querySelector(
      ".segments-container .segment-card:nth-child(2)"
    );
    if (membershipSegment) {
      membershipSegment.querySelector(".segment-details").innerHTML = `
                <span>VIP: ${vipCount} KH (${vipPercent}%)</span>
                <span>Vàng: ${goldCount} KH (${goldPercent}%)</span>
            `;

      // Cập nhật progress bars
      const progressBars = membershipSegment.querySelectorAll(
        ".segment-progress-bar"
      );
      if (progressBars[0]) progressBars[0].style.width = `${vipPercent}%`;
      if (progressBars[1]) progressBars[1].style.width = `${goldPercent}%`;
    }
  }

  // Cập nhật top customers
  if (stats.top_customers) {
    const topCustomersSegment = document.querySelector(
      ".segments-container .segment-card:nth-child(3)"
    );
    if (topCustomersSegment && stats.top_customers.length > 0) {
      const topCustomer = stats.top_customers[0];
      topCustomersSegment.querySelector(".segment-details").innerHTML = `
                <span>Top 1: ${topCustomer.full_name}</span>
                <span>${topCustomer.points || 0} điểm</span>
            `;
    }
  }
}

// ========== HÀM HỖ TRỢ MỚI ==========
function getTierClass(tier) {
  if (!tier) return "tier-bronze";
  const classes = {
    VIP: "tier-vip",
    Vàng: "tier-gold",
    Bạc: "tier-silver",
    Đồng: "tier-bronze",
    vip: "tier-vip",
    gold: "tier-gold",
    silver: "tier-silver",
    bronze: "tier-bronze",
  };
  return classes[tier] || "tier-bronze";
}

function getTierText(tier) {
  if (!tier) return "Đồng";
  const texts = {
    VIP: "VIP",
    Vàng: "Vàng",
    Bạc: "Bạc",
    Đồng: "Đồng",
    vip: "VIP",
    gold: "Vàng",
    silver: "Bạc",
    bronze: "Đồng",
  };
  return texts[tier] || "Đồng";
}

function getInitials(name) {
  if (!name) return "KH";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function updateTableInfo() {
  const total = totalCustomers;
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, total);
  const infoElement = document.querySelector(".table-info");
  if (infoElement) {
    infoElement.innerHTML = `Hiển thị <strong>${start}-${end}</strong> trong tổng số <strong>${total}</strong> khách hàng`;
  }
}

function updatePagination() {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  const numberButtons = paginationContainer.querySelectorAll(
    ".pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)"
  );

  // Hiển thị 5 nút phân trang
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(lastPage, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  numberButtons.forEach((btn, index) => {
    const pageNum = startPage + index;
    if (pageNum <= endPage) {
      btn.textContent = pageNum;
      btn.style.display = "flex";
      btn.classList.toggle("active", pageNum === currentPage);
      btn.onclick = () => goToPage(pageNum);
    } else {
      btn.style.display = "none";
    }
  });

  // Cập nhật trạng thái nút điều hướng
  document.getElementById("firstPage").disabled = currentPage === 1;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === lastPage;
  document.getElementById("lastPage").disabled = currentPage === lastPage;
}

function goToPage(page) {
  currentPage = page;
  renderCustomersTable();
}

// ========== FILTER FUNCTIONS (CẬP NHẬT) ==========
async function applyCustomerFilters() {
  currentPage = 1;
  await renderCustomersTable();
  await updateStatsFromAPI();
  showToast("Thành công", "Đã áp dụng bộ lọc", "success");
}

function clearAllFilters() {
  document.getElementById("tierFilter").value = "";
  document.getElementById("statusFilter").value = "";
  document.querySelector(".search-box input").value = "";

  // Reset stat cards
  document.querySelectorAll(".stat-card").forEach((card) => {
    card.classList.remove("active");
    if (card.dataset.filter === "all") {
      card.classList.add("active");
    }
  });

  currentPage = 1;
  renderCustomersTable();
  updateStatsFromAPI();
  showToast("Thành công", "Đã xóa tất cả bộ lọc", "success");
}

// ========== CUSTOMER DETAIL FUNCTIONS (CẬP NHẬT) ==========
async function viewCustomerDetail(customerId) {
  try {
    // Hiển thị loading
    customerDetailContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color); margin-bottom: 16px;"></i>
                <p>Đang tải thông tin khách hàng...</p>
            </div>
        `;

    customerDetailModal.classList.add("active");
    document.body.style.overflow = "hidden";

    const customer = await getCustomerById(customerId);
    currentCustomerDetail = customer;

    const tierClass = getTierClass(customer.membership);
    const tierText = getTierText(customer.membership);
    const initials = getInitials(customer.full_name);
    const genderText = customer.gender || "Không xác định";
    const age = customer.date_of_birth
      ? calculateAge(customer.date_of_birth)
      : "N/A";

    customerDetailContent.innerHTML = `
            <div>
                <div class="detail-section">
                    <div class="customer-profile-header">
                        <div class="customer-avatar-large">${initials}</div>
                        <div class="customer-basic-info">
                            <h3>${customer.full_name || "N/A"}</h3>
                            <p>${customer.email || "N/A"}</p>
                            <p>${customer.phone || "N/A"}</p>
                            <p>Tham gia: ${
                              formatDate(customer.created_at) || "N/A"
                            }</p>
                        </div>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Hạng thành viên</span>
                            <span class="info-value"><span class="customer-tier ${tierClass}">${tierText}</span></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Điểm tích lũy</span>
                            <span class="info-value">${
                              customer.points || 0
                            } điểm</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ngày sinh</span>
                            <span class="info-value">${
                              customer.date_of_birth
                                ? formatDate(customer.date_of_birth) +
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
                          customer.description || "Không có ghi chú"
                        }</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3 class="section-title">
                        <i class="fas fa-chart-line"></i>
                        Hoạt Động Gần Đây
                    </h3>
                    <div class="chart-container">
                        <p>Khách hàng có ${
                          customer.points || 0
                        } điểm tích lũy</p>
                        <p>Hạng thành viên: ${tierText}</p>
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
                            <span class="info-label">Hạng thành viên</span>
                            <span class="info-value" style="font-size: 24px; color: var(--primary-color);">${tierText}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Điểm tích lũy</span>
                            <span class="info-value" style="font-size: 24px; color: var(--primary-color);">${
                              customer.points || 0
                            }</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ngày tham gia</span>
                            <span class="info-value">${
                              formatDate(customer.created_at) || "N/A"
                            }</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Cập nhật lần cuối</span>
                            <span class="info-value">${
                              formatDate(customer.updated_at) || "N/A"
                            }</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3 class="section-title">
                        <i class="fas fa-history"></i>
                        Thông Tin Hệ Thống
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">ID Khách hàng</span>
                            <span class="info-value">${customer.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email xác thực</span>
                            <span class="info-value">${
                              customer.email_verified_at
                                ? "Đã xác thực"
                                : "Chưa xác thực"
                            }</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Trạng thái</span>
                            <span class="info-value">${
                              customer.status || "Đang hoạt động"
                            }</span>
                        </div>
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
    const tierElement = document.querySelector(
      "#currentCustomerTier .customer-tier"
    );
    if (tierElement) {
      tierElement.className = `customer-tier ${tierClass}`;
      tierElement.textContent = tierText;
    }
  } catch (error) {
    console.error("Error viewing customer detail:", error);
    customerDetailContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--danger-color); margin-bottom: 16px;"></i>
                <h3>Không thể tải thông tin khách hàng</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="closeCustomerModalFunc()">
                    <i class="fas fa-times"></i>
                    Đóng
                </button>
            </div>
        `;
  }
}

// ========== CREATE/UPDATE CUSTOMER FUNCTIONS (CẬP NHẬT) ==========
async function saveCustomer() {
  // Lấy dữ liệu từ form
  const formData = {
    full_name: document.getElementById("customerName").value.trim(),
    email: document.getElementById("customerEmail").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    date_of_birth: document.getElementById("customerBirthday").value || null,
    gender: document.getElementById("customerGender").value || null,
    address: document.getElementById("customerAddress").value.trim(),
    membership: document.getElementById("customerTier").value || "Đồng",
    description: document.getElementById("customerNotes").value.trim(),
    points: 0, // Mặc định
  };

  // Validate dữ liệu
  if (!formData.full_name || !formData.email || !formData.phone) {
    showToast("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
    return;
  }

  // Loại bỏ các trường rỗng
  Object.keys(formData).forEach((key) => {
    if (formData[key] === "" || formData[key] === null || formData[key] === undefined) {
      delete formData[key];
    }
  });

  console.log("Form data to save:", formData);

  try {
    // Hiệu ứng loading
    saveCustomerBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    saveCustomerBtn.disabled = true;

    let result;
    if (isEditingCustomer && currentCustomerDetail) {
      // Cập nhật khách hàng
      result = await updateCustomer(currentCustomerDetail.id, formData);
      showToast("Thành công", "Đã cập nhật khách hàng thành công", "success");
    } else {
      // Tạo khách hàng mới
      result = await createCustomer(formData);
      showToast("Thành công", "Đã thêm khách hàng mới thành công", "success");
    }

    // Đóng modal và làm mới dữ liệu
    closeFormModalFunc();
    await renderCustomersTable();
    await updateStatsFromAPI();
  } catch (error) {
    console.error("Error saving customer:", error);
    showToast("Lỗi", error.message || "Không thể lưu khách hàng", "error");
  } finally {
    // Reset nút
    saveCustomerBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Khách Hàng';
    saveCustomerBtn.disabled = false;
  }
}

async function editCustomer(customerId) {
  try {
    const customer = await getCustomerById(customerId);
    openCustomerForm(true, customer);
  } catch (error) {
    console.error("Error editing customer:", error);
    showToast(
      "Lỗi",
      "Không thể tải thông tin khách hàng để chỉnh sửa",
      "error"
    );
  }
}

async function deactivateCustomer(customerId) {
  try {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      showToast("Đang xử lý", "Đang xóa khách hàng...", "warning");

      await deleteCustomer(customerId);

      // Cập nhật UI
      await renderCustomersTable();
      await updateStatsFromAPI();

      showToast("Thành công", "Đã xóa khách hàng thành công", "success");
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    showToast("Lỗi", error.message || "Không thể xóa khách hàng", "error");
  }
}

// ========== TOAST NOTIFICATION (GIỮ NGUYÊN) ==========
function showToast(title, message, type = "success") {
  toastTitle.textContent = title;
  toastMessage.textContent = message;

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

  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

// ========== HỖ TRỢ THÊM ==========
function calculateAge(dateString) {
  if (!dateString) return 0;
  const today = new Date();
  const birthDate = new Date(dateString);
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

function openCustomerForm(isEdit = false, customer = null) {
  const modalTitle = document.getElementById("modalTitle");
  const form = document.getElementById("customerForm");

  if (isEdit && customer) {
    modalTitle.textContent = "Chỉnh Sửa Khách Hàng";
    isEditingCustomer = true;
    currentCustomerDetail = customer;

    // Điền dữ liệu vào form
    document.getElementById("customerName").value = customer.full_name || "";
    document.getElementById("customerEmail").value = customer.email || "";
    document.getElementById("customerPhone").value = customer.phone || "";
    document.getElementById("customerBirthday").value = customer.date_of_birth
      ? customer.date_of_birth.split("T")[0]
      : "";
    document.getElementById("customerGender").value = customer.gender || "";
    document.getElementById("customerTier").value = customer.membership || "";
    document.getElementById("customerAddress").value = customer.address || "";
    document.getElementById("customerNotes").value =
      customer.description || "";
  } else {
    modalTitle.textContent = "Thêm Khách Hàng Mới";
    isEditingCustomer = false;
    currentCustomerDetail = null;
    form.reset();
  }

  customerFormModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCustomerModalFunc() {
  customerDetailModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function closeFormModalFunc() {
  customerFormModal.classList.remove("active");
  document.body.style.overflow = "auto";
  document.getElementById("customerForm").reset();
  isEditingCustomer = false;
  currentCustomerDetail = null;
}

function sendMessageToCustomer(customerId) {
  showToast(
    "Thông báo",
    "Chức năng gửi tin nhắn đang được phát triển",
    "warning"
  );
}

// ========== KHỞI TẠO APP ==========
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Lấy tất cả các element cần thiết
    customersTableBody = document.getElementById("customersTableBody");
    customerDetailModal = document.getElementById("customerDetailModal");
    customerDetailContent = document.getElementById("customerDetailContent");
    customerFormModal = document.getElementById("customerFormModal");
    saveCustomerBtn = document.getElementById("saveCustomerBtn");
    toast = document.getElementById("toast");
    toastIcon = document.getElementById("toastIcon");
    toastTitle = document.getElementById("toastTitle");
    toastMessage = document.getElementById("toastMessage");

    // Load dữ liệu ban đầu
    await Promise.all([renderCustomersTable(), updateStatsFromAPI()]);

    // Thêm hiệu ứng load
    document.querySelectorAll(".stat-card").forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";

      setTimeout(() => {
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });

    // Setup event listeners cho modal
    document
      .getElementById("closeCustomerModal")
      ?.addEventListener("click", closeCustomerModalFunc);
    document
      .getElementById("closeFormModal")
      ?.addEventListener("click", closeFormModalFunc);
    document
      .getElementById("cancelFormBtn")
      ?.addEventListener("click", closeFormModalFunc);

    // Đóng modal khi click vào overlay
    customerDetailModal?.addEventListener("click", (e) => {
      if (e.target === customerDetailModal) closeCustomerModalFunc();
    });

    customerFormModal?.addEventListener("click", (e) => {
      if (e.target === customerFormModal) closeFormModalFunc();
    });

    // Event listener cho nút thêm khách hàng
    document
      .getElementById("addCustomerBtn")
      ?.addEventListener("click", () => openCustomerForm(false));

    // Event listener cho nút lưu
    document
      .getElementById("saveCustomerBtn")
      ?.addEventListener("click", saveCustomer);

    // Event listener cho filter
    document
      .getElementById("applyFilters")
      ?.addEventListener("click", applyCustomerFilters);
    document
      .getElementById("clearFilters")
      ?.addEventListener("click", clearAllFilters);
    document
      .getElementById("resetFilters")
      ?.addEventListener("click", clearAllFilters);

    // Event listener cho rows per page
    document
      .getElementById("rowsPerPage")
      ?.addEventListener("change", (e) => {
        rowsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderCustomersTable();
      });

    // Event listener cho stat cards (filter by stats)
    document.querySelectorAll(".stat-card").forEach((card) => {
      card.addEventListener("click", () => {
        const filter = card.dataset.filter;
        if (filter) {
          // Cập nhật giao diện
          document.querySelectorAll(".stat-card").forEach((c) => {
            c.classList.remove("active");
          });
          card.classList.add("active");

          // Áp dụng filter
          if (filter === "all") {
            clearAllFilters();
          } else if (filter === "vip") {
            document.getElementById("tierFilter").value = "VIP";
            applyCustomerFilters();
          } else if (filter === "active") {
            document.getElementById("statusFilter").value = "active";
            applyCustomerFilters();
          } else if (filter === "inactive") {
            document.getElementById("statusFilter").value = "inactive";
            applyCustomerFilters();
          }
        }
      });
    });

    // Event listener cho nút edit từ modal detail
    document
      .getElementById("editCustomerBtn")
      ?.addEventListener("click", () => {
        if (currentCustomerDetail) {
          closeCustomerModalFunc();
          openCustomerForm(true, currentCustomerDetail);
        }
      });

    // Event listener cho nút deactivate từ modal detail
    document
      .getElementById("deactivateCustomerBtn")
      ?.addEventListener("click", () => {
        if (currentCustomerDetail) {
          closeCustomerModalFunc();
          deactivateCustomer(currentCustomerDetail.id);
        }
      });

    // Event listener cho nút send message từ modal detail
    document
      .getElementById("sendMessageBtn")
      ?.addEventListener("click", () => {
        if (currentCustomerDetail) {
          closeCustomerModalFunc();
          sendMessageToCustomer(currentCustomerDetail.id);
        }
      });

    // Event listener cho select all checkbox
    document
      .getElementById("selectAll")
      ?.addEventListener("change", (e) => {
        const checkboxes = document.querySelectorAll(".customer-checkbox");
        checkboxes.forEach((checkbox) => {
          checkbox.checked = e.target.checked;
        });
      });

    // Thêm các event listeners cho các nút điều khiển phân trang
    document
      .getElementById("firstPage")
      ?.addEventListener("click", () => goToPage(1));
    document
      .getElementById("prevPage")
      ?.addEventListener("click", () => goToPage(currentPage - 1));
    document
      .getElementById("nextPage")
      ?.addEventListener("click", () => goToPage(currentPage + 1));
    document
      .getElementById("lastPage")
      ?.addEventListener("click", () => goToPage(lastPage));

    // Tìm kiếm theo Enter
    document
      .querySelector(".search-box input")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          currentPage = 1;
          renderCustomersTable();
        }
      });

    // Làm mới bảng
    document
      .getElementById("refreshTable")
      ?.addEventListener("click", async () => {
        await renderCustomersTable();
        await updateStatsFromAPI();
        showToast("Thành công", "Đã làm mới dữ liệu", "success");
      });

    // Xuất Excel (giả lập)
    document.getElementById("exportBtn")?.addEventListener("click", () => {
      showToast(
        "Thông báo",
        "Chức năng xuất Excel đang được phát triển",
        "warning"
      );
    });

    // Gửi thông báo hàng loạt (giả lập)
    document.getElementById("sendBulkMsgBtn")?.addEventListener("click", () => {
      showToast(
        "Thông báo",
        "Chức năng gửi thông báo hàng loạt đang được phát triển",
        "warning"
      );
    });
  } catch (error) {
    console.error("Error initializing app:", error);
    showToast("Lỗi", "Không thể tải dữ liệu ban đầu", "error");
  }
});

// ========== EVENT LISTENERS (CẬP NHẬT) ==========
// Tất cả event listeners đã được setup trong DOMContentLoaded
