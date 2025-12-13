// ========== DỮ LIỆU MẪU ==========
const sampleOrders = [
    {
        id: "HD20241015-001",
        customer: {
            name: "Nguyễn Văn A",
            phone: "0901234567",
            email: "nguyenvana@email.com",
            address: "123 Đường ABC, Quận 1, TP.HCM"
        },
        products: [
            {
                id: 1,
                name: "iPhone 15 Pro 128GB",
                image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
                price: 25490000,
                quantity: 1,
                total: 25490000
            },
            {
                id: 5,
                name: "AirPods Pro 2",
                image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
                price: 6490000,
                quantity: 1,
                total: 6490000
            }
        ],
        date: "2024-10-15",
        subtotal: 31980000,
        shipping: 30000,
        discount: 500000,
        total: 31480000,
        paymentMethod: "cod",
        paymentStatus: "paid",
        status: "pending",
        notes: "Giao hàng trong giờ hành chính",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-15 09:30",
                note: "Khách hàng đã đặt hàng thành công"
            }
        ]
    },
    {
        id: "HD20241014-045",
        customer: {
            name: "Trần Thị B",
            phone: "0912345678",
            email: "tranthib@email.com",
            address: "456 Đường XYZ, Quận 3, TP.HCM"
        },
        products: [
            {
                id: 2,
                name: "Samsung Galaxy S23 Ultra",
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
                price: 28990000,
                quantity: 1,
                total: 28990000
            }
        ],
        date: "2024-10-14",
        subtotal: 28990000,
        shipping: 30000,
        discount: 0,
        total: 29020000,
        paymentMethod: "bank",
        paymentStatus: "paid",
        status: "processing",
        notes: "Đã xác nhận thanh toán",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-14 14:20",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-14 15:45",
                note: "Đã xác nhận thanh toán và đang chuẩn bị hàng"
            }
        ]
    },
    {
        id: "HD20241014-032",
        customer: {
            name: "Lê Văn C",
            phone: "0923456789",
            email: "levanc@email.com",
            address: "789 Đường DEF, Quận 5, TP.HCM"
        },
        products: [
            {
                id: 3,
                name: "Xiaomi 13 Pro",
                image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
                price: 18990000,
                quantity: 1,
                total: 18990000
            },
            {
                id: 8,
                name: "Xiaomi Smart Band 8",
                image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&h=400&fit=crop",
                price: 1290000,
                quantity: 2,
                total: 2580000
            }
        ],
        date: "2024-10-14",
        subtotal: 21570000,
        shipping: 0,
        discount: 1000000,
        total: 20570000,
        paymentMethod: "momo",
        paymentStatus: "paid",
        status: "shipping",
        notes: "Miễn phí vận chuyển",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-14 11:15",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-14 12:30",
                note: "Đã xác nhận thanh toán"
            },
            {
                status: "shipping",
                title: "Đang giao hàng",
                date: "2024-10-14 16:45",
                note: "Đã bàn giao cho đơn vị vận chuyển"
            }
        ]
    },
    {
        id: "HD20241013-089",
        customer: {
            name: "Phạm Thị D",
            phone: "0934567890",
            email: "phamthid@email.com",
            address: "321 Đường GHI, Quận 7, TP.HCM"
        },
        products: [
            {
                id: 4,
                name: "Apple Watch Series 9",
                image: "https://images.unsplash.com/photo-1434493650001-5d43a6fea0a2?w=400&h=400&fit=crop",
                price: 11990000,
                quantity: 1,
                total: 11990000
            },
            {
                id: 10,
                name: "Samsung Galaxy Buds2 Pro",
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
                price: 3990000,
                quantity: 1,
                total: 3990000
            }
        ],
        date: "2024-10-13",
        subtotal: 15980000,
        shipping: 30000,
        discount: 0,
        total: 16010000,
        paymentMethod: "card",
        paymentStatus: "paid",
        status: "completed",
        notes: "Khách hàng hài lòng với sản phẩm",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-13 10:00",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-13 11:30",
                note: "Đã xác nhận thanh toán"
            },
            {
                status: "shipping",
                title: "Đang giao hàng",
                date: "2024-10-13 14:15",
                note: "Đã bàn giao cho đơn vị vận chuyển"
            },
            {
                status: "completed",
                title: "Giao hàng thành công",
                date: "2024-10-13 16:45",
                note: "Khách hàng đã nhận hàng"
            }
        ]
    },
    {
        id: "HD20241012-076",
        customer: {
            name: "Hoàng Văn E",
            phone: "0945678901",
            email: "hoangvane@email.com",
            address: "654 Đường JKL, Quận 10, TP.HCM"
        },
        products: [
            {
                id: 5,
                name: "Samsung Galaxy Tab S9",
                image: "https://images.unsplash.com/photo-1546054450-4699c0fa43ea?w=400&h=400&fit=crop",
                price: 21990000,
                quantity: 1,
                total: 21990000
            }
        ],
        date: "2024-10-12",
        subtotal: 21990000,
        shipping: 30000,
        discount: 2000000,
        total: 20020000,
        paymentMethod: "bank",
        paymentStatus: "paid",
        status: "completed",
        notes: "Khuyến mãi tháng 10",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-12 13:20",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-12 14:45",
                note: "Đã xác nhận thanh toán"
            },
            {
                status: "shipping",
                title: "Đang giao hàng",
                date: "2024-10-12 16:30",
                note: "Đã bàn giao cho đơn vị vận chuyển"
            },
            {
                status: "completed",
                title: "Giao hàng thành công",
                date: "2024-10-13 10:15",
                note: "Khách hàng đã nhận hàng"
            }
        ]
    },
    {
        id: "HD20241011-054",
        customer: {
            name: "Vũ Thị F",
            phone: "0956789012",
            email: "vuthif@email.com",
            address: "987 Đường MNO, Quận Bình Thạnh, TP.HCM"
        },
        products: [
            {
                id: 6,
                name: "Oppo Find X6 Pro",
                image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
                price: 22990000,
                quantity: 1,
                total: 22990000
            }
        ],
        date: "2024-10-11",
        subtotal: 22990000,
        shipping: 30000,
        discount: 0,
        total: 23020000,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "cancelled",
        notes: "Khách hàng hủy đơn do thay đổi ý định",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-11 09:45",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "cancelled",
                title: "Đơn hàng đã hủy",
                date: "2024-10-11 14:20",
                note: "Khách hàng yêu cầu hủy đơn hàng"
            }
        ]
    },
    {
        id: "HD20241010-042",
        customer: {
            name: "Đặng Văn G",
            phone: "0967890123",
            email: "dangvang@email.com",
            address: "147 Đường PQR, Quận Tân Bình, TP.HCM"
        },
        products: [
            {
                id: 7,
                name: "Vivo X90 Pro",
                image: "https://images.unsplash.com/photo-1598327105854-c8674faddf74?w=400&h=400&fit=crop",
                price: 19990000,
                quantity: 1,
                total: 19990000
            },
            {
                id: 11,
                name: "iPad Pro 12.9 M2",
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
                price: 38990000,
                quantity: 1,
                total: 38990000
            }
        ],
        date: "2024-10-10",
        subtotal: 58980000,
        shipping: 0,
        discount: 3000000,
        total: 55980000,
        paymentMethod: "bank",
        paymentStatus: "paid",
        status: "shipping",
        notes: "Miễn phí vận chuyển cho đơn hàng lớn",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-10 16:30",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-11 09:15",
                note: "Đã xác nhận thanh toán"
            },
            {
                status: "shipping",
                title: "Đang giao hàng",
                date: "2024-10-11 14:45",
                note: "Đã bàn giao cho đơn vị vận chuyển"
            }
        ]
    },
    {
        id: "HD20241009-031",
        customer: {
            name: "Bùi Thị H",
            phone: "0978901234",
            email: "buithih@email.com",
            address: "258 Đường STU, Quận Phú Nhuận, TP.HCM"
        },
        products: [
            {
                id: 8,
                name: "Realme GT 5",
                image: "https://images.unsplash.com/photo-1596558450265-85d6bcc0db8c?w=400&h=400&fit=crop",
                price: 16990000,
                quantity: 1,
                total: 16990000
            }
        ],
        date: "2024-10-09",
        subtotal: 16990000,
        shipping: 30000,
        discount: 1000000,
        total: 16020000,
        paymentMethod: "momo",
        paymentStatus: "paid",
        status: "completed",
        notes: "",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-09 11:20",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-09 13:45",
                note: "Đã xác nhận thanh toán"
            },
            {
                status: "shipping",
                title: "Đang giao hàng",
                date: "2024-10-09 16:30",
                note: "Đã bàn giao cho đơn vị vận chuyển"
            },
            {
                status: "completed",
                title: "Giao hàng thành công",
                date: "2024-10-10 10:15",
                note: "Khách hàng đã nhận hàng"
            }
        ]
    },
    {
        id: "HD20241008-025",
        customer: {
            name: "Ngô Văn I",
            phone: "0989012345",
            email: "ngovani@email.com",
            address: "369 Đường VWX, Quận Gò Vấp, TP.HCM"
        },
        products: [
            {
                id: 9,
                name: "iPhone 14 Pro 256GB",
                image: "https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?w=400&h=400&fit=crop",
                price: 24990000,
                quantity: 2,
                total: 49980000
            }
        ],
        date: "2024-10-08",
        subtotal: 49980000,
        shipping: 0,
        discount: 5000000,
        total: 44980000,
        paymentMethod: "card",
        paymentStatus: "paid",
        status: "pending",
        notes: "Mua số lượng lớn cho công ty",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-08 15:45",
                note: "Khách hàng đã đặt hàng thành công"
            }
        ]
    },
    {
        id: "HD20241007-019",
        customer: {
            name: "Trịnh Văn K",
            phone: "0990123456",
            email: "trinhvank@email.com",
            address: "753 Đường YZ, Quận Thủ Đức, TP.HCM"
        },
        products: [
            {
                id: 10,
                name: "Samsung Galaxy Z Flip5",
                image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
                price: 25990000,
                quantity: 1,
                total: 25990000
            }
        ],
        date: "2024-10-07",
        subtotal: 25990000,
        shipping: 30000,
        discount: 2000000,
        total: 24020000,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "processing",
        notes: "Khách hàng muốn kiểm tra hàng trước khi thanh toán",
        timeline: [
            {
                status: "pending",
                title: "Đơn hàng được tạo",
                date: "2024-10-07 10:30",
                note: "Khách hàng đã đặt hàng thành công"
            },
            {
                status: "processing",
                title: "Đã xác nhận",
                date: "2024-10-07 14:15",
                note: "Đã liên hệ xác nhận với khách hàng"
            }
        ]
    }
];

