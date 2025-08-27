import { BsArrowLeft } from "react-icons/bs";
import "./Global.scss"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
            // 1. Xác thực OTP
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

            // 3. Lưu JWT và thông tin user  
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("userId", user.id);

            setNewCode({ code: "", email: email });
            navigate("/messemploy");
        } catch (err) {
            console.error(err);
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
        </div>
    );
}

export default ConfirmPageEmail;
