// server.js
const express = require("express");
require("dotenv").config();
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const serviceAccount = require("./serviceAccountKey.json");
const JWT_SECRET = process.env.JWT_SECRET;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

//===================================send sms==============================================
app.post("/login-phone", async (req, res) => {
    try {
        let { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Thiếu số điện thoại" });
        }

        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }

        const code = generateOTP();
        const token = crypto.randomBytes(16).toString("hex");
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);

        await db.collection("AccessCodes").doc(phoneNumber).set({ code, token, createdAt, expiresAt });

        await client.messages.create({
            body: `Mã OTP của bạn là ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        return res.json({ success: true, message: "Gửi OTP thành công", phoneNumber, token });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Server lỗi", error: err.message });
    }
});

app.post("/validate-access-code-phone", async (req, res) => {
    try {
        let { phone, code } = req.body;

        if (!phone || !code) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
        }

        const accessCodesRef = db.collection("AccessCodes").doc(phone);
        const docSnap = await accessCodesRef.get();

        if (!docSnap.exists) {
            return res.status(400).json({ success: false, message: "OTP không tồn tại" });
        }

        const data = docSnap.data();

        // Kiểm tra OTP
        if (data.code !== code) {
            return res.status(400).json({ success: false, message: "OTP không đúng" });
        }

        // Kiểm tra hết hạn
        if (data.expiresAt.toDate() < new Date()) {
            return res.status(400).json({ success: false, message: "OTP đã hết hạn" });
        }

        // Xoá/make invalid OTP sau khi dùng
        await accessCodesRef.update({ code: "" });

        return res.json({
            success: true,
            message: "OTP hợp lệ",
            phone,
            token: data.token
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Lỗi xác thực OTP" });
    }
});

app.post("/login-session-phone", async (req, res) => {
    try {
        let { phone, token } = req.body;

        if (!phone || !token) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
        }

        const accessCodesRef = db.collection("AccessCodes").doc(phone);
        const docSnap = await accessCodesRef.get();

        if (!docSnap.exists) {
            return res.status(400).json({ success: false, message: "Token không hợp lệ" });
        }

        const data = docSnap.data();
        if (data.token !== token) {
            return res.status(400).json({ success: false, message: "Token không hợp lệ" });
        }

        // Kiểm tra Employees collection
        const employeesRef = db.collection("Employees");
        const employeeQuery = await employeesRef.where("phone", "==", phone).limit(1).get();

        let userData;

        if (!employeeQuery.empty) {
            const empDoc = employeeQuery.docs[0];
            await empDoc.ref.update({ used: true });

            userData = { id: empDoc.id, ...empDoc.data(), used: true };
        } else {
            const countSnapshot = await employeesRef.where("role", "==", "Employee").get();
            const count = countSnapshot.size + 1; 
            const newEmpRef = await db.collection("Employees").doc();
            await newEmpRef.set({
                phone,
                name: `admin${count}`,
                role: "admin",
                used: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            userData = { id: newEmpRef.id, phone, role: "admin", used: true };
        }

        // Tạo JWT
        const jwtToken = jwt.sign({ phone }, JWT_SECRET, { expiresIn: "1h" });

        return res.json({
            success: true,
            message: "Login thành công",
            user: userData,
            jwt: jwtToken
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Lỗi tạo session" });
    }
});

//==================================Owner APIs==============================================

// Lấy thông tin nhân viên theo employeeId
app.get("/employees/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!employeeId) return res.status(400).json({ message: "Lỗi Thiếu ID" });

        const docRef = db.collection("Employees").doc(employeeId);
        const docSnap = await docRef.get();
        if (!docSnap.exists) return res.status(404).json({ message: "Không tìm thấy nhân viên" });

        res.json({ success: true, employee: { id: docSnap.id, ...docSnap.data() } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Thêm Nhân viên
app.post("/CreateEmployee", async (req, res) => {
    try {
        const { name, email, phone, role, address } = req.body;
        if (!name || !email || !phone || !role || !address) {
            return res.status(400).json({ message: "Thiếu thông tin nhân viên" });
        }
        const employeesRef = db.collection("Employees");

        const emailQuery = await employeesRef.where("email", "==", email).limit(1).get();
        if (!emailQuery.empty) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại" });
        }

        const phoneQuery = await employeesRef.where("phone", "==", phone).limit(1).get();
        if (!phoneQuery.empty) {
            return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại" });
        }

        const token = crypto.randomBytes(16).toString("hex");
        const newEmployeeRef = db.collection("Employees").doc();
        const employeeId = newEmployeeRef.id;

        await newEmployeeRef.set({
            employeeId,
            name,
            email,
            phone,
            role,
            address,
            token,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            used: false
        });

        const inviteLink = `http://localhost:5173/login-email`;
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: "Hệ thống Quản lý",
            to: email,
            subject: "Thư mời tạo tài khoản nhân viên",
            html: `
                <p>Xin chào <b>${name}</b>,</p>
                <p>Bạn đã được mời tham gia hệ thống quản lý nhân viên với vai trò <b>${role}</b>.</p>
                <p>Vui lòng nhấn vào link dưới đây để thiết lập tài khoản của bạn (hết hạn sau 24h):</p>
                <a href="${inviteLink}">${inviteLink}</a>
            `
        });

        res.json({ success: true, message: "Thư mời đã gửi", employeeId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Không thể tạo nhân viên" });
    }
});

// Xóa nhân viên theo employeeId
app.delete("/DeleteEmployee/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId bắt buộc" });
        }

        const employeeRef = db.collection("Employees").doc(employeeId);
        const employeeDoc = await employeeRef.get();

        if (!employeeDoc.exists) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }

        await employeeRef.delete();

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