// ========== KHỞI TẠO BIẾN ==========
let currentPage = 1;
let rowsPerPage = 10;
let filteredOrders = [...sampleOrders];
let currentFilter = "all";
let currentOrderDetail = null;

// DOM Elements
const toggleSidebar = document.getElementById('toggleSidebar');
const createOrderBtn = document.getElementById('createOrderBtn');
const orderDetailModal = document.getElementById('orderDetailModal');
const updateStatusModal = document.getElementById('updateStatusModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const closeStatusModal = document.getElementById('closeStatusModal');
const cancelStatusBtn = document.getElementById('cancelStatusBtn');
const saveStatusBtn = document.getElementById('saveStatusBtn');
const ordersTableBody = document.getElementById('ordersTableBody');
const selectAll = document.getElementById('selectAll');
const statusFilter = document.getElementById('statusFilter');
const paymentFilter = document.getElementById('paymentFilter');
const amountFilter = document.getElementById('amountFilter');
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const applyFilters = document.getElementById('applyFilters');
const clearFilters = document.getElementById('clearFilters');
const resetFilters = document.getElementById('resetFilters');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const refreshTable = document.getElementById('refreshTable');
const exportBtn = document.getElementById('exportBtn');
const searchInput = document.querySelector('.search-box input');
const orderDetailContent = document.getElementById('orderDetailContent');
const currentStatusDisplay = document.getElementById('currentStatusDisplay');
const newStatusSelect = document.getElementById('newStatusSelect');
const printInvoiceBtn = document.getElementById('printInvoiceBtn');
const updateStatusBtn = document.getElementById('updateStatusBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const closeToast = document.getElementById('closeToast');
const statCards = document.querySelectorAll('.stat-card');
const tabButtons = document.querySelectorAll('.tab-btn');

// ========== SIDEBAR TOGGLE ==========
toggleSidebar.addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    const icon = this.querySelector('i');
    icon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        icon.style.transform = '';
    }, 300);
});

