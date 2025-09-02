import "../style/Global.scss"
import { BsArrowLeft } from "react-icons/bs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginWithPhone,validateAccessCodePhone, loginSessionPhone } from "../api/authApi"; 

function ConfirmPagePhone() {
    const phone = useSelector((state) => state.phone.value);
        const [dataPhone, setDataPhone] = useState({
        phoneNumber: phone,
    })
    const navigate = useNavigate();
    const [newcode, setNewCode] = useState({
        phone: phone,
        code: ""
    })

    const handleChange = (e) => {
        setNewCode({
            ...newcode,
            [e.target.name]: e.target.value
        });
    };

        const handleSendPhone = async (e) => {
            e.preventDefault();
            try {
                await loginWithPhone(dataPhone);
                setDataPhone({ phoneNumber: phone });
                toast.success("Gửi OTP thành công");
            } catch {
                toast.error("Lỗi không gửi được OTP");
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { phone, token } = await validateAccessCodePhone(newcode);

            const { jwt, user } = await loginSessionPhone({ phone, token });

            localStorage.setItem("jwt", jwt);
            localStorage.setItem("idadmin", user.id);
            setNewCode({ code: "", phone: phone });

            toast.success("Xác thực OTP thành công");
            setTimeout(() => {
                navigate("/employ");
            }, 3000);
        } catch (err) {
            toast.error("Xác thực OTP thất bại");
        }
    };

    return (
        <div className="container-login">
            <div className="content-login">
                <div className="back-button">
                    <a href="/login-phone">
                        <BsArrowLeft />
                        <span>Back</span>
                    </a>
                </div>
                <div className="text-login">
                    <h2>Phone Verification</h2>
                    <span>Please enter your code that send to your phone</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="code" placeholder="Enter Your code" value={newcode.code} onChange={handleChange} />
                    <button className="btn-next">Submit</button>
                </form>
                <div className="footer-login">
                    <span>Code not receive?</span>
                    <a href="#" onClick={(e)=> handleSendPhone(e)}>Send again</a>
                </div>
            </div>
            <div id="recaptcha-container"></div>
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

export default ConfirmPagePhone;
