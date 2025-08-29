import {Routes, Route } from "react-router-dom";
import LoginPagePhone from "./pages/adminpage/LoginPagePhone";
import ConfirmPagePhone from "./pages/adminpage/ConfirmPagePhone";
import DashboardPage from "./pages/adminpage/DashboardPage";
import MessagePageAdmin from "./pages/adminpage/MessagePageAdmin";
import TaskManager from "./pages/adminpage/TaskManagerPage";
import FormEmployPageAdmin from "./pages/adminpage/FormEmployPageAdmin";
import EmployPageAmin from "./pages/adminpage/EmployPageAmin";
import ConfirmPageEmail from "./pages/employpage/ConfirmPageEmail";
import LoginPageEmail from "./pages/employpage/LoginPageEmail";
import MessageEmploy from "./pages/employpage/MessPageEmploy";
import DashboardEmploy from "./pages/employpage/DashboardEmploy";

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
