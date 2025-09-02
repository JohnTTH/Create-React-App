import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPhone } from "../../redux/phoneSlice";
import "../style/Global.scss"
import { ToastContainer, toast } from "react-toastify";
import { loginWithPhone } from "../api/authApi";

function LoginPagePhone() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [getPhone, setGetPhone] = useState({
        phoneNumber: "",
    })

    const handleChange = (e) => {
        setGetPhone({
            ...getPhone,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginWithPhone(getPhone);
            setGetPhone({ phone: "" });
            dispatch(setPhone(getPhone.phoneNumber));
            toast.success("Gửi OTP thành công");
            setTimeout(() => {
                navigate("/confirm-phone");
            }, 3000);
        } catch {
            toast.error("Lỗi không gửi được OTP");
        }
    };

    return (
        <div className="container-login">
            <div className="content-login">
                <div className="back-button">
                    <a href="/">
                        <BsArrowLeft />
                        <span>Back</span>
                    </a>
                </div>
                <div className="text-login">
                    <h2>Sign In</h2>
                    <span>Please enter your phone to sign in</span>
                </div>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Your Phone Number"
                        value={getPhone.phoneNumber}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn-next">Next</button>
                </form>
                <p>passwordless authentication method.</p>
                <div className="footer-login">
                    <span>Don't having account? </span>
                    <a href="#">Sign Up</a>
                </div>
                <div id="sign-in-button"></div>
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

export default LoginPagePhone;
