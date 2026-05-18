import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { removeToken } from "../utils/apiClient";
import { getMe } from "../utils/employeeApi";

export default function AuthProvider({ children }) {
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

  function hasRole(requiredRole) {
    if (!authUser) return false;
    const roleHierarchy = {
      ADMIN: ["ADMIN", "MANAGER", "TECHNICIAN", "AUTHENTICATED"],
      MANAGER: ["MANAGER", "TECHNICIAN", "AUTHENTICATED"],
      TECHNICIAN: ["TECHNICIAN", "AUTHENTICATED"],
      AUTHENTICATED: ['AUTHENTICATED']
    };
    const userRoles = roleHierarchy[authUser.role] || [];
    return userRoles.includes(requiredRole);
  }

  useEffect(() => {
    if (!hasToken) return;

    getMe()
      .then((me) => setAuthUser(me))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthReady(true));
  }, [hasToken]);

  return (
    <AuthContext.Provider
      value={{ authUser, authReady, login, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}