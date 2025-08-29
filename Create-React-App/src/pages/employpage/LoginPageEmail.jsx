import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../style/Global.scss"
import { useState } from "react";
import { setEmail } from "../../redux/emailSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

function LoginPageEmail() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [dataEmail, setDataEmail] = useState({
        email: "",
    })

    const handleChange = (e) => {
        setDataEmail({
            ...dataEmail,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/login-email", dataEmail);
            setDataEmail({ email: "" });

            toast.success("Gửi OTP thành Công");
            
            dispatch(setEmail(dataEmail.email));

            setTimeout(() => {
                navigate("/confirm-email");
            }, 3000);
        } catch{
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
                    <span>Please enter your email to sign in</span>
                </div>
                <form onSubmit={handleLogin}>
                    <input type="text" name="email" placeholder="Your Email Address" value={dataEmail.email} onChange={handleChange} />
                    <button type="submit" className="btn-next">Next</button>
                </form>

                <p>passworldless authentication methods.</p>
                <div className="footer-login">
                    <span>Don't having account? </span>
                    <a href="">Sign Up</a>
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

export default LoginPageEmail;
