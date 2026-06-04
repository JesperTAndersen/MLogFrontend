import { Outlet, useLocation, useParams } from "react-router";
import { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import NavBar from "./NavBar";
import { useAuth } from "../../context/authContext";
import styles from "./Header.module.css";

function getUserInitials(authReady, authUser) {
  if (!authReady) return "…";
  if (!authUser) return "G";

  const first = String(authUser.firstName ?? "").trim();
  const last = String(authUser.lastName ?? "").trim();

  const firstInitial = first ? first[0].toUpperCase() : "";
  const lastInitial = last ? last[0].toUpperCase() : "";

  const initials = `${firstInitial}${lastInitial}`.trim();
  return initials || "U";
}

function getUserLabel(authReady, authUser) {
  if (!authReady) return "Loading user";
  if (!authUser) return "Guest";
  const first = String(authUser.firstName ?? "").trim();
  const last = String(authUser.lastName ?? "").trim();
  const fullName = `${first} ${last}`.trim();
  return fullName || "User";
}

function getPageTitleFromPath(pathname, authUser, id) {
  if (pathname === "/assets") return "Assets";
  if (pathname === "/employees") return "Employees";
  if (pathname === "/employees/me") return "Your Profile";
  if (pathname === "/logs") return "Search Log";
  if (pathname === "/assets/create") return "Create Asset";
  if (pathname === "/employees/create") return "Create Employee";

  if (id && pathname === `/employees/${id}`) {
    return authUser?.id === Number(id) ? "Your Profile" : "Employee Profile";
  }
  if (pathname.startsWith("/assets/") && pathname.endsWith("/logs")) {
    return "Asset Logs";
  }
  if (pathname.startsWith("/employees/") && pathname.endsWith("/logs")) {
    return `Logs by Employee #${id}`;
  }
  if (pathname.startsWith("/assets/") && pathname.endsWith("/createlog")) {
    return "Create Log";
  }

  return null;
}

function Header() {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, authReady } = useAuth();
  const { pathname } = useLocation();

  const userInitials = getUserInitials(authReady, authUser);
  const userLabel = getUserLabel(authReady, authUser);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const pageTitle = getPageTitleFromPath(pathname, authUser, id);

  return (
    <>
      <div className={styles.shell}>
        <NavBar
          userInitials={userInitials}
          userLabel={userLabel}
          onToggle={toggleMenu}
          pageTitle={pageTitle}
        />
        <DrawerMenu isMenuOpen={isMenuOpen} onClose={closeMenu} />
      </div>
      <Outlet />
    </>
  );
}

export default Header;
