import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import DashboardEmploy from "./DashboardEmploy";
import "../style/MessagePage.scss";
import { FaUserCircle } from "react-icons/fa";

const socket = io.connect("http://localhost:4000");

function MessageEmploy() {
    const [currentMessage, setCurrentMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [dataEmploye, setDataEmploye] = useState([]);
    const userId = localStorage.getItem("userId");

    // Lấy danh sách admin và latestMessage
    useEffect(() => {
        const fetchAdminsAndMessages = async () => {
            try {
                const jwt = localStorage.getItem("jwt");
                const res = await axios.get(
                    "http://localhost:4000/GetEmployee/admin",
                    { headers: { Authorization: `Bearer ${jwt}` } }
                );

                const admins = res.data.employees;
                if (!admins) return;

                const getmessAdmins = await Promise.all(
                    admins.map( async (admin) => {
                        const room = `${admin.id}_${userId}`;
                        try {
                            const res = await axios.get(`http://localhost:4000/GetMessages/${room}`);
                            return { ...admin, latestMessage: res.data.latest || null };
                        } catch (err) {
                            console.log(err);
                            return { ...admin, latestMessage: null };
                        }
                    })
                );

                setDataEmploye(getmessAdmins);

                if (getmessAdmins.length > 0) {
                    const firstRoom = `${getmessAdmins[0].id}_${userId}`;
                    setCurrentRoom(firstRoom);
                    socket.emit("join_room", { room: firstRoom });

                    const res = await axios.get(`http://localhost:4000/GetMessages/${firstRoom}`);
                    setMessages( res.data.messages);
                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchAdminsAndMessages();

        socket.on("receive_message", (data) => {
            const adminId = data.room.split("_")[0];

            if (data.room === currentRoom) {
                setMessages((prev) => [...prev, data]);
            }

            setDataEmploye((prev) =>
                prev.map((admin) =>
                    admin.id === adminId ? { ...admin, latestMessage: data } : admin
                )
            );
        });

        return () => socket.off("receive_message");
    }, [currentRoom, userId]);

    const selectEmployee = async (adminId) => {
        const room = `${adminId}_${userId}`;
        setCurrentRoom(room);
        socket.emit("join_room", { room });

        try {
            const res = await axios.get(`http://localhost:4000/GetMessages/${room}`);
            setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
        } catch (err) {
            console.log(err);
        }
    };

    const sendMessage = () => {
        if (!currentRoom || !currentMessage) return;

        const data = {
            room: currentRoom,
            author: "Employee",
            message: currentMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        socket.emit("send_message", data);
        setCurrentMessage("");
    };

    return (
        <DashboardEmploy>
            <div className="Contaiter-message">
                <div className="box-mess">
                    {dataEmploye.map((item) => (
                        <div className="box-user-mess" key={item.id} onClick={() => selectEmployee(item.id)}>
                            <div className="content-mess" >
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
                                <div className="message" id={msg.author === "Employee" ? "you" : "other"}>
                                    <div className="message-content">
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                                <p id={msg.author === "Employee" ? "time-you" : "time-employe"}>
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
        </DashboardEmploy>
    );
}

export default MessageEmploy;
