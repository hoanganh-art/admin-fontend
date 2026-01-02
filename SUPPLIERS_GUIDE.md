# 📦 Hướng Dẫn Sử Dụng Quản Lý Nhà Cung Cấp

## 🎯 Tổng Quan
Trang Quản Lý Nhà Cung Cấp cho phép bạn:
- ✅ Xem danh sách nhà cung cấp
- ✅ Thêm nhà cung cấp mới
- ✅ Chỉnh sửa thông tin nhà cung cấp
- ✅ Xóa nhà cung cấp
- ✅ Tìm kiếm và lọc dữ liệu
- ✅ Xuất dữ liệu sang Excel
- ✅ Xem thống kê nhanh

## 🔧 Cấu Hình API

File: `js/pager/API/supplier.js`

```javascript
const API_BASE_URL = "http://127.0.0.1:6346/api";
```

**Cần thiết:**
- Backend server phải chạy trên `http://127.0.0.1:6346`
- API endpoints:
  - `GET /api/suppliers` - Lấy danh sách nhà cung cấp
  - `GET /api/suppliers/stats` - Lấy thống kê
  - `GET /api/suppliers/:id` - Lấy chi tiết
  - `POST /api/suppliers` - Tạo mới
  - `PUT /api/suppliers/:id` - Cập nhật
  - `DELETE /api/suppliers/:id` - Xóa

## 📋 Các Trường Dữ Liệu

### Bắt Buộc (*)
- `supplier_name` / `name` - Tên nhà cung cấp
- `code` / `supplier_code` - Mã nhà cung cấp
- `tax_code` / `tax_number` - Mã số thuế
- `email` - Email
- `phone` / `phone_number` - Số điện thoại
- `representative` / `contact_person` - Người đại diện
- `representative_phone` - SĐT người đại diện
- `address` - Địa chỉ

### Tùy Chọn
- `website` / `website_url` - Website
- `categories` / `category` - Loại sản phẩm (mảng)
- `rating` - Xếp hạng (1-5)
- `payment_terms` / `terms` - Điều khoản thanh toán
- `status` - Trạng thái (active, inactive, pending)

## 🎨 CSS Classes

### Modal
- `.modal` - Container modal
- `.modal.active` - Modal hiển thị
- `.modal-content` - Nội dung modal
- `.modal-header` - Header modal
- `.modal-body` - Body modal
- `.modal-footer` - Footer modal

### Form
- `.form-group` - Nhóm form
- `.form-control` - Input control
- `.form-label` - Label form
- `.form-textarea` - Textarea

### Table
- `.suppliers-table` - Bảng chính
- `.supplier-actions` - Các nút thao tác
- `.action-btn` - Nút thao tác đơn
- `.status-badge` - Badge trạng thái

## 🚀 Các Chức Năng Chính

### 1. Thêm Nhà Cung Cấp
1. Click nút "Thêm Nhà Cung Cấp"
2. Điền đầy đủ các trường bắt buộc (*)
3. Chọn loại sản phẩm (Giữ Ctrl để chọn nhiều)
4. Upload logo (tùy chọn)
5. Click "Lưu Nhà Cung Cấp"

### 2. Chỉnh Sửa Nhà Cung Cấp
1. Click nút "Chỉnh Sửa" (biểu tượng bút chì)
2. Sửa đổi thông tin
3. Click "Lưu Nhà Cung Cấp"

### 3. Xóa Nhà Cung Cấp
1. Click nút "Xóa" (biểu tượng thùng rác)
2. Xác nhận xóa trong modal
3. Nhà cung cấp sẽ bị xóa vĩnh viễn

### 4. Tìm Kiếm
- Gõ tên nhà cung cấp trong ô tìm kiếm
- Kết quả tìm kiếm cập nhật real-time

### 5. Bộ Lọc
- **Loại Sản Phẩm**: Lọc theo loại sản phẩm
- **Trạng Thái**: Lọc theo trạng thái hợp tác
- **Xếp Hạng**: Lọc theo xếp hạng sao
- **Sắp Xếp**: Sắp xếp danh sách

### 6. Xuất Excel
1. Click nút "Xuất Excel"
2. File CSV sẽ tự động tải về

## 📱 Cấu Trúc Thư Mục

```
admin-fontend/
├── pages/
│   └── Supplier.html          # Trang chính
├── js/
│   └── pager/
│       └── API/
│           └── supplier.js    # JavaScript chính
└── css/
    └── pages/
        └── supplier.css       # CSS styling
```

## 🐛 Gỡ Lỗi

Mở Developer Console (F12) để xem:
- 🔍 Request/Response API
- ⚠️ Warning và error messages
- 📊 Dữ liệu được xử lý

## ✨ Các Cải Thiện Gần Đây

- ✅ Thêm chế độ dark mode ready (CSS variables)
- ✅ Hỗ trợ drag-drop upload logo
- ✅ Export dữ liệu sang CSV/Excel
- ✅ Xử lý lỗi API tốt hơn
- ✅ Toast notifications
- ✅ Modal animation smooth
- ✅ Responsive design (Mobile-friendly)
- ✅ Select all checkbox

## 📝 Lưu Ý

1. Tất cả các trường bắt buộc phải điền đầy đủ
2. Email phải có định dạng hợp lệ
3. Số điện thoại phải hợp lệ
4. Logo tối đa 5MB, định dạng JPG/PNG/SVG
5. Có thể chọn nhiều loại sản phẩm (Ctrl+Click)
6. Xóa không thể hoàn tác - cần xác nhận lại

## 🔗 Liên Kết Nhanh

- [Trang chính](../index.html)
- [Sản Phẩm](products.html)
- [Đơn Hàng](invoices.html)
- [Khách Hàng](customers.html)
- [Nhân Viên](Employee.html)
