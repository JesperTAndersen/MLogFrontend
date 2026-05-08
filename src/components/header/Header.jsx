import { Outlet, useOutletContext } from "react-router";
import { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import NavBar from "./NavBar";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, setAuthUser, authReady } = useOutletContext();

  const username = authReady ? (authUser ? authUser.firstName : "Guest") : "…";

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <NavBar username={username} onToggle={toggleMenu} />
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