//=====================================Employee APIs=======================================

app.post("/login-email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email bắt buộc" });

        const accessCodesRef = db.collection("AccessCodes").doc(email);
        const docSnap = await accessCodesRef.get();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        let token = crypto.randomBytes(16).toString("hex");

        if (docSnap.exists) {
            token = docSnap.data().token;
            await accessCodesRef.update({
                code: otp,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            });
        } else {
            await accessCodesRef.set({
                code: otp,
                token,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            });
        }

        // Gửi OTP qua email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: "Hệ thống Quản lý",
            to: email,
            subject: "Mã OTP xác thực",
            text: `Mã OTP của bạn là: ${otp}. Hết hạn sau 5 phút.`
        });

        res.json({ success: true, message: "OTP đã gửi", email, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi gửi OTP" });
    }
});

app.post("/validate-access-code", async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) return res.status(400).json({ message: "Thiếu dữ liệu" });

        const accessCodesRef = db.collection("AccessCodes").doc(email);
        const docSnap = await accessCodesRef.get();

        if (!docSnap.exists) return res.status(400).json({ message: "OTP không tồn tại" });

        const data = docSnap.data();

        if (data.code !== code) return res.status(400).json({ message: "OTP không đúng" });
        if (data.expiresAt.toDate() < new Date()) return res.status(400).json({ message: "OTP đã hết hạn" });

        await accessCodesRef.update({ code: "" });

        res.json({ success: true, message: "OTP hợp lệ", email, token: data.token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi xác thực OTP" });
    }
});

app.post("/login-session", async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) return res.status(400).json({ message: "Thiếu dữ liệu" });

        const accessCodesRef = db.collection("AccessCodes").doc(email);
        const docSnap = await accessCodesRef.get();
        if (!docSnap.exists) return res.status(400).json({ message: "Token không hợp lệ" });

        if (docSnap.data().token !== token) return res.status(400).json({ message: "Token không hợp lệ" });

        // Kiểm tra Employees collection
        const employeesRef = db.collection("Employees");
        const employeeQuery = await employeesRef.where("email", "==", email).limit(1).get();

        let userData;

        if (!employeeQuery.empty) {
            const empDoc = employeeQuery.docs[0];
            // Cập nhật used thành true
            await empDoc.ref.update({ used: true });

            userData = { id: empDoc.id, ...empDoc.data(), used: true };
        } else {
            // Nếu chưa có tài khoản → tạo mới
            const countSnapshot = await employeesRef.where("role", "==", "Employee").get();
            const count = countSnapshot.size + 1;
            const newEmpRef = await db.collection("Employees").doc();
            await newEmpRef.set({
                email,
                name: `Employee${count}`, 
                role: "Employee",
                used: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            userData = { id: newEmpRef.id, email, role: "employee", used: true };
        }


        // Tạo JWT
        const jwtToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ success: true, message: "Login thành công", user: userData, jwt: jwtToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi tạo session" });
    }
});

//=====================================Chat Realtime==========================================
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
    socket.on("join_room", ({ room }) => {
        socket.join(room);
    });

    socket.on("send_message", async (data) => {
        try {
            // Lưu tin nhắn vào Firestore
            await db.collection("Messages").add({
                room: data.room,
                author: data.author,
                message: data.message,
                time: data.time,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Gửi message realtime cho room
            io.to(data.room).emit("receive_message", data);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get("/GetMessages/:room", async (req, res) => {
    try {
        const { room } = req.params;

        // Lấy tất cả messages của room
        const snapshot = await db.collection("Messages")
            .where("room", "==", room)
            .get();

        if (snapshot.empty) {
            return res.json({ 
                success: true, 
                messages: [], 
                latest: null 
            });
        }

        // Map dữ liệu messages
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                message: typeof data.message === "string" ? data.message : "Không có tin nhắn",
                author: data.author || "Unknown",
                time: data.time || "",
                createdAt: data.createdAt ? data.createdAt.toMillis() : 0
            };
        });

        // Sắp xếp messages theo thời gian tăng dần (hiển thị chat đúng thứ tự)
        messages.sort((a, b) => a.createdAt - b.createdAt);

        // Lấy tin nhắn mới nhất (latest)
        const latest = messages[messages.length - 1];

        res.json({ 
            success: true, 
            messages, 
            latest 
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Lấy danh sách nhân viên theo role
app.get("/GetEmployee/:role", async (req, res) => {
    try {
        const { role } = req.params;
        if (!role) {
            return res.status(400).json({ message: "role bắt buộc" });
        }

        const employeesRef = db.collection("Employees");
        const snapshot = await employeesRef.where("role", "==", role).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: `Không tìm thấy nhân viên với role: ${role}` });
        }

        let employees = [];
        snapshot.forEach(doc => {
            employees.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return res.status(200).json({
            success: true,
            count: employees.length,
            employees
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Lấy tất cả nhân viên trừ role = "admin" hoặc "Admin"
app.get("/GetAllEmployeesExceptAdmin", async (req, res) => {
    try {
        const employeesRef = db.collection("Employees");
        const snapshot = await employeesRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: "Không có nhân viên nào" });
        }

        let employees = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Lọc trừ admin hoặc Admin
            if (data.role && data.role.toLowerCase() !== "admin") {
                employees.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        return res.status(200).json({
            success: true,
            count: employees.length,
            employees
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
});


server.listen(4000, () => console.log("Server chạy tại http://localhost:4000"));