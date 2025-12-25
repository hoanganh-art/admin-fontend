# Quản Lý Khách Hàng - Danh Sách Chức Năng Hoàn Chỉnh

## ✅ Chức Năng Đã Hoàn Thành

### 1. **Hiển Thị Danh Sách Khách Hàng**
- Render bảng khách hàng từ API
- Phân trang (10, 25, 50, 100 dòng/trang)
- Tìm kiếm khách hàng theo tên, email, điện thoại
- Lọc theo hạng thành viên (VIP, Vàng, Bạc, Đồng)
- Lọc theo trạng thái (Đang hoạt động, Ngừng hoạt động)

### 2. **Thống Kê & Phân Bố**
- Hiển thị tổng số khách hàng
- Thống kê khách hàng đang hoạt động
- Thống kê khách hàng mới
- Thống kê khách hàng VIP
- Thống kê khách hàng ngừng hoạt động
- Phân bố theo giới tính (Nam/Nữ)
- Phân bố theo hạng thành viên (VIP/Vàng/Bạc/Đồng)
- Thống kê mức độ mua sắm

### 3. **Xem Chi Tiết Khách Hàng**
- Modal hiển thị thông tin đầy đủ
- Thông tin cơ bản (Tên, Email, Điện thoại, Ngày sinh, Giới tính)
- Hạng thành viên và điểm tích lũy
- Thông tin liên hệ (Địa chỉ, Ghi chú)
- Hoạt động gần đây
- Thống kê mua hàng
- Thông tin hệ thống (ID, Email xác thực, Trạng thái)
- Ưu đãi đặc biệt theo hạng

### 4. **Thêm Khách Hàng**
- Form thêm khách hàng mới
- Validate dữ liệu bắt buộc (Tên, Email, Điện thoại)
- Nhập thông tin chi tiết:
  - Họ và tên
  - Email
  - Số điện thoại
  - Ngày sinh
  - Giới tính (Nam/Nữ/Khác)
  - Hạng thành viên
  - Địa chỉ
  - Ghi chú
  - Trạng thái (Đang hoạt động/Ngừng hoạt động)

### 5. **Chỉnh Sửa Khách Hàng**
- Tải thông tin khách hàng vào form
- Cập nhật các trường thông tin
- Gửi yêu cầu PUT đến API
- Thông báo thành công/lỗi

### 6. **Xóa/Ngừng Kích Hoạt Khách Hàng**
- Xóa khách hàng với xác nhận
- Gọi API DELETE
- Cập nhật danh sách

### 7. **Bộ Lọc Nâng Cao**
- Lọc theo hạng thành viên
- Lọc theo trạng thái
- Lọc theo độ tuổi
- Lọc theo mức chi tiêu
- Áp dụng/Xóa lọc
- Đặt lại bộ lọc

### 8. **Phân Trang & Điều Hướng**
- Trang đầu, trang cuối
- Trang trước, trang tiếp
- Chuyển đến trang bất kỳ
- Hiển thị 5 nút trang
- Cập nhật thông tin trang hiện tại

### 9. **Thao Tác Trên Hàng**
- Nút Xem chi tiết
- Nút Chỉnh sửa
- Nút Gửi tin nhắn
- Nút Xóa/Ngừng kích hoạt
- Chọn hàng (Checkbox)
- Chọn tất cả (Select All)

### 10. **Quản Lý Modal**
- Modal xem chi tiết khách hàng
- Modal thêm/chỉnh sửa khách hàng
- Đóng modal bằng nút X, nút Hủy, hoặc click overlay
- Điều chỉnh scroll body

### 11. **Thông Báo Toàn Cục**
- Toast notification cho các hành động
- Thể loại: Success, Warning, Error
- Tự động ẩn sau 5 giây
- Icon và tiêu đề tùy chỉnh

### 12. **API Integration**
- GET /api/customers - Lấy danh sách khách hàng
- GET /api/customers/{id} - Lấy chi tiết khách hàng
- GET /api/customers/stats - Lấy thống kê
- POST /api/customers - Tạo khách hàng mới
- PUT /api/customers/{id} - Cập nhật khách hàng
- DELETE /api/customers/{id} - Xóa khách hàng

### 13. **Hỗ Trợ Chung**
- Làm mới dữ liệu
- Tính toán tuổi từ ngày sinh
- Format ngày theo định dạng Việt Nam
- Lấy chữ cái đầu tên làm avatar
- Xử lý lỗi API
- Loading state cho các hành động

## 📋 Hàm Chính

```javascript
// Render & Data
renderCustomersTable()        // Render bảng khách hàng
updateStatsFromAPI()          // Cập nhật thống kê
updateSegmentCards()          // Cập nhật biểu đồ phân bố

// CRUD Operations
getCustomers()                // Lấy danh sách khách hàng
getCustomerById()             // Lấy chi tiết khách hàng
createCustomer()              // Tạo khách hàng mới
updateCustomer()              // Cập nhật khách hàng
deleteCustomer()              // Xóa khách hàng
getCustomerStats()            // Lấy thống kê

// Modal & Form
viewCustomerDetail()          // Xem chi tiết khách hàng
saveCustomer()                // Lưu khách hàng
editCustomer()                // Chỉnh sửa khách hàng
deactivateCustomer()          // Ngừng kích hoạt
openCustomerForm()            // Mở form
closeCustomerModalFunc()      // Đóng modal chi tiết
closeFormModalFunc()          // Đóng modal form

// Filters & Pagination
applyCustomerFilters()        // Áp dụng bộ lọc
clearAllFilters()             // Xóa bộ lọc
goToPage()                    // Chuyển đến trang
updatePagination()            // Cập nhật nút phân trang

// Utilities
showToast()                   // Hiển thị thông báo
calculateAge()                // Tính tuổi
formatDate()                  // Format ngày
getTierClass()                // Lấy class hạng
getTierText()                 // Lấy tên hạng
getInitials()                 // Lấy chữ cái đầu
sendMessageToCustomer()       // Gửi tin nhắn
```

## 🎨 Giao Diện

- **Stats Cards**: Hiển thị 5 thẻ thống kê chính
- **Segment Cards**: Phân bố khách hàng theo 3 tiêu chí
- **Filter Container**: Bộ lọc với 4 tiêu chí
- **Customer Table**: Bảng khách hàng với 7 cột
- **Pagination**: Phân trang với 7 nút
- **Modals**: Chi tiết và form thêm/sửa

## 🔗 Dependencies

- Font Awesome 6.4.0 (Icons)
- Inter Font (Typography)
- Vanilla JavaScript (No jQuery)
- CSS3 + Flexbox + Grid
- Glassmorphism Design

## ⚙️ Cấu Hình API

```javascript
const API_BASE_URL = "http://127.0.0.1:6346";
const API_ENDPOINTS = {
  customers: "/api/customers",
  customersId: "/api/customers/{id}",
  customersStats: "/api/customers/stats",
};
```

---

**Cập nhật lần cuối**: 2025-12-25
**Phiên bản**: 1.0.0 - Hoàn chỉnh