// ========== MENU ACTIVE STATE ==========
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// ========== RENDER BẢNG ĐƠN HÀNG ==========
function renderOrdersTable() {
    ordersTableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const ordersToShow = filteredOrders.slice(start, end);

    if (ordersToShow.length === 0) {
        ordersTableBody.innerHTML = `
                    <tr>
                        <td colspan="8">
                            <div class="empty-state">
                                <i class="fas fa-shopping-cart"></i>
                                <h3>Không tìm thấy đơn hàng</h3>
                                <p>Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
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

    ordersToShow.forEach(order => {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const paymentClass = getPaymentClass(order.paymentMethod);
        const paymentText = getPaymentText(order.paymentMethod);

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <input type="checkbox" class="order-checkbox" data-id="${order.id}">
                    </td>
                    <td>
                        <div class="order-info">
                            <div class="order-id">${order.id}</div>
                            <div class="order-date">${formatDate(order.date)}</div>
                        </div>
                    </td>
                    <td>
                        <div class="customer-info">
                            <div class="customer-name">${order.customer.name}</div>
                            <div class="customer-phone">${order.customer.phone}</div>
                        </div>
                    </td>
                    <td>
                        <div class="products-count">
                            <div class="products-badge">${order.products.length}</div>
                            <span>sản phẩm</span>
                        </div>
                    </td>
                    <td class="order-amount">${formatPrice(order.total)}₫</td>
                    <td>
                        <span class="payment-method ${paymentClass}">${paymentText}</span>
                    </td>
                    <td>
                        <span class="order-status ${statusClass}">
                            ${statusText}
                        </span>
                    </td>
                    <td>
                        <div class="order-actions">
                            <button class="action-btn view" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="updateOrderStatus('${order.id}')" title="Cập nhật trạng thái">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn print" onclick="printInvoice('${order.id}')" title="In hóa đơn">
                                <i class="fas fa-print"></i>
                            </button>
                            <button class="action-btn cancel" onclick="cancelOrder('${order.id}')" title="Hủy đơn hàng">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </td>
                `;
        ordersTableBody.appendChild(row);
    });

    updateTableInfo();
    updatePagination();
}

