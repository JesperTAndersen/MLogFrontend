import { Outlet, useLocation } from "react-router";
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

function getPageTitleFromPath(pathname) {
  if (pathname === "/assets") return "Assets";
  if (pathname === "/employees") return "Employees";
  if (pathname === "/users/me") return "Profile";
  if (pathname.startsWith("/assets/") && pathname.endsWith("/logs")) {
    return "Asset Logs";
  }

  return null;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, authReady } = useAuth();
  const { pathname } = useLocation();

  const userInitials = getUserInitials(authReady, authUser);
  const userLabel = getUserLabel(authReady, authUser);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const pageTitle = getPageTitleFromPath(pathname);

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
