import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import EmployeeList from "./pages/EmployeeList";
import Login from "./pages/Login";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import UserProfile from "./pages/UserProfile";
import Header from "./components/header/Header";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import CreateLog from "./components/logsComponents/CreateLog";

function App() {
  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="app-content">
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Header />}>
                  <Route path="assets" element={<AssetList />} />
                  <Route path="employees" element={<EmployeeList />} />
                  <Route path="assets/:id/logs" element={<AssetDetail />} />
                  <Route
                    element={<ProtectedRoute requiredRole={"TECHNICIAN"} />}
                  >
                    <Route
                      path="assets/:id/createlog"
                      element={<CreateLog />}
                    />
                  </Route>
                  <Route path="users/me" element={<UserProfile />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
