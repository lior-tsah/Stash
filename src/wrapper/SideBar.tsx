import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import type { ReactNode } from "react";
import "./Wrapper.css";

const SideBar = () => {
  const location = useLocation();

  const menuItems: { path: string; label: string; icon: ReactNode }[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <DashboardOutlinedIcon fontSize="medium" />,
    },
    {
      path: "/bills",
      label: "Bills",
      icon: <ReceiptLongOutlinedIcon fontSize="medium" />,
    },
  ];

  return (
    <div className="side-bar">
      <div className="logo-container">
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#0c1f3a" }}>
          Fin
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #0078ff 0%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          Box
        </div>
      </div>

      <div className="side-bar-icons">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <Tooltip title={item.label} placement="right" arrow>
                <div
                  className={isSelected ? "selected-item" : "item"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "center",
                    padding: "8px",
                    borderRadius: "8px",
                    width: "fit-content",
                    margin: "0 auto",
                    color: isSelected ? "#fff" : undefined,
                  }}
                >
                  {item.icon}
                </div>
              </Tooltip>
            </Link>
          );
        })}
      </div>

      <div className="side-bar-icons bottom">
        {/* Add any bottom items here if needed  */}
      </div>
    </div>
  );
};

export default SideBar;
