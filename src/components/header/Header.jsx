import { Outlet, useLocation, useOutletContext } from "react-router";
import { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import NavBar from "./NavBar";

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
  const { authUser, setAuthUser, authReady } = useOutletContext();
  const { pathname } = useLocation();

  const username = authReady ? (authUser ? authUser.firstName : "Guest") : "…";

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const pageTitle = getPageTitleFromPath(pathname);

  return (
    <>
      <NavBar username={username} onToggle={toggleMenu} pageTitle={pageTitle} />
      <DrawerMenu
        isMenuOpen={isMenuOpen}
        onClose={closeMenu}
        authUser={authUser}
        setAuthUser={setAuthUser}
      />
      <Outlet context={{ authUser, setAuthUser, authReady }} />
    </>
  );
}

export default Header;
