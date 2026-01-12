# 🔐 Hướng Dẫn Sử Dụng Hệ Thống Hiển Thị Thông Tin Tài Khoản

## ❌ Vấn Đề
Toàn bộ code không hiển thị thông tin tài khoản đã đăng nhập trên các trang.

## ✅ Giải Pháp

### 📋 Nguyên Nhân
Code đã hoàn chỉnh và đúng, nhưng **chưa có dữ liệu đăng nhập trong localStorage**. Hệ thống cần:
1. `auth_token` - Token xác thực
2. `employee_info` - Thông tin nhân viên (JSON)

### 🔧 Cách Khắc Phục

#### **Phương Pháp 1: Test Nhanh (Khuyên Dùng)**

1. Mở file `test-login-data.html` trong trình duyệt
2. Click nút "👤 Thêm Admin" để thêm dữ liệu test
3. Click "📊 Dashboard" hoặc "👥 Nhân Viên" để xem kết quả
4. Thông tin tài khoản sẽ hiển thị ngay!

#### **Phương Pháp 2: Đăng Nhập Qua Trang Login**

1. Đảm bảo API server đang chạy tại `http://127.0.0.1:6346`
2. Mở `login/login.html` 
3. Nhập username và password hợp lệ
4. Sau khi đăng nhập thành công, thông tin sẽ được lưu vào localStorage
5. Các trang khác sẽ hiển thị thông tin tự động

#### **Phương Pháp 3: Thêm Thủ Công Qua Console**

Mở Console (F12) và chạy:

```javascript
// Thêm token
localStorage.setItem('auth_token', 'test_token_123');

// Thêm thông tin nhân viên
const employeeInfo = {
    id: 1,
    name: 'Nguyễn Văn Admin',
    username: 'admin',
    email: 'admin@phonestore.com',
    role: 'admin',
    phone: '0123456789',
    status: 'active'
};
localStorage.setItem('employee_info', JSON.stringify(employeeInfo));

// Reload trang
location.reload();
```

### 📁 Cấu Trúc File Đã Có

```
✅ js/auth.js              - Kiểm tra authentication, export Auth object
✅ js/user-profile.js      - Load và hiển thị thông tin user
✅ js/user.js              - Xử lý dropdown (file cũ, không cần thiết)
✅ pages/Employee.html     - Import đúng script
✅ css/user-dropdown.css   - Style cho dropdown
```

### 🔍 Kiểm Tra Code

#### File: `pages/Employee.html` (Dòng 461-463)
```html
<script src="../js/auth.js"></script>
<script src="../js/user-profile.js"></script>
<script src="../js/pager/employees.js"></script>
```
✅ **Đúng thứ tự!** `auth.js` phải load trước `user-profile.js`

#### File: `js/auth.js`
```javascript
window.Auth = {
    checkAuthentication: checkAuthentication,
    logout: logout,
    getEmployeeInfo: getEmployeeInfo,  // ✅ Export function này
    getAuthToken: getAuthToken
};
```

#### File: `js/user-profile.js`
```javascript
function loadUserInfo() {
    const employeeInfo = Auth.getEmployeeInfo();  // ✅ Sử dụng Auth.getEmployeeInfo()
    
    if (employeeInfo) {
        // Cập nhật tên
        document.getElementById('userName').textContent = employeeInfo.name;
        
        // Cập nhật role
        const roleMap = {
            'admin': 'Quản trị viên',
            'manager': 'Quản lý',
            'staff': 'Nhân viên',
            'employee': 'Nhân viên'
        };
        document.getElementById('userRole').textContent = roleMap[employeeInfo.role];
        
        // Cập nhật avatar
        // ... code tạo avatar từ tên
    }
}
```

### 🎯 Dữ Liệu Mẫu

#### Admin Account
```json
{
    "id": 1,
    "name": "Nguyễn Văn Admin",
    "username": "admin",
    "email": "admin@phonestore.com",
    "role": "admin",
    "phone": "0123456789",
    "status": "active"
}
```

#### Manager Account
```json
{
    "id": 2,
    "name": "Trần Thị Hương",
    "username": "manager",
    "email": "manager@phonestore.com",
    "role": "manager",
    "phone": "0987654321",
    "status": "active"
}
```

#### Staff Account
```json
{
    "id": 3,
    "name": "Lê Văn Tùng",
    "username": "staff",
    "email": "staff@phonestore.com",
    "role": "employee",
    "phone": "0912345678",
    "status": "active"
}
```

### 🐛 Debug

Nếu vẫn không hiển thị, kiểm tra Console (F12):

```javascript
// Kiểm tra localStorage
console.log('Token:', localStorage.getItem('auth_token'));
console.log('Employee:', localStorage.getItem('employee_info'));

// Kiểm tra Auth object
console.log('Auth object:', window.Auth);

// Kiểm tra employee info
console.log('Employee Info:', Auth.getEmployeeInfo());

// Kiểm tra các phần tử HTML
console.log('userName element:', document.getElementById('userName'));
console.log('userRole element:', document.getElementById('userRole'));
console.log('userAvatar element:', document.getElementById('userAvatar'));
```

### 📊 Kết Quả Mong Đợi

Sau khi thêm dữ liệu đăng nhập, header sẽ hiển thị:

```
┌─────────────────────────────────┐
│ 🔍 Tìm kiếm...  🔔  [NVA]      │
│                    Nguyễn Văn Admin ▼
│                    Quản trị viên
└─────────────────────────────────┘
```

Khi click vào profile:
```
┌─────────────────────────┐
│ 👤 Thông tin cá nhân    │
│ ⚙️ Cài đặt              │
│ ─────────────────────   │
│ 🚪 Đăng xuất            │
└─────────────────────────┘
```

### ✨ Tính Năng

1. ✅ Tự động load thông tin từ localStorage
2. ✅ Hiển thị tên, role, avatar
3. ✅ Avatar tự động từ tên (VD: "Nguyễn Văn Admin" → "NVA")
4. ✅ Dropdown menu với các tùy chọn
5. ✅ Logout xóa dữ liệu và redirect về login
6. ✅ Redirect tự động về login nếu chưa đăng nhập

### 🔗 File Liên Quan

- `test-login-data.html` - Tool thêm dữ liệu test
- `login/login.html` - Trang đăng nhập chính
- `js/login/login.js` - Xử lý login và lưu dữ liệu
- `js/auth.js` - Authentication guard
- `js/user-profile.js` - Hiển thị thông tin user
- `css/user-dropdown.css` - Style dropdown

### 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề, kiểm tra:
1. Console có lỗi JavaScript không?
2. localStorage có dữ liệu không?
3. Các file script có load đúng thứ tự không?
4. Các ID element có đúng không? (`userName`, `userRole`, `userAvatar`)

---

**✅ Kết luận:** Code đã hoàn chỉnh và hoạt động tốt. Chỉ cần thêm dữ liệu đăng nhập vào localStorage là sẽ hiển thị thông tin tài khoản ngay!
