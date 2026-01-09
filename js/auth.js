// auth.js - Kiểm tra xác thực người dùng
// File này cần được include trước các file khác trong index.html và các trang khác

(function() {
    // ========= CẤU HÌNH ==========
    const AUTH_TOKEN_KEY = 'auth_token';
    const EMPLOYEE_INFO_KEY = 'employee_info';
    
    // Xác định đường dẫn login dựa trên vị trí hiện tại
    function getLoginPagePath() {
        const currentPath = window.location.pathname;
        
        // Nếu đã ở trang login, không redirect
        if (currentPath.includes('/login/login.html') || currentPath.includes('\\login\\login.html')) {
            return null;
        }
        
        // Nếu ở trang root (index.html)
        if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('admin-fontend/')) {
            return './login/login.html';
        }
        
        // Nếu ở thư mục pages
        if (currentPath.includes('/pages/') || currentPath.includes('\\pages\\')) {
            return '../login/login.html';
        }
        
        // Mặc định
        return './login/login.html';
    }

    // ========= HÀM KIỂM TRA ĐĂNG NHẬP ==========
    function checkAuthentication() {
        // Lấy token từ localStorage
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const employeeInfo = localStorage.getItem(EMPLOYEE_INFO_KEY);

        // Nếu không có token hoặc employee info thì chưa đăng nhập
        if (!token || !employeeInfo) {
            const loginPath = getLoginPagePath();
            if (loginPath) {
                window.location.href = loginPath;
            }
            return false;
        }

        return true;
    }

    // ========= HÀM LOGOUT ==========
    function logout() {
        // Xóa thông tin đăng nhập
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(EMPLOYEE_INFO_KEY);
        localStorage.removeItem('remember_login');
        localStorage.removeItem('saved_username');
        
        // Redirect về trang login
        const loginPath = getLoginPagePath() || './login/login.html';
        window.location.href = loginPath;
    }

    // ========= HÀM LẤY THÔNG TIN NGƯỜI DÙNG ==========
    function getEmployeeInfo() {
        const employeeInfo = localStorage.getItem(EMPLOYEE_INFO_KEY);
        if (employeeInfo) {
            try {
                return JSON.parse(employeeInfo);
            } catch (e) {
                console.error('Lỗi khi parse employee info:', e);
                return null;
            }
        }
        return null;
    }

    // ========= HÀM LẤY TOKEN ==========
    function getAuthToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    // ========= KIỂM TRA NGAY LẬP TỨC KHI SCRIPT LOAD ==========
    checkAuthentication();

    // ========= KIỂM TRA KHI DOM SẴN SÀNG ==========
    document.addEventListener('DOMContentLoaded', function() {
        // Kiểm tra lại để chắc chắn
        checkAuthentication();
    });

    // ========= EXPORT FUNCTIONS GLOBAL ==========
    window.Auth = {
        checkAuthentication: checkAuthentication,
        logout: logout,
        getEmployeeInfo: getEmployeeInfo,
        getAuthToken: getAuthToken
    };
})();
