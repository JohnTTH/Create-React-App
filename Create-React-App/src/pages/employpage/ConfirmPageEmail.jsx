import { BsArrowLeft } from "react-icons/bs";
import "../style/Global.scss"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

function ConfirmPageEmail() {

    const email = useSelector((state) => state.email.value);
    const navigate = useNavigate();
    const [newCode, setNewCode] = useState({
        code: "",
        email: email,
    })

    const handleChange = (e) => {
        setNewCode({
            ...newCode,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resValidate = await axios.post(
                "http://localhost:4000/validate-access-code",
                newCode
            );

            const { email, token } = resValidate.data;

            // 2. Tạo session JWT
            const resSession = await axios.post(
                "http://localhost:4000/login-session",
                { email, token }
            );

            const { jwt, user } = resSession.data;

            // Lưu JWT và thông tin nhân viên
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("userId", user.id);

            setNewCode({ code: "", email: email });

            toast.success("Xác thực OTP thành công");
            setTimeout(() => {
                navigate("/messemploy");
            }, 3000);
        } catch (err) {
            toast.error("Xác thực OTP thất bại");
        }
    };


    return (
        <div className="container-login">
            <div className="content-login">
                <div className="back-button">
                    <a href="/login-email">
                        <BsArrowLeft />
                        <span>Back</span>
                    </a>
                </div>
                <div className="text-login">
                    <h2>Email verification</h2>
                    <span>Please enter your code that send to your email address</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <input name="code" type="text" placeholder="Enter Your Code" value={newCode.code} onChange={handleChange} />
                    <button className="btn-next">Submit</button>
                </form>
                <div className="footer-login">
                    <span>Code not receive? </span>
                    <a href="#">Send again</a>
                </div>
            </div>
                        <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default ConfirmPageEmail;