// ========== HÀM HỖ TRỢ ==========
function getStatusClass(status) {
    const classes = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipping': 'status-shipping',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipping': 'Đang giao hàng',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return texts[status] || status;
}

function getPaymentClass(paymentMethod) {
    const classes = {
        'cod': 'payment-cod',
        'bank': 'payment-bank',
        'card': 'payment-card',
        'momo': 'payment-momo'
    };
    return classes[paymentMethod] || 'payment-cod';
}

function getPaymentText(paymentMethod) {
    const texts = {
        'cod': 'COD',
        'bank': 'Chuyển khoản',
        'card': 'Thẻ',
        'momo': 'MoMo'
    };
    return texts[paymentMethod] || paymentMethod;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN');
}

function updateTableInfo() {
    const total = filteredOrders.length;
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, total);
    const infoElement = document.querySelector('.table-info');
    if (infoElement) {
        infoElement.innerHTML = `Hiển thị <strong>${start}-${end}</strong> trong tổng số <strong>${total}</strong> đơn hàng`;
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    const numberButtons = paginationContainer.querySelectorAll('.pagination-btn:not(#firstPage):not(#prevPage):not(#nextPage):not(#lastPage)');

    // Cập nhật số trang
    numberButtons.forEach((btn, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
            btn.textContent = pageNum;
            btn.style.display = 'flex';
            btn.classList.toggle('active', pageNum === currentPage);
        } else {
            btn.style.display = 'none';
        }
    });

    // Cập nhật trạng thái nút điều hướng
    document.getElementById('firstPage').disabled = currentPage === 1;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('lastPage').disabled = currentPage === totalPages;
}

