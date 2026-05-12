import { createContext, useEffect, useContext, useState } from "react";
import { getMe, removeToken } from "../utils/apiReader";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [hasToken] = useState(() => Boolean(localStorage.getItem("jwt")));
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(() => !hasToken);

  function login(user) {
    setAuthUser(user);
    setAuthReady(true);
  }

  function logout() {
    removeToken();
    setAuthUser(null);
  }

  useEffect(() => {
    if (!hasToken) return;

    getMe()
      .then((me) => setAuthUser(me))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthReady(true));
  }, [hasToken]);

  return (
    <AuthContext.Provider value={{ authUser, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;

export function useAuth() {
  return useContext(AuthContext);
}
