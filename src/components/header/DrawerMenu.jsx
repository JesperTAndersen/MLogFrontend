import { NavLink, useOutletContext } from "react-router";
import "./DrawerMenu.css";
import { logout } from "../../../apiReader";

function DrawerMenu({ isMenuOpen, onClose }) {
  const { setAuthUser } = useOutletContext();

  function exitApp() {
    logout();
    setAuthUser(null);
    onClose();
  }

  return (
    <>
      {isMenuOpen && (
        <nav className="drawer-menu">
          <NavLink to="/assets" onClick={onClose}>
            Assets
          </NavLink>
          <NavLink to="/users/me" onClick={onClose}>
            Your Profile
          </NavLink>
          <NavLink to="/employees" onClick={onClose}>
            User List
          </NavLink>
          <NavLink to="/assets" onClick={onClose}>
            Manage Assets(PLACEHOLDER)
          </NavLink>
          <NavLink to="/assets" onClick={onClose}>
            Manager Users(PLACEHOLDER)
          </NavLink>
          <NavLink to="/login" onClick={exitApp}>
            logout
          </NavLink>
        </nav>
      )}
    </>
  );
}

export default DrawerMenu;
