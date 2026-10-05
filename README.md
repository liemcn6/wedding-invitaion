# Thiệp cưới Hoàng & Dung

Bản thiệp tĩnh, không cần cài dependency.

## Chạy thử

Mở `index.html` trực tiếp trong trình duyệt hoặc chạy một web server tĩnh trong thư mục này.

## Đổi ảnh

Mở `script.js` và thay các đường dẫn trong `IMAGES`:

- `coverLeft`, `coverRight`: hai cánh bìa
- `groom`, `bride`: ảnh cô dâu/chú rể
- `gallery`: danh sách ảnh album

## Kết nối Firebase cho Sổ Lưu Bút

Sổ lưu bút đã tích hợp Cloud Firestore. Để bật lưu/đọc dữ liệu dùng chung:

1. Tạo Web App trong Firebase Console và bật Cloud Firestore.
2. Mở `firebase-config.js`, thay các giá trị `YOUR_...` bằng Firebase Web App config.
3. Dán nội dung `firestore.rules` vào Firestore Database > Rules rồi Publish.
4. Chạy website qua hosting hoặc web server tĩnh; Firebase SDK dùng browser modules từ CDN.

Khi chưa có config, trang vẫn chạy chế độ tạm bằng `localStorage`. Khi config hợp lệ, lời chúc sẽ được đọc realtime từ collection `weddings/dinh-tien-hoang-tran-thi-dung/wishes`.