// ========== FILTER FUNCTIONS ==========
function applyOrderFilters() {
    filteredOrders = sampleOrders.filter(order => {
        // Lọc theo trạng thái
        if (currentFilter !== 'all' && order.status !== currentFilter) {
            return false;
        }

        // Lọc theo trạng thái từ bộ lọc
        if (statusFilter.value && order.status !== statusFilter.value) {
            return false;
        }

        // Lọc theo phương thức thanh toán
        if (paymentFilter.value && order.paymentMethod !== paymentFilter.value) {
            return false;
        }

        // Lọc theo khoảng giá
        if (amountFilter.value) {
            const total = order.total;
            switch (amountFilter.value) {
                case 'low':
                    if (total >= 5000000) return false;
                    break;
                case 'medium':
                    if (total < 5000000 || total > 15000000) return false;
                    break;
                case 'high':
                    if (total < 15000000 || total > 30000000) return false;
                    break;
                case 'premium':
                    if (total < 30000000) return false;
                    break;
            }
        }

        // Lọc theo khoảng thời gian
        if (dateFrom.value && dateTo.value) {
            const orderDate = new Date(order.date);
            const fromDate = new Date(dateFrom.value);
            const toDate = new Date(dateTo.value);

            if (orderDate < fromDate || orderDate > toDate) {
                return false;
            }
        }

        return true;
    });

    currentPage = 1;
    renderOrdersTable();
    updateStatsCards();
}

function clearAllFilters() {
    statusFilter.value = '';
    paymentFilter.value = '';
    amountFilter.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    searchInput.value = '';
    currentFilter = 'all';

    // Reset tabs
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === 'all') {
            btn.classList.add('active');
        }
    });

    // Reset stat cards
    statCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.filter === 'all') {
            card.classList.add('active');
        }
    });

    filteredOrders = [...sampleOrders];
    currentPage = 1;
    renderOrdersTable();
    updateStatsCards();
    showToast('Thành công', 'Đã xóa tất cả bộ lọc', 'success');
}

function updateStatsCards() {
    const stats = {
        'all': filteredOrders.length,
        'pending': filteredOrders.filter(o => o.status === 'pending').length,
        'processing': filteredOrders.filter(o => o.status === 'processing' || o.status === 'shipping').length,
        'completed': filteredOrders.filter(o => o.status === 'completed').length,
        'cancelled': filteredOrders.filter(o => o.status === 'cancelled').length
    };

    // Cập nhật số liệu trên stat cards
    statCards.forEach(card => {
        const filter = card.dataset.filter;
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
            numberElement.textContent = stats[filter] || 0;
        }
    });

    // Cập nhật số liệu trên tabs
    tabButtons.forEach(tab => {
        const status = tab.dataset.status;
        const badge = tab.querySelector('.tab-badge');
        if (badge) {
            badge.textContent = stats[status] || 0;
        }
    });
}

// ========== ORDER DETAIL FUNCTIONS ==========
function viewOrderDetail(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) return;

    currentOrderDetail = order;

    // Render chi tiết đơn hàng
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    const paymentClass = getPaymentClass(order.paymentMethod);
    const paymentText = getPaymentText(order.paymentMethod);

    let productsHtml = '';
    order.products.forEach(product => {
        productsHtml += `
                    <div class="order-product">
                        <div class="product-image-small">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-name-small">${product.name}</div>
                        <div class="product-price">${formatPrice(product.price)}₫</div>
                        <div class="product-quantity">${product.quantity}</div>
                        <div class="product-total">${formatPrice(product.total)}₫</div>
                    </div>
                `;
    });

    let timelineHtml = '';
    order.timeline.forEach((item, index) => {
        const itemStatusClass = getStatusClass(item.status);
        const itemStatusText = getStatusText(item.status);
        timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-icon ${index === order.timeline.length - 1 ? 'active' : ''}">
                            <i class="fas fa-${getTimelineIcon(item.status)}"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-title">${item.title}</div>
                            <div class="timeline-date">${formatDateTime(item.date)}</div>
                            ${item.note ? `<div style="font-size: 13px; color: var(--gray-600); margin-top: 4px;">${item.note}</div>` : ''}
                        </div>
                    </div>
                `;
    });

    orderDetailContent.innerHTML = `
                <div>
                    <div class="order-section">
                        <h3 class="section-title">
                            <i class="fas fa-info-circle"></i>
                            Thông Tin Đơn Hàng
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Mã đơn hàng:</div>
                                    <div style="font-weight: 700; color: var(--primary-color);">${order.id}</div>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Ngày đặt:</div>
                                    <div>${formatDate(order.date)}</div>
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Ghi chú:</div>
                                    <div>${order.notes || 'Không có ghi chú'}</div>
                                </div>
                            </div>
                            <div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Trạng thái:</div>
                                    <span class="order-status ${statusClass}">${statusText}</span>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Thanh toán:</div>
                                    <span class="payment-method ${paymentClass}">${paymentText}</span>
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Trạng thái thanh toán:</div>
                                    <span style="color: ${order.paymentStatus === 'paid' ? 'var(--success-color)' : 'var(--warning-color)'}; font-weight: 600;">
                                        ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-section">
                        <h3 class="section-title">
                            <i class="fas fa-user"></i>
                            Thông Tin Khách Hàng
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Họ tên:</div>
                                    <div>${order.customer.name}</div>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Email:</div>
                                    <div>${order.customer.email}</div>
                                </div>
                            </div>
                            <div>
                                <div style="margin-bottom: 12px;">
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Số điện thoại:</div>
                                    <div>${order.customer.phone}</div>
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--gray-700); margin-bottom: 4px;">Địa chỉ giao hàng:</div>
                                    <div>${order.customer.address}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-section">
                        <h3 class="section-title">
                            <i class="fas fa-box"></i>
                            Sản Phẩm
                        </h3>
                        <div class="order-products">
                            ${productsHtml}
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="order-section">
                        <h3 class="section-title">
                            <i class="fas fa-receipt"></i>
                            Tổng Kết
                        </h3>
                        <div class="order-summary">
                            <div class="summary-row">
                                <span class="summary-label">Tạm tính:</span>
                                <span class="summary-value">${formatPrice(order.subtotal)}₫</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Phí vận chuyển:</span>
                                <span class="summary-value">${formatPrice(order.shipping)}₫</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Giảm giá:</span>
                                <span class="summary-value" style="color: var(--success-color);">-${formatPrice(order.discount)}₫</span>
                            </div>
                            <div class="summary-row total">
                                <span class="summary-label">Tổng cộng:</span>
                                <span class="summary-value">${formatPrice(order.total)}₫</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-section">
                        <h3 class="section-title">
                            <i class="fas fa-history"></i>
                            Lịch Sử Đơn Hàng
                        </h3>
                        <div class="status-timeline">
                            ${timelineHtml}
                        </div>
                    </div>
                </div>
            `;

    // Cập nhật trạng thái hiện tại
    document.querySelector('#currentOrderStatus .order-status').className = `order-status ${statusClass}`;
    document.querySelector('#currentOrderStatus .order-status').textContent = statusText;

    orderDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function getTimelineIcon(status) {
    const icons = {
        'pending': 'clock',
        'processing': 'cog',
        'shipping': 'truck',
        'completed': 'check-circle',
        'cancelled': 'times-circle'
    };
    return icons[status] || 'clock';
}

function closeOrderModalFunc() {
    orderDetailModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentOrderDetail = null;
}

function closeStatusModalFunc() {
    updateStatusModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateOrderStatus(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) return;

    currentOrderDetail = order;

    // Hiển thị trạng thái hiện tại
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    currentStatusDisplay.className = `order-status ${statusClass}`;
    currentStatusDisplay.textContent = statusText;

    // Đặt giá trị cho select
    newStatusSelect.value = order.status;

    updateStatusModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function saveNewStatus() {
    if (!currentOrderDetail) return;

    const newStatus = newStatusSelect.value;
    const note = document.getElementById('statusNote').value;

    if (newStatus === currentOrderDetail.status) {
        showToast('Thông báo', 'Trạng thái không thay đổi', 'warning');
        return;
    }

    // Hiệu ứng loading
    saveStatusBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang cập nhật...';
    saveStatusBtn.disabled = true;

    // Giả lập cập nhật
    setTimeout(() => {
        // Cập nhật trạng thái
        const orderIndex = sampleOrders.findIndex(o => o.id === currentOrderDetail.id);
        if (orderIndex !== -1) {
            sampleOrders[orderIndex].status = newStatus;
            sampleOrders[orderIndex].timeline.push({
                status: newStatus,
                title: getStatusText(newStatus),
                date: new Date().toLocaleString('vi-VN'),
                note: note || `Đã cập nhật trạng thái từ ${getStatusText(currentOrderDetail.status)} sang ${getStatusText(newStatus)}`
            });
        }

        // Cập nhật UI
        applyOrderFilters();
        closeStatusModalFunc();

        // Hiển thị thông báo
        showToast(
            'Thành công',
            `Đã cập nhật trạng thái đơn hàng ${currentOrderDetail.id} thành ${getStatusText(newStatus)}`,
            'success'
        );

        // Reset nút
        saveStatusBtn.innerHTML = '<i class="fas fa-save"></i> Cập Nhật Trạng Thái';
        saveStatusBtn.disabled = false;

        // Clear note
        document.getElementById('statusNote').value = '';

    }, 1500);
}

function printInvoice(orderId) {
    showToast('In hóa đơn', `Đang tạo hóa đơn cho đơn hàng ${orderId}...`, 'success');
}

function cancelOrder(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) return;

    if (order.status === 'cancelled') {
        showToast('Thông báo', 'Đơn hàng đã bị hủy trước đó', 'warning');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}?`)) {
        // Hiệu ứng loading
        showToast('Đang xử lý', `Đang hủy đơn hàng ${orderId}...`, 'warning');

        // Giả lập hủy đơn
        setTimeout(() => {
            const orderIndex = sampleOrders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                sampleOrders[orderIndex].status = 'cancelled';
                sampleOrders[orderIndex].timeline.push({
                    status: 'cancelled',
                    title: 'Đơn hàng đã hủy',
                    date: new Date().toLocaleString('vi-VN'),
                    note: 'Đơn hàng đã được hủy bởi quản trị viên'
                });
            }

            // Cập nhật UI
            applyOrderFilters();

            // Hiển thị thông báo
            showToast('Thành công', `Đã hủy đơn hàng ${orderId}`, 'success');
        }, 1000);
    }
}

// ========== TOAST NOTIFICATION ==========
function showToast(title, message, type = 'success') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Đổi màu và icon theo type
    const icon = toastIcon.querySelector('i');
    switch (type) {
        case 'success':
            toastIcon.className = 'toast-icon success';
            icon.className = 'fas fa-check';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon warning';
            icon.className = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            toastIcon.className = 'toast-icon error';
            icon.className = 'fas fa-times';
            break;
    }

    toast.classList.add('show');

    // Tự động đóng sau 5 giây
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ========== EVENT LISTENERS ==========
// Modal events
createOrderBtn.addEventListener('click', () => {
    showToast('Tạo đơn hàng', 'Chức năng đang được phát triển', 'warning');
});

closeOrderModal.addEventListener('click', closeOrderModalFunc);
closeStatusModal.addEventListener('click', closeStatusModalFunc);
cancelStatusBtn.addEventListener('click', closeStatusModalFunc);
saveStatusBtn.addEventListener('click', saveNewStatus);
printInvoiceBtn.addEventListener('click', () => {
    if (currentOrderDetail) {
        printInvoice(currentOrderDetail.id);
    }
});
updateStatusBtn.addEventListener('click', () => {
    if (currentOrderDetail) {
        updateOrderStatus(currentOrderDetail.id);
    }
});
cancelOrderBtn.addEventListener('click', () => {
    if (currentOrderDetail) {
        cancelOrder(currentOrderDetail.id);
    }
});

// Filter events
applyFilters.addEventListener('click', applyOrderFilters);
clearFilters.addEventListener('click', () => {
    statusFilter.value = '';
    paymentFilter.value = '';
    amountFilter.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    applyOrderFilters();
    showToast('Thành công', 'Đã xóa bộ lọc', 'success');
});

resetFilters.addEventListener('click', clearAllFilters);

// Stat cards events
statCards.forEach(card => {
    card.addEventListener('click', () => {
        const filter = card.dataset.filter;

        // Update active state
        statCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Update tabs
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.status === filter) {
                btn.classList.add('active');
            }
        });

        currentFilter = filter;
        applyOrderFilters();
    });
});

// Tabs events
tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
        const status = tab.dataset.status;

        // Update active state
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        // Update stat cards
        statCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.filter === status) {
                card.classList.add('active');
            }
        });

        currentFilter = status;
        applyOrderFilters();
    });
});

// Search event
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredOrders = sampleOrders.filter(order =>
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.phone.includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderOrdersTable();
        showToast('Tìm kiếm', `Tìm thấy ${filteredOrders.length} đơn hàng phù hợp`, 'success');
    }
});

// Pagination events
rowsPerPageSelect.addEventListener('change', (e) => {
    rowsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderOrdersTable();
});

refreshTable.addEventListener('click', () => {
    filteredOrders = [...sampleOrders];
    currentPage = 1;
    renderOrdersTable();
    showToast('Thành công', 'Đã làm mới danh sách đơn hàng', 'success');
});

exportBtn.addEventListener('click', () => {
    showToast('Xuất file', 'Đang xuất dữ liệu đơn hàng ra file Excel...', 'success');
});

// Select all checkbox
selectAll.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.order-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
});

// Pagination button events
document.getElementById('firstPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage = 1;
        renderOrdersTable();
    }
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderOrdersTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderOrdersTable();
    }
});

document.getElementById('lastPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage = totalPages;
        renderOrdersTable();
    }
});

// Close toast
closeToast.addEventListener('click', () => {
    toast.classList.remove('show');
});

// Đóng modal khi click bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === orderDetailModal) closeOrderModalFunc();
    if (e.target === updateStatusModal) closeStatusModalFunc();
});

// ========== KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    dateFrom.valueAsDate = weekAgo;
    dateTo.valueAsDate = today;

    // Render bảng đơn hàng ban đầu
    renderOrdersTable();

    // Thêm hiệu ứng load cho các stat cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});