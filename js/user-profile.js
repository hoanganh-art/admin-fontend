// user-profile.js - Xử lý hiển thị và dropdown user profile cho tất cả các trang

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 user-profile.js loaded');
    
    // ========== CẬP NHẬT THÔNG TIN USER ==========
    loadUserInfo();
    
    // ========== XỬ LÝ DROPDOWN ==========
    initUserDropdown();
});

// ========== LOAD THÔNG TIN USER TỪ LOCALSTORAGE ==========
function loadUserInfo() {
    console.log('📝 Loading user info...');
    try {
        // Lấy thông tin employee từ localStorage
        const employeeInfo = Auth.getEmployeeInfo();
        console.log('👤 Employee info:', employeeInfo);
        
        if (employeeInfo) {
            // Xác định tên hiển thị với fallback linh hoạt
            const displayName = (
                employeeInfo.name ||
                employeeInfo.fullName ||
                employeeInfo.full_name ||
                employeeInfo.employee_name ||
                employeeInfo.username ||
                ''
            ).toString().trim();

            // Cập nhật tên
            const userNameElement = document.getElementById('userName');
            console.log('🔍 userName element:', userNameElement);
            if (userNameElement) {
                if (displayName.length > 0) {
                    userNameElement.textContent = displayName;
                    console.log('✅ Updated userName to:', displayName);
                } else {
                    // Tên chưa có -> đặt tên mặc định dễ hiểu
                    userNameElement.textContent = 'Quản Trị Viên Hệ Thống';
                    console.warn('⚠️ displayName is empty, using default name');
                }
            }
            
            // Cập nhật role
            const userRoleElement = document.getElementById('userRole');
            console.log('🔍 userRole element:', userRoleElement);
            if (userRoleElement) {
                const roleMap = {
                    'admin': 'Quản trị viên',
                    'manager': 'Quản lý',
                    'staff': 'Nhân viên',
                    'employee': 'Nhân viên'
                };
                const roleName = roleMap[employeeInfo.role] || employeeInfo.role || 'Nhân viên';
                userRoleElement.textContent = roleName;
                console.log('✅ Updated userRole to:', roleName);
            }
            
            // Cập nhật avatar
            const userAvatarElement = document.getElementById('userAvatar');
            console.log('🔍 userAvatar element:', userAvatarElement);
            if (userAvatarElement) {
                if (employeeInfo.avatar) {
                    userAvatarElement.textContent = employeeInfo.avatar;
                } else {
                    // Lấy 2 chữ cái đầu từ displayName hoặc username
                    const sourceName = displayName || (employeeInfo.username || '').toString();
                    const nameParts = sourceName.trim().split(' ');
                    if (nameParts.length >= 2) {
                        userAvatarElement.textContent = nameParts[0][0] + nameParts[nameParts.length - 1][0];
                    } else {
                        userAvatarElement.textContent = sourceName.substring(0, 2);
                    }
                    userAvatarElement.textContent = userAvatarElement.textContent.toUpperCase();
                    console.log('✅ Updated avatar to:', userAvatarElement.textContent);
                }
            }
        } else {
            console.warn('⚠️ No employee info found in localStorage');
        }
    } catch (error) {
        console.error('❌ Lỗi khi load thông tin user:', error);
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
