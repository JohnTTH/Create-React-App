import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPhone } from "../../redux/phoneSlice";
import firebase from "../../firebase";
import "./Global.scss"
import axios from "axios";

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
            const res = await axios.post("http://localhost:4000/login-phone", getPhone);
            setGetPhone({ phone: "" });
            dispatch(setPhone(getPhone.phoneNumber));
            console.log(res.data)
            navigate("/confirm-phone");
        } catch (err) {
            console.error(err);
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
        </div>
    );
}

export default LoginPagePhone;
