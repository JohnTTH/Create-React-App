import "./Dashboard.scss";
import { HiOutlineBell,HiUser } from "react-icons/hi2";
import { NavLink } from "react-router-dom";

function DashboardPage({ children }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2></h2>
        <ul>
          <li><NavLink to={"/employ"} className={({isActive  }) =>isActive  ? "active" : "" }>Manage Employee</NavLink></li>
          <li><NavLink to={"/task"}className={({isActive  }) =>isActive  ? "active" : "" }>Manage Task</NavLink></li>
          <li><NavLink to={"/message"} className={({isActive  }) =>isActive  ? "active" : "" }>Message</NavLink></li>
        </ul>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-notification">
            <div className="notification-icon">
              <HiOutlineBell className="bell-notification" />
              <span className="notification-badge">3</span>
            </div>
            <div className="user-profile">
              <HiUser className="user-dashboard"/>
            </div>
          </div>
        </div>
      <div className="dashboard-body">
          {children}
        </div>
      </div>
    </div>

  );
}

export default DashboardPage;