import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { getMe } from "../../utils/apiReader";

function RootLayout() {
  const [hasToken] = useState(() => Boolean(localStorage.getItem("jwt")));
  const [authUser, setAuthUser] = useState(null);

  const [authReady, setAuthReady] = useState(() => !hasToken);

  useEffect(() => {
    if (!hasToken) return;

    getMe()
      .then((me) => setAuthUser(me))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthReady(true));
  }, [hasToken]);

  return <Outlet context={{ authUser, setAuthUser, authReady }} />;
}

export default RootLayout;
