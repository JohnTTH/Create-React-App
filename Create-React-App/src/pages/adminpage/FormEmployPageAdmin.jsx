import { useState } from "react";
import "./FormEmployPageAdmin.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function FormEmployPageAdmin({ setOpenForm, onAdd }) {
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        phone: "",
        email: "",
        role: "",
        address: ""
    })

    const handleChange = (e) => {
        setNewEmployee({
            ...newEmployee,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/CreateEmployee", newEmployee);
            setNewEmployee(res);
            toast.success("Thêm một nhân viên thành công");
            if (onAdd) {
                onAdd({ id: res.data.employeeId, ...newEmployee, used: false });
            }
            setTimeout(() => {
                setOpenForm(false);
            }, 3000);
        } catch (err) {
            toast.error("Không thể tạo nhân viên");

        }
    };

    return (
        <div className="container">
            <div className="container-form">
                <h1>Create Employee</h1>
                <form className="form-employ" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Employee Name</label>
                            <input type="text" id="name" name="name" value={newEmployee.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" id="phone" name="phone" value={newEmployee.phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="text" id="email" name="email" value={newEmployee.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <input type="text" id="role" name="role" value={newEmployee.role} onChange={handleChange} />
                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" className="address" value={newEmployee.address} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" onClick={(e) => handleSubmit(e)}>Create</button>
                    </div>
                </form>
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

export default FormEmployPageAdmin;
