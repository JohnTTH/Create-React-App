import { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";
import "./MessagePageAdmin.scss";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000");

function MessagePageAdmin() {
    const [employee, setEmployee] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentRoom, setCurrentRoom] = useState(null);
    const userId = localStorage.getItem("idadmin");

    useEffect(() => {
        const fetchEmployeesAndLatest = async () => {
            try {
                const res = await axios.get("http://localhost:4000/GetEmployee/Employee");
                const employees = res.data.employees;

                const getMess = await Promise.all(
                    employees.map(async (emp) => {
                        const room = `${userId}_${emp.id}`;
                        try {
                            const res = await axios.get(`http://localhost:4000/GetMessages/${room}`);
                            return { ...emp, latestMessage: res.data.latest || null };
                        } catch (err) {
                            console.log(err);
                            return { ...emp, latestMessage: null };
                        }
                    })
                );

                setEmployee(getMess);
            } catch (err) {
                console.log(err);
            }
        };

        fetchEmployeesAndLatest();

        socket.on("receive_message", (data) => {
            const employeeId = data.room.split("_")[1];

            if (data.room === currentRoom) {
                setMessages((prev) => [...prev, data]);
            }

            setEmployee((prev) =>
                prev.map((emp) =>
                    emp.id === employeeId ? { ...emp, latestMessage: data } : emp
                )
            );
        });

        return () => socket.off("receive_message");
    }, [currentRoom, userId]);

    const selectEmployee = async (employeeId) => {
        const room = `${userId}_${employeeId}`;
        setCurrentRoom(room);
        socket.emit("join_room", { room });

        try {
            const res = await axios.get(`http://localhost:4000/GetMessages/${room}`);
            setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
        } catch (err) {
            console.log(err);
        }
    };

    // Gửi tin nhắn
    const sendMessage = () => {
        if (!currentRoom || !currentMessage) return;

        const data = {
            room: currentRoom,
            author: "Admin",
            message: currentMessage,
            time: new Date().toLocaleTimeString(),
        };

        socket.emit("send_message", data);
        setCurrentMessage("");
    };

    return (
        <DashboardPage>
            <div className="Contaiter-message">
                <div className="box-mess">
                    {employee.map((item) => (
                        <div className="box-user-mess" key={item.id}>
                            <div className="content-mess" onClick={() => selectEmployee(item.id)}>
                                <span><FaUserCircle /></span>
                                <p>{item.name}</p>
                            </div>
                            <p className="content-detail">
                                {item.latestMessage
                                    ? item.latestMessage.message.length > 50
                                        ? item.latestMessage.message.substring(0, 20) + "..."
                                        : item.latestMessage.message
                                    : "Chưa có tin nhắn"}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="chat-message">
                    <div className="box-chat-mess">
                        {messages?.map((msg, index) => (
                            <div className="box-chat" key={index}>
                                <div className="message" id={msg.author === "Admin" ? "you" : "other"}>
                                    <div className="message-content">
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                                <p id={msg.author === "Admin" ? "time-you" : "time-employe"}>
                                    {msg.time}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="box-text-chat">
                        <input
                            type="text"
                            value={currentMessage}
                            placeholder="Reply message"
                            className="input-send"
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") sendMessage();
                            }}
                        />
                        <button type="button" onClick={sendMessage}>Gửi</button>
                    </div>
                </div>
            </div>
        </DashboardPage>
    );
}

export default MessagePageAdmin;
