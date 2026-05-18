import { NavLink } from "react-router";
import styles from "./DrawerMenu.module.css";
import { useAuth } from "../../context/authContext";

function DrawerMenu({ isMenuOpen, onClose }) {
  const { logout } = useAuth();

  function exitApp() {
    logout();
    onClose();
  }

  return (
    <>
      {isMenuOpen && (
        <nav className={styles.menu}>
          <NavLink to="/assets" onClick={onClose}>
            Assets
          </NavLink>
          <NavLink to="/employees/me" onClick={onClose}>
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
