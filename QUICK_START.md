# 🚀 Quick Start - Quản Lý Nhà Cung Cấp

## Bắt Đầu Nhanh

### 1️⃣ Cài Đặt Backend
```bash
# Backend phải chạy trên
http://127.0.0.1:6346/api

# API endpoints cần thiết:
- GET    /api/suppliers              # Lấy danh sách
- GET    /api/suppliers/stats        # Lấy thống kê
- GET    /api/suppliers/:id          # Lấy chi tiết
- POST   /api/suppliers              # Tạo mới
- PUT    /api/suppliers/:id          # Cập nhật
- DELETE /api/suppliers/:id          # Xóa
```

### 2️⃣ Mở Trang
```
pages/Supplier.html
```

### 3️⃣ Tính Năng Chính

#### 📌 Xem Danh Sách
- Hiển thị tất cả nhà cung cấp
- Pagination tự động
- Stats nhanh (tổng, hoạt động, tạm dừng, chờ duyệt)

#### 🔍 Tìm Kiếm & Lọc
```
Tìm kiếm: Gõ tên nhà cung cấp
Lọc theo:
- Loại sản phẩm
- Trạng thái
- Xếp hạng
- Sắp xếp
```

#### ➕ Thêm Mới
```javascript
openAddModal()
// Hoặc click nút "Thêm Nhà Cung Cấp"
```

Fields bắt buộc:
- Tên NCC *
- Mã NCC *
- Mã Thuế *
- Email *
- Số ĐT *
- Người đại diện *
- SĐT đại diện *
- Địa chỉ *
- Loại SP *

#### ✏️ Chỉnh Sửa
```javascript
editSupplier(supplierId)
// Hoặc click nút "Chỉnh Sửa" (biểu tượng bút chì)
```

#### 🗑️ Xóa
```javascript
showDeleteModal(supplierId, supplierName)
// Hoặc click nút "Xóa" (biểu tượng thùng rác)
// Xác nhận trong dialog
```

#### 👁️ Xem Chi Tiết
```javascript
viewSupplier(supplierId)
// Hoặc click nút "Xem" (biểu tượng mắt)
```

#### 📥 Xuất Excel
```javascript
exportToExcel()
// Hoặc click nút "Xuất Excel"
```

### 4️⃣ Các Trạng Thái

```
✅ Đang hợp tác     (active)
⏸️ Tạm dừng        (inactive)
⏳ Chờ duyệt        (pending)
```

### 5️⃣ Loại Sản Phẩm

- 📱 Điện thoại
- 📱 Máy tính bảng
- 🎧 Phụ kiện
- ⌚ Đồng hồ thông minh
- 💻 Laptop
- 🔧 Linh kiện
- 🔋 Pin
- ⚡ Sạc
- 📦 Ốp lưng
- 🖥️ Màn hình

### 6️⃣ Xếp Hạng

- ⭐⭐⭐⭐⭐ Rất tốt (5)
- ⭐⭐⭐⭐☆ Tốt (4)
- ⭐⭐⭐☆☆ Trung bình (3)
- ⭐⭐☆☆☆ Kém (2)
- ⭐☆☆☆☆ Rất kém (1)

## 🎨 UI Components

### Buttons
```html
<!-- Xanh: Action chính -->
<button class="btn btn-primary">Lưu</button>

<!-- Xanh nhạt: Action phụ -->
<button class="btn btn-secondary">Hủy</button>

<!-- Xanh lục: Success -->
<button class="btn btn-success">Thêm</button>

<!-- Đỏ: Danger -->
<button class="btn btn-danger">Xóa</button>

<!-- Outline -->
<button class="btn btn-outline">Refresh</button>
```

### Modals
```javascript
// Hiển thị
modal.classList.add("active");

// Ẩn
modal.classList.remove("active");
```

### Toast Notifications
```javascript
showToast(title, message, type);
// type: "success", "error", "warning"
```

### Status Badges
```html
<span class="status-badge active">Đang hợp tác</span>
<span class="status-badge inactive">Tạm dừng</span>
<span class="status-badge pending">Chờ duyệt</span>
```

## 🐛 Debug Mode

Mở Console (F12) để xem:
```javascript
// API calls
console.log("🔗 Requesting URL:", url);

// Responses
console.log('✅ API response received:', data);

// Errors
console.error("💥 API Error:", error.message);

// Form data
console.log('🔍 Dữ liệu từ form:', data);
```

## 📱 Responsive Breakpoints

| Size | Width | Device |
|------|-------|--------|
| Desktop | > 1200px | PC |
| Tablet | 768px - 1200px | iPad |
| Mobile | < 768px | Phone |

## ⌨️ Keyboard Shortcuts

- `Escape` - Đóng modal
- `Ctrl/Cmd + K` - Focus tìm kiếm (if implemented)
- `Enter` - Submit form

## 🔐 Validation

| Field | Rule |
|-------|------|
| Email | Valid email format |
| Phone | Digits only |
| Tax Code | Format XX...X |
| Logo | JPG/PNG/SVG, < 5MB |

## 📞 Support

Kiểm tra:
1. Console errors (F12)
2. Network tab cho API calls
3. Backend logs
4. API endpoints response

## 🎯 Next Steps

1. ✅ Setup backend
2. ✅ Start server
3. ✅ Open Supplier.html
4. ✅ Test add/edit/delete
5. ✅ Check API responses
6. ✅ Verify data persistence

---

**Last Updated**: 2026-01-02
**Status**: Production Ready ✅
