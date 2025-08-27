
# Employee Management & Realtime Chat System

Một ứng dụng **React + Vite** cho phép **admin quản lý nhân viên** với tính năng đăng nhập qua số điện thoại, xác thực OTP, thêm/xóa nhân viên, và chat realtime với nhiều nhân viên.

---

## 🔹 Tính năng chính

1. **Đăng nhập Admin bằng số điện thoại**
   - Gửi mã xác thực OTP qua SMS.
   - Xác thực để đăng nhập vào hệ thống quản lý.

2. **Quản lý nhân viên**
   - Thêm mới nhân viên.
   - Xóa nhân viên.
   - Xem danh sách nhân viên.

3. **Chat Realtime**
   - Chat trực tiếp giữa admin và nhiều nhân viên.
   - Hệ thống tin nhắn realtime sử dụng WebSocket / Socket.io.

---

## 🔹 Công nghệ sử dụng

- **Frontend:** React, Vite, SCSS, React Icons.
- **Realtime Chat:** Socket.io.
- **Backend:** Node.js + Express (API quản lý nhân viên, gửi OTP, chat).
- **Database:** Firebase Firestore (hoặc MongoDB / SQL tùy triển khai).
- **Xác thực:** OTP qua số điện thoại (Twilio, Vonage, hoặc Firebase Authentication).
- **Environment variables:** `.env` để lưu các key API, token OTP, secret JWT.

---

## 🔹 Cấu trúc dự án

```
src/
├─ components/       # Các component UI chung
├─ pages/            # Các trang: Dashboard, Message, Login
├─ services/         # Gọi API, Socket
├─ store/            # Redux hoặc Context
├─ App.jsx
├─ main.jsx
└─ styles/           # SCSS, theme
```

Backend (Node.js / Express):
```
server/
├─ routes/           # Các route: auth, employee, chat
├─ controllers/      # Logic xử lý
├─ models/           # Model dữ liệu
└─ index.js          # Server entry
```

---

## 🔹 Cài đặt & chạy dự án

1. Clone project:
```bash
git clone <repo-url>
cd project-name
```

2. Cài đặt frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Cài đặt backend:
```bash
cd backend
npm install
npm run dev
```

4. Thêm file `.env` với các biến môi trường cần thiết:
```
PORT=4000
FIREBASE_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
JWT_SECRET=...
```

5. Truy cập ứng dụng trên: `http://localhost:5173` (frontend Vite)

---

## 🔹 Lưu ý

- Đảm bảo backend đang chạy trước khi frontend gọi API.
- Realtime chat yêu cầu kết nối Socket.io đến backend.
- OTP gửi qua SMS yêu cầu cài đặt Twilio hoặc Firebase Authentication.

---

## 🔹 License

Project này được phát triển phục vụ mục đích học tập / demo.
