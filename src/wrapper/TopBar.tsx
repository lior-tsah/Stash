import Logout from "../assets/file.svg";
import Logo from "../assets/logo.svg";

import "./Wrapper.css";
import UserAccount from "./UserAccount";

import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router";
interface TopBarProps {
  title: string;
}

const Topbar: React.FC<TopBarProps> = ({ title }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    navigate("/login");
    // googleLogout();
    // try {
    //   const res = await logout({userId: user.userId});
    //   resetContext();
    //   dispatch(
    //     resetToken()
    //   );
    //   // localStorage.setItem("user", JSON.stringify({}));
    // } catch (e) {
    //   console.log(e);
    // } finally {
    //   navigate("/");
    // }
  };

  return (
    <>
      <div className="navbar">
        <div className="logo-title-container">
          <img src={Logo} alt="logp" width={220} />
          <label className="tb-title">{title}</label>
        </div>
        <div className="div">
          {/* <button
            className="button-instance"
            
          >
            Discover
          </button> */}
          {/* <img
            className="img"
            alt="Notifications"
            src={Notifications}
            onClick={() => navigate("/assessment")}
          /> */}
          <UserAccount />
          <IconButton onClick={() => handleLogout()}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};
export default Topbar;
