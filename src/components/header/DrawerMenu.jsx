import { NavLink } from "react-router";
import styles from "./DrawerMenu.module.css";
import { useAuth } from "../../context/authContext";

function DrawerMenu({ isMenuOpen, onClose }) {
  const { logout, hasRole } = useAuth();

  const canViewManagerRoutes = hasRole?.("MANAGER") === true;

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
          <NavLink to="/employees" end onClick={onClose}>
            Employee List
          </NavLink>

          {canViewManagerRoutes ? (
            <>
              <NavLink to="/assets/create" onClick={onClose}>
                Create Asset
              </NavLink>
              <NavLink to="/employees/create" onClick={onClose}>
                Create Employee
              </NavLink>
            </>
          ) : null}

          <NavLink to="/login" onClick={exitApp}>
            Logout
          </NavLink>
        </nav>
      )}
    </>
  );
}

export default DrawerMenu;
