# 📖 Hướng Dẫn Sử Dụng Quản Lý Khách Hàng

## Khởi Động

1. **Mở file** `pages/customers.html` trong trình duyệt
2. Đảm bảo API server đang chạy tại `http://127.0.0.1:6346`
3. Dữ liệu sẽ tự động tải khi trang khởi động

## 🚀 Các Chức Năng Chính

### 1️⃣ Xem Danh Sách Khách Hàng

**Bảng Khách Hàng:**
- Hiển thị danh sách khách hàng với các thông tin chính
- Mỗi hàng hiển thị: Tên, Email, Điện thoại, Hạng, Trạng thái, Điểm, Ngày tham gia

**Phân Trang:**
- Click vào số trang để chuyển đến trang đó
- "<<" : Trang đầu tiên
- "<" : Trang trước
- ">" : Trang tiếp
- ">>" : Trang cuối cùng

**Thay Đổi Số Dòng/Trang:**
- Chọn từ dropdown: 10, 25, 50, hoặc 100 dòng/trang

### 2️⃣ Tìm Kiếm Khách Hàng

**Cách Tìm Kiếm:**
1. Nhập từ khóa vào ô tìm kiếm ở trên cùng
2. Nhấn Enter hoặc click ngoài ô input
3. Danh sách sẽ tự động cập nhật

**Tìm Kiếm Theo:**
- Tên khách hàng
- Email
- Số điện thoại

### 3️⃣ Lọc Khách Hàng

**Bộ Lọc Có Sẵn:**

```
┌─ Hạng Thành Viên ─┬─ Trạng Thái ─┬─ Độ Tuổi ─┬─ Tổng Chi Tiêu ─┐
│ ○ VIP            │ ○ Đang hoạt  │ ○ 18-25  │ ○ Dưới 10M      │
│ ○ Vàng           │ ○ Ngừng hoạt │ ○ 26-35  │ ○ 10-50M        │
│ ○ Bạc            │              │ ○ 36-45  │ ○ Trên 50M      │
│ ○ Đồng           │              │ ○ 46+    │                 │
└──────────────────┴──────────────┴──────────┴─────────────────┘
```

**Cách Sử Dụng:**
1. Chọn các tiêu chí lọc mong muốn
2. Click nút "Áp Dụng Lọc" (xanh)
3. Danh sách sẽ cập nhật theo bộ lọc

**Xóa Lọc:**
- Click "Xóa Lọc" (xám) hoặc "Đặt Lại Bộ Lọc" (xám)
- Danh sách sẽ hiển thị tất cả khách hàng

### 4️⃣ Xem Chi Tiết Khách Hàng

**Cách Xem:**
1. Click nút mắt 👁️ trên hàng khách hàng
2. Modal chi tiết sẽ mở ra

**Thông Tin Hiển Thị:**
- ✅ Thông tin cơ bản (Tên, Email, Điện thoại, Ngày sinh, Giới tính)
- ✅ Hạng thành viên và điểm tích lũy
- ✅ Địa chỉ và ghi chú
- ✅ Hoạt động gần đây
- ✅ Thống kê mua hàng
- ✅ ID khách hàng
- ✅ Trạng thái email xác thực

**Đóng Modal:**
- Click nút X góc trên phải
- Click nút "Đóng"
- Click vùng đen ngoài modal

### 5️⃣ Thêm Khách Hàng Mới

**Cách Thêm:**
1. Click nút xanh "Thêm Khách Hàng" ở trên cùng
2. Form thêm sẽ mở ra

**Điền Thông Tin:**
```
Bắt Buộc (*):
├─ Họ và Tên *
├─ Email *
└─ Số Điện Thoại *

Tùy Chọn:
├─ Ngày Sinh
├─ Giới Tính
├─ Hạng Thành Viên (mặc định: Đồng)
├─ Địa Chỉ
├─ Ghi Chú
└─ Trạng Thái (mặc định: Đang hoạt động)
```

**Lưu Khách Hàng:**
1. Điền các trường bắt buộc
2. Click nút xanh "Lưu Khách Hàng"
3. Sẽ hiển thị thông báo thành công
4. Form sẽ đóng tự động

**Hủy:**
- Click nút xám "Hủy" để đóng form không lưu

### 6️⃣ Chỉnh Sửa Khách Hàng

**Cách Sửa:**
1. Click nút bút chì ✏️ trên hàng khách hàng
2. Hoặc xem chi tiết rồi click "Chỉnh Sửa"

**Cập Nhật Thông Tin:**
- Form sẽ được điền sẵn thông tin hiện tại
- Thay đổi các trường muốn cập nhật
- Click "Lưu Khách Hàng"

### 7️⃣ Xóa/Ngừng Kích Hoạt Khách Hàng

**Cách Xóa:**
1. Click nút thùng rác 🗑️ / người bị cấm 🚫 trên hàng
2. Xác nhận hành động trong hộp thoại
3. Khách hàng sẽ bị xóa

**Cảnh Báo:**
⚠️ Hành động này không thể hoàn tác!

### 8️⃣ Gửi Tin Nhắn

**Cách Gửi:**
1. Click nút paper plane ✈️ trên hàng
2. Hoặc xem chi tiết rồi click "Gửi Tin Nhắn"

**Lưu Ý:**
⚡ Chức năng đang được phát triển

### 9️⃣ Thống Kê & Phân Bố

**Thẻ Thống Kê:**
```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Tổng Khách   │ Đang Hoạt    │ Khách Mới    │ Khách VIP    │ Ngừng Hoạt   │
│ Hàng (342)   │ Động (298)   │ (24)         │ (45)         │ Động (44)    │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

**Click để Lọc:**
- Click bất kỳ thẻ nào để lọc khách hàng theo tiêu chí đó
- Thẻ hiện tại sẽ được highlight

**Phân Bố Khách Hàng:**
- Theo độ tuổi: 18-25, 26-35, 36-45 tuổi
- Theo khu vực: TP.HCM, Hà Nội, Khác
- Theo mức mua sắm: Thấp, Trung bình, Cao

## 💡 Mẹo Sử Dụng

✨ **Làm mới dữ liệu:** Click nút "Làm Mới" để cập nhật danh sách mới nhất

✨ **Chọn hàng loạt:** Tick checkbox ở cột đầu tiên để chọn khách hàng

✨ **Tìm kiếm nhanh:** Gõ vào ô tìm kiếm và nhấn Enter

✨ **Lọc kết hợp:** Sử dụng bộ lọc nâng cao để tìm khách hàng chính xác

## ⚠️ Lỗi Phổ Biến

| Lỗi | Giải Pháp |
|-----|----------|
| "Không thể tải dữ liệu" | Kiểm tra API server có chạy không |
| Form không lưu | Điền đầy đủ các trường bắt buộc (*) |
| Tìm kiếm không có kết quả | Kiểm tra chính tả hoặc dùng từ khóa khác |
| Modal không mở | Refresh trang và thử lại |

## 📱 Tính Năng Responsive

- ✅ Desktop (1920px trở lên)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

---

**Cần trợ giúp thêm?** Liên hệ bộ phận IT hoặc xem tài liệu API.
