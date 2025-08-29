import { useEffect, useState } from "react";
import axios from "axios";
import DashboardPage from "./DashboardPage";
import "../style/EmployPage.scss";
import { GoPlus } from "react-icons/go";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import FormEmployPageAdmin from "./FormEmployPageAdmin";
import { ToastContainer, toast } from "react-toastify";

function EmployPageAmin() {
    const [openForm, setOpenForm] = useState(false);
    const [user, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:4000/GetEmployee/Employee");
                setUsers(res.data.employees);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/DeleteEmployee/${id}`);
            toast.success("Xóa thành công")
            setUsers((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            toast.error("Lỗi không xóa được!!")
        }
    }

    return (
        <>
            <DashboardPage >
                {openForm && (
                    <>
                        <div
                            className="overlay"
                            onClick={() => setOpenForm(false)}
                        ></div>
                        <div className="form-popup">
                            <FormEmployPageAdmin setOpenForm={setOpenForm} />
                        </div>
                    </>
                )}

                <div className="container-employee">
                    <h2>Manage Employee</h2>
                    <div className="employee-header">
                        <h3><span>{user.length}</span> Employee</h3>
                        <div className="employee-actions">
                            <button className="btn-add-employee" onClick={() => { setOpenForm(true) }}> <GoPlus /> Add Employee</button>
                            <button className="btn-Fillter-employee"> <HiOutlineMagnifyingGlass />Fillter</button>
                        </div>
                    </div>
                    <div className="employee-body">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "200px", fontWeight: 400 }}>Employee Name</th>
                                    <th style={{ width: "500px", fontWeight: 400 }}>Email</th>
                                    <th style={{ width: "200px", fontWeight: 400 }}>Status</th>
                                    <th style={{ fontWeight: 400 }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td><span id={item.used === true ? "Active" : "Inactive"}>{item.used === true ? "Active" : "Inactive"}</span></td>
                                        <td>
                                            <button className="btn-edit">Edit</button>
                                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            </DashboardPage>
        </>
    );
}

export default EmployPageAmin;