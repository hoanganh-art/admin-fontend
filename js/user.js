// ========== USER PROFILE ==========
// Đã được xử lý trong user.js

document.addEventListener('DOMContentLoaded', function () {
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownToggle = document.getElementById('userDropdownToggle');

    // Toggle dropdown khi click vào user profile
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
            userProfile.classList.toggle('active');

            // Đổi icon mũi tên
            if (userDropdown.classList.contains('show')) {
                userDropdownToggle.className = 'fas fa-chevron-up';
            } else {
                userDropdownToggle.className = 'fas fa-chevron-down';
            }
        });

        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', function (e) {
            if (!userProfile.contains(e.target)) {
                userDropdown.classList.remove('show');
                userProfile.classList.remove('active');
                userDropdownToggle.className = 'fas fa-chevron-down';
            }
        });

        // Ngăn dropdown đóng khi click vào bên trong dropdown
        userDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Toast Notification
    const toast = document.getElementById('successToast');
    const closeToast = document.getElementById('closeToast');

    if (closeToast) {
        closeToast.addEventListener('click', function () {
            toast.classList.remove('show');
        });
    }

    // Đóng toast sau 5 giây
    setTimeout(() => {
        if (toast) toast.classList.remove('show');
    }, 5000);
});
// User Profile Dropdown


// Các hàm xử lý cho dropdown items
function openProfile() {
    // Xác định đường dẫn đúng dựa trên vị trí hiện tại
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        // Đang ở trong thư mục pages, redirect đến cùng cấp
        window.location.href = 'Informations.html';
    } else {
        // Đang ở root hoặc thư mục khác, redirect vào pages
        window.location.href = 'pages/Informations.html';
    }
}

function openSettings() {
    showToast('Mở cài đặt', 'Đang chuyển hướng đến trang cài đặt...', 'info');
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        showToast('Đăng xuất thành công', 'Hệ thống đang chuyển hướng...', 'success');

        // Mô phỏng chuyển hướng sau 1 giây
        setTimeout(() => {
            // window.location.href = 'login.html';
            alert('Đã đăng xuất (demo)');
        }, 1000);
    }
}