import {Routes, Route } from "react-router-dom";
import LoginPagePhone from "./pages/login/LoginPagePhone";
import LoginPageEmail from "./pages/login/LoginPageEmail";
import ConfirmPageEmail from "./pages/login/ConfirmPageEmail";
import ConfirmPagePhone from "./pages/login/ConfirmPagePhone";
import DashboardPage from "./pages/adminpage/DashboardPage";
import EmployPageAmin from "./pages/adminpage/EmployPageAmin";
import FormEmployPageAdmin from "./pages/adminpage/FormEmployPageAdmin";
import MessagePageAdmin from "./pages/adminpage/MessagePageAdmin";
import MessageEmploy from "./pages/adminpage/MessPageEmploy";
import TaskManager from "./pages/adminpage/TaskManagerPage";
import DashboardEmploy from "./pages/adminpage/DashboardEmploy";

function App() {
  return (
      <Routes>
        <Route path="/" element={< LoginPagePhone/>} />
        <Route path="/login-email" element={< LoginPageEmail/>} />
        <Route path="/confirm-email" element={<ConfirmPageEmail />} />
        <Route path="/confirm-phone" element={<ConfirmPagePhone />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employ" element={<EmployPageAmin />} />
        <Route path="/form-employ" element={<FormEmployPageAdmin />} />
        <Route path="/message" element={<MessagePageAdmin />} />
        <Route path="/messemploy" element={<MessageEmploy />} />
        <Route path="/task" element={<TaskManager />} />
        <Route path="/dashboardemploy" element={<DashboardEmploy />} />
      </Routes>
  );
}

export default App;
