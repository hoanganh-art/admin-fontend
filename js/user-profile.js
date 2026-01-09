// user-profile.js - Xử lý hiển thị và dropdown user profile cho tất cả các trang

document.addEventListener('DOMContentLoaded', function() {
    // ========== CẬP NHẬT THÔNG TIN USER ==========
    loadUserInfo();
    
    // ========== XỬ LÝ DROPDOWN ==========
    initUserDropdown();
});

// ========== LOAD THÔNG TIN USER TỪ LOCALSTORAGE ==========
function loadUserInfo() {
    try {
        // Lấy thông tin employee từ localStorage
        const employeeInfo = Auth.getEmployeeInfo();
        
        if (employeeInfo) {
            // Cập nhật tên
            const userNameElement = document.getElementById('userName');
            if (userNameElement && employeeInfo.name) {
                userNameElement.textContent = employeeInfo.name;
            }
            
            // Cập nhật role
            const userRoleElement = document.getElementById('userRole');
            if (userRoleElement) {
                const roleMap = {
                    'admin': 'Quản trị viên',
                    'manager': 'Quản lý',
                    'staff': 'Nhân viên',
                    'employee': 'Nhân viên'
                };
                const roleName = roleMap[employeeInfo.role] || employeeInfo.role || 'Nhân viên';
                userRoleElement.textContent = roleName;
            }
            
            // Cập nhật avatar
            const userAvatarElement = document.getElementById('userAvatar');
            if (userAvatarElement) {
                if (employeeInfo.avatar) {
                    userAvatarElement.textContent = employeeInfo.avatar;
                } else if (employeeInfo.name) {
                    // Lấy 2 chữ cái đầu của tên
                    const nameParts = employeeInfo.name.trim().split(' ');
                    if (nameParts.length >= 2) {
                        userAvatarElement.textContent = nameParts[0][0] + nameParts[nameParts.length - 1][0];
                    } else {
                        userAvatarElement.textContent = employeeInfo.name.substring(0, 2);
                    }
                    userAvatarElement.textContent = userAvatarElement.textContent.toUpperCase();
                }
            }
        }
    } catch (error) {
        console.error('Lỗi khi load thông tin user:', error);
    }
}

// ========== KHỞI TẠO DROPDOWN USER ==========
function initUserDropdown() {
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownToggle = document.getElementById('userDropdownToggle');
    
    // Kiểm tra xem các phần tử có tồn tại không
    if (!userProfile || !userDropdown || !userDropdownToggle) {
        return;
    }
    
    // Xử lý click vào user profile
    userProfile.addEventListener('click', function(event) {
        event.stopPropagation();
        
        // Toggle hiển thị dropdown
        userDropdown.classList.toggle('show');
        
        // Thay đổi icon mũi tên
        if (userDropdown.classList.contains('show')) {
            userDropdownToggle.classList.remove('fa-chevron-down');
            userDropdownToggle.classList.add('fa-chevron-up');
        } else {
            userDropdownToggle.classList.remove('fa-chevron-up');
            userDropdownToggle.classList.add('fa-chevron-down');
        }
    });
    
    // Đóng dropdown khi click bên ngoài
    document.addEventListener('click', function(event) {
        if (!userProfile.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove('show');
            userDropdownToggle.classList.remove('fa-chevron-up');
            userDropdownToggle.classList.add('fa-chevron-down');
        }
    });
    
    // Ngăn chặn dropdown đóng khi click bên trong dropdown
    userDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// ========== HÀM XỬ LÝ CHO CÁC ITEM TRONG DROPDOWN ==========
function openProfile() {
    alert('Mở trang thông tin cá nhân');
    // window.location.href = '/pages/profile.html';
}

function openSettings() {
    alert('Mở trang cài đặt');
    // window.location.href = '/pages/settings.html';
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        Auth.logout();
    }
}
