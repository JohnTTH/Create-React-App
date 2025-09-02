import { BsArrowLeft } from "react-icons/bs";
import "../style/Global.scss"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {  loginWithEmail,validateAccessCodeEmail, loginSessionEmail } from "../api/authApi";

function ConfirmPageEmail() {

    const email = useSelector((state) => state.email.value);
    const navigate = useNavigate();
    const [newCode, setNewCode] = useState({
        code: "",
        email: email,
    })
    const [dataEmail, setDataEmail] = useState({
        email: email,
    })

    const handelsend = async (e) => {
        e.preventDefault();
        try {
            loginWithEmail(dataEmail);
            setDataEmail({ email: email });

            toast.success("Gửi OTP thành Công");
        } catch {
            toast.error("Lỗi không gửi được OTP");
        }
    }

    const handleChange = (e) => {
        setNewCode({
            ...newCode,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, token } = await validateAccessCodeEmail(newCode);

            const { jwt, user } = await loginSessionEmail({ email, token });

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
                    <a href="#" onClick={(e) => handelsend(e)}>Send again</a>
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
