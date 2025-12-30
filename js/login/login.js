// login.js - Xử lý đăng nhập với API nhân viên

document.addEventListener('DOMContentLoaded', function () {
    // ========= DOM ELEMENTS =========
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleIcon = togglePassword.querySelector('i');
    const loginForm = document.getElementById('loginForm');
    const loginToast = document.getElementById('loginToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const closeToast = document.getElementById('closeToast');
    const toastIcon = document.querySelector('#loginToast .toast-icon');
    const toastIconElement = toastIcon.querySelector('i');

    // ========= CẤU HÌNH API =========
    const API_BASE_URL = "http://127.0.0.1:6346";
    const API_ENDPOINTS = {
        login: "/api/employees/login"
    };

    // ========= HÀM HIỂN THỊ TOAST =========
    function showToast(type, title, message, duration = 5000) {
        // Đặt màu sắc và icon dựa trên loại thông báo
        const icons = {
            success: { icon: 'fa-check', color: 'success' },
            error: { icon: 'fa-times', color: 'error' },
            warning: { icon: 'fa-exclamation', color: 'error' },
            info: { icon: 'fa-info', color: 'success' }
        };

        const toastType = icons[type] || icons.info;
        
        // Cập nhật nội dung toast
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        // Cập nhật icon
        toastIconElement.className = `fas ${toastType.icon}`;
        toastIcon.className = `toast-icon ${toastType.color}`;
        
        // Hiển thị toast
        loginToast.classList.add('show');
        
        // Tự động ẩn sau khoảng thời gian
        setTimeout(() => {
            loginToast.classList.remove('show');
        }, duration);
    }

    // ========= HÀM GỌI API ĐĂNG NHẬP =========
    async function handleLogin(username, password) {
        try {
            // Hiển thị loading state
            showToast('info', 'Đang xử lý...', 'Vui lòng chờ trong giây lát', 30000);
            
            // Gọi API đăng nhập
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const result = await response.json();

            // Xử lý kết quả
            if (!response.ok) {
                throw new Error(result.message || 'Đăng nhập thất bại');
            }

            if (result.success) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('auth_token', result.data?.token || 'dummy_token');
                localStorage.setItem('employee_info', JSON.stringify(result.data?.employee || {}));
                
                // Lưu thông tin "ghi nhớ đăng nhập" nếu được chọn
                const rememberMe = document.getElementById('rememberMe').checked;
                if (rememberMe) {
                    localStorage.setItem('remember_login', 'true');
                    localStorage.setItem('saved_username', username);
                } else {
                    localStorage.removeItem('remember_login');
                    localStorage.removeItem('saved_username');
                }

                // Hiển thị thông báo thành công
                showToast('success', 'Đăng nhập thành công!', 'Đang chuyển hướng đến trang...', 2000);

                // Chuyển hướng sau 2 giây
                setTimeout(() => {
                    window.location.href = "../index.html"; // Hoặc Employee.html
                }, 2000);
            } else {
                throw new Error(result.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            
            // Xác định thông báo lỗi phù hợp
            let errorMessage = error.message;
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
            } else if (error.message.includes('401') || error.message.includes('không đúng')) {
                errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
            } else if (error.message.includes('403') || error.message.includes('không hoạt động')) {
                errorMessage = 'Tài khoản của bạn không hoạt động. Vui lòng liên hệ quản trị viên.';
            }

            showToast('error', 'Đăng nhập thất bại!', errorMessage);
        }
    }

    // ========= HÀM KIỂM TRA THÔNG TIN ĐĂNG NHẬP =========
    function validateLoginForm(username, password) {
        if (!username.trim()) {
            showToast('error', 'Lỗi nhập liệu', 'Vui lòng nhập tên đăng nhập hoặc email');
            document.getElementById('username').focus();
            return false;
        }

        if (!password.trim()) {
            showToast('error', 'Lỗi nhập liệu', 'Vui lòng nhập mật khẩu');
            document.getElementById('password').focus();
            return false;
        }

        return true;
    }

    // ========= HÀM KHỞI TẠO THÔNG TIN ĐÃ LƯU =========
    function initSavedCredentials() {
        const rememberLogin = localStorage.getItem('remember_login');
        const savedUsername = localStorage.getItem('saved_username');
        
        if (rememberLogin === 'true' && savedUsername) {
            document.getElementById('username').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    }

    // ========= XỬ LÝ SỰ KIỆN =========

    // Toggle hiển thị mật khẩu
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    // Xử lý form đăng nhập
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate form
        if (!validateLoginForm(username, password)) {
            return;
        }

        // Gọi hàm đăng nhập
        handleLogin(username, password);
    });

    // Đóng toast thông báo
    closeToast.addEventListener('click', function () {
        loginToast.classList.remove('show');
    });

    // Xử lý đăng nhập bằng mạng xã hội
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            showToast('info', 'Thông tin', `Tính năng đăng nhập bằng ${platform} đang được phát triển`);
        });
    });

    // Quên mật khẩu
    document.querySelector('.forgot-password').addEventListener('click', function (e) {
        e.preventDefault();
        showToast('info', 'Thông tin', 'Tính năng khôi phục mật khẩu đang được phát triển');
    });

    // Đăng ký tài khoản
    document.querySelector('.register-link a').addEventListener('click', function (e) {
        e.preventDefault();
        showToast('info', 'Thông tin', 'Vui lòng liên hệ quản trị viên để được cấp tài khoản');
    });

    // ========= KHỞI TẠO ỨNG DỤNG =========
    initSavedCredentials();

    // Kiểm tra nếu đã đăng nhập thì chuyển hướng
    if (localStorage.getItem('auth_token')) {
        showToast('info', 'Đã đăng nhập', 'Bạn đã đăng nhập, đang chuyển hướng...', 2000);
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 2000);
    }

    // ========= THÊM HIỆU ỨNG CHO FORM =========
    // Hiệu ứng focus cho input
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Hiệu ứng hover cho nút đăng nhập
    const loginBtn = document.querySelector('.btn-login');
    loginBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    loginBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // ========= XỬ LÝ ENTER ĐỂ ĐĂNG NHẬP =========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.target.classList.contains('social-btn')) {
            if (e.target === passwordInput) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // ========= XỬ LÝ LOADING STATE =========
    let originalButtonText = '';
    loginForm.addEventListener('submit', function() {
        const submitBtn = document.querySelector('.btn-login');
        originalButtonText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        submitBtn.disabled = true;
    });

    // Reset button sau khi xử lý xong
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const toast = document.getElementById('loginToast');
                if (!toast.classList.contains('show')) {
                    const submitBtn = document.querySelector('.btn-login');
                    submitBtn.innerHTML = originalButtonText || '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
                    submitBtn.disabled = false;
                }
            }
        });
    });

    observer.observe(loginToast, { attributes: true });
});