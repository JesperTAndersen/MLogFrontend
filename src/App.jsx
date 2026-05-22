import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import EmployeeList from "./pages/EmployeeList";
import Login from "./pages/Login";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";
import UserProfile from "./pages/UserProfile";
import EmployeeLogList from "./pages/EmployeeLogList";
import Header from "./components/header/Header";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import CreateLog from "./components/logsComponents/CreateLog";
import CreateAsset from "./pages/CreateAsset";
import CreateEmployee from "./pages/CreateEmployee";

function App() {
  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="app-content">
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<Login />} />

              {/* AUTHENTICATED+ */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Header />}>
                  <Route path="assets" element={<AssetList />} />
                  <Route path="assets/:id/logs" element={<AssetDetail />} />
                  <Route path="employees" element={<EmployeeList />} />
                  <Route path="employees/:id" element={<UserProfile />} />
                  <Route path="employees/me" element={<UserProfile />} />

                  {/* TECHNICIAN+ */}
                  <Route
                    element={<ProtectedRoute requiredRole={"TECHNICIAN"} />}
                  >
                    <Route
                      path="assets/:id/createlog"
                      element={<CreateLog />}
                    />
                  </Route>

                  {/* MANAGER+ */}
                  <Route element={<ProtectedRoute requiredRole="MANAGER" />}>
                    <Route path="assets/create" element={<CreateAsset />} />
                    <Route
                      path="employees/create"
                      element={<CreateEmployee />}
                    />
                    <Route
                      path="employees/:id/logs"
                      element={<EmployeeLogList />}
                    />
                  </Route>
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