//Khởi tạo biến để lưu trạng thái sidebar

// ========== KHỞI TẠO BIẾN ==========
const toggleSidebar = document.getElementById('toggleSidebar'); // Nút thu gọn sidebar
const menuItems = document.querySelectorAll('.menu-item'); // Các mục trong sidebar
const addProductBtn = document.getElementById('addProductBtn'); // Nút mở modal thêm sản phẩm
const addProductModal = document.getElementById('addProductModal'); // Modal thêm sản phẩm
const closeProductModal = document.getElementById('closeProductModal'); // Nút đóng modal
const cancelProductBtn = document.getElementById('cancelProductBtn'); // Nút hủy trong modal
const saveProductBtn = document.getElementById('saveProductBtn'); // Nút lưu sản phẩm
const searchInput = document.querySelector('.search-box input'); // Ô tìm kiếm
const notifications = document.querySelector('.notifications'); // Biểu tượng thông báo
const revenueChart = document.getElementById('revenueChart'); // Biểu đồ doanh thu
const userProfile = document.querySelector('.user-profile'); // Phần tử user profile
const successToast = document.getElementById('successToast'); // Toast thông báo thành công
const closeToast = document.getElementById('closeToast'); // Nút đóng toast

// ========== SIDEBAR TOGGLE ==========
toggleSidebar.addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('collapsed');

    // Thêm hiệu ứng cho icon
    const icon = this.querySelector('i');
    icon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        icon.style.transform = '';
    }, 300);
});

// ========== MENU ACTIVE STATE ==========
menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Hiệu ứng ripple
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Thêm keyframe cho ripple
const style = document.createElement('style');
style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

// ========== MODAL XỬ LÝ ==========
// Mở modal thêm sản phẩm
addProductBtn.addEventListener('click', function () {
    addProductModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Đóng modal
function closeModal() {
    addProductModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeProductModal.addEventListener('click', closeModal);
cancelProductBtn.addEventListener('click', closeModal);

// Đóng modal khi click bên ngoài
window.addEventListener('click', function (e) {
    if (e.target === addProductModal) {
        closeModal();
    }
});

// Lưu sản phẩm
saveProductBtn.addEventListener('click', function () {
    const productName = document.getElementById('productName').value;
    const productBrand = document.getElementById('productBrand').value;
    const productCategory = document.getElementById('productCategory').value;
    const productPrice = document.getElementById('productPrice').value;
    const productStock = document.getElementById('productStock').value;
    const productDescription = document.getElementById('productDescription').value;

    // Kiểm tra dữ liệu
    if (!productName || !productBrand || !productCategory || !productPrice || !productStock) {
        showToast('Thông báo', 'Vui lòng điền đầy đủ thông tin sản phẩm!', 'warning');
        return;
    }

    // Hiệu ứng loading
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    this.disabled = true;

    // Giả lập gửi dữ liệu
    setTimeout(() => {
        // Reset form
        document.getElementById('productForm').reset();

        // Đóng modal
        closeModal();

        // Hiển thị thông báo thành công
        showToast('Thành công!', `Đã thêm sản phẩm "${productName}" vào hệ thống.`);

        // Reset nút
        this.innerHTML = '<i class="fas fa-save"></i> Lưu sản phẩm';
        this.disabled = false;

        // Cập nhật badge sản phẩm
        updateProductBadge();

    }, 1500);
});

// ========== QUICK ACTIONS ==========
const quickActions = {
    addOrderBtn: {
        title: 'Tạo đơn hàng mới',
        message: 'Chức năng "Tạo đơn hàng" đang được phát triển!'
    },
    importStockBtn: {
        title: 'Nhập kho',
        message: 'Chức năng "Nhập kho" đang được phát triển!'
    },
    addCustomerBtn: {
        title: 'Thêm khách hàng',
        message: 'Chức năng "Thêm khách hàng" đang được phát triển!'
    },
    generateReportBtn: {
        title: 'Tạo báo cáo',
        message: 'Chức năng "Báo cáo" đang được phát triển!'
    },
    manageUsersBtn: {
        title: 'Quản lý người dùng',
        message: 'Chức năng "Quản lý người dùng" đang được phát triển!'
    }
};

Object.keys(quickActions).forEach(btnId => {
    document.getElementById(btnId).addEventListener('click', function () {
        const action = quickActions[btnId];
        showToast(action.title, action.message);
    });
});

// ========== TÌM KIẾM ==========
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim()) {
        showToast('Tìm kiếm', `Đang tìm kiếm: "${this.value}"`);
        this.value = '';
    }
});

// ========== THÔNG BÁO ==========
notifications.addEventListener('click', function () {
    const notificationCount = document.querySelector('.notification-count');
    notificationCount.textContent = '0';
    notificationCount.style.background = 'var(--gray-400)';

    showToast('Thông báo', 'Bạn có 3 thông báo chưa đọc đã được xem.');
});

// ========== USER PROFILE ==========
userProfile.addEventListener('click', function () {
    showToast('Thông tin người dùng', 'Chức năng xem thông tin chi tiết đang được phát triển!');
});

// ========== BIỂU ĐỒ DOANH THU ==========
function renderRevenueChart() {
    const chartData = [42, 38, 45, 52, 48, 55, 52];
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const maxValue = Math.max(...chartData);

    revenueChart.innerHTML = '';
    revenueChart.style.position = 'relative';
    revenueChart.style.display = 'flex';
    revenueChart.style.alignItems = 'flex-end';
    revenueChart.style.justifyContent = 'space-around';
    revenueChart.style.height = '100%';
    revenueChart.style.padding = '20px 0';
    revenueChart.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f9 100%)';

    // Tạo grid lines
    const grid = document.createElement('div');
    grid.style.position = 'absolute';
    grid.style.top = '0';
    grid.style.left = '0';
    grid.style.width = '100%';
    grid.style.height = '100%';
    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.justifyContent = 'space-between';
    grid.style.pointerEvents = 'none';

    for (let i = 0; i <= 5; i++) {
        const line = document.createElement('div');
        line.style.borderTop = '1px dashed rgba(0,0,0,0.1)';
        line.style.width = '100%';
        grid.appendChild(line);
    }

    revenueChart.appendChild(grid);

    // Tạo bars
    for (let i = 0; i < chartData.length; i++) {
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        barContainer.style.width = '50px';
        barContainer.style.position = 'relative';
        barContainer.style.zIndex = '1';

        const bar = document.createElement('div');
        bar.style.width = '30px';
        bar.style.height = `${(chartData[i] / maxValue) * 100}%`;
        bar.style.minHeight = '20px';
        bar.style.background = i === chartData.length - 1
            ? 'linear-gradient(to top, var(--primary-color), var(--secondary-color))'
            : 'linear-gradient(to top, var(--info-color), #3b82f6)';
        bar.style.borderRadius = '8px 8px 0 0';
        bar.style.transition = 'all 0.3s ease';
        bar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        bar.style.position = 'relative';
        bar.style.overflow = 'hidden';

        // Hiệu ứng hover
        bar.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.05) translateY(-5px)';
            this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';

            // Hiển thị tooltip
            const tooltip = document.createElement('div');
            tooltip.textContent = `${chartData[i]}M VNĐ`;
            tooltip.style.position = 'absolute';
            tooltip.style.top = '-40px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.background = 'var(--dark-color)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '6px 12px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '12px';
            tooltip.style.fontWeight = '600';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            tooltip.style.zIndex = '10';

            const arrow = document.createElement('div');
            arrow.style.position = 'absolute';
            arrow.style.bottom = '-6px';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
            arrow.style.width = '0';
            arrow.style.height = '0';
            arrow.style.borderLeft = '6px solid transparent';
            arrow.style.borderRight = '6px solid transparent';
            arrow.style.borderTop = '6px solid var(--dark-color)';

            tooltip.appendChild(arrow);
            this.appendChild(tooltip);
        });

        bar.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';

            // Xóa tooltip
            const tooltip = this.querySelector('div:last-child');
            if (tooltip) tooltip.remove();
        });

        const label = document.createElement('div');
        label.textContent = days[i];
        label.style.marginTop = '12px';
        label.style.fontSize = '14px';
        label.style.fontWeight = '500';
        label.style.color = 'var(--gray-600)';

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        revenueChart.appendChild(barContainer);
    }

    // Thêm animation cho các bars
    setTimeout(() => {
        const bars = revenueChart.querySelectorAll('div > div:first-child');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scale(1.05) translateY(-5px)';
                setTimeout(() => {
                    bar.style.transform = 'scale(1) translateY(0)';
                }, 300);
            }, index * 100);
        });
    }, 500);
}

// ========== TOAST NOTIFICATION ==========
function showToast(title, message, type = 'success') {
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    // Đổi màu toast theo type
    const toastIcon = successToast.querySelector('.toast-icon');
    if (type === 'warning') {
        toastIcon.style.background = 'linear-gradient(45deg, var(--warning-color), #ff9e00)';
        toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    } else {
        toastIcon.style.background = 'linear-gradient(45deg, var(--success-color), #3b82f6)';
        toastIcon.innerHTML = '<i class="fas fa-check"></i>';
    }

    successToast.classList.add('show');

    // Tự động đóng sau 5 giây
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 5000);
}

closeToast.addEventListener('click', function () {
    successToast.classList.remove('show');
});

// ========== CẬP NHẬT BADGE SẢN PHẨM ==========
function updateProductBadge() {
    const productBadge = document.querySelector('.menu-item:nth-child(2) .menu-badge');
    let currentCount = parseInt(productBadge.textContent) || 0;
    productBadge.textContent = currentCount + 1;

    // Hiệu ứng cho badge
    productBadge.style.transform = 'scale(1.5)';
    setTimeout(() => {
        productBadge.style.transform = 'scale(1)';
    }, 300);
}

// ========== XEM CHI TIẾT ĐƠN HÀNG ==========
document.querySelectorAll('.data-table .btn-primary').forEach(btn => {
    btn.addEventListener('click', function () {
        const row = this.closest('tr');
        const orderId = row.cells[0].textContent;
        const customer = row.cells[1].textContent;
        const amount = row.cells[2].textContent;

        showToast('Chi tiết đơn hàng', `Đang mở đơn hàng ${orderId} của ${customer} - Tổng tiền: ${amount}`);
    });
});

// ========== KHỞI TẠO ==========
document.addEventListener('DOMContentLoaded', function () {
    // Render biểu đồ
    renderRevenueChart();

    // Thêm hiệu ứng khi load trang
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Dark mode toggle (thử nghiệm)
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 24px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--primary-color);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: var(--box-shadow-lg);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: var(--transition);
            `;

    darkModeToggle.addEventListener('click', function () {
        showToast('Thông báo', 'Chế độ tối đang được phát triển!');
    });

    document.body.appendChild(darkModeToggle);
});