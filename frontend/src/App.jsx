import POS from "./pages/POS";
import Receipt from "./pages/Receipt";
import SalesHistory from "./pages/SalesHistory";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminSuppliers from "./pages/AdminSuppliers";
import AdminStaff from "./pages/AdminStaff";
import AdminReturns from "./pages/AdminReturns";
import AdminReports from "./pages/AdminReports";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const isLoggedIn = !!localStorage.getItem("access_token");

  return (
    <BrowserRouter>
      <Routes>
          <Route
          path="/admin"
          element={
          isLoggedIn ? (
          <Admin />
          ) : (
          <Navigate to="/login" replace />
          )
        }
        />
        <Route
          path="/admin/staff"
          element={
          isLoggedIn ? (
          <AdminStaff />
            ) : (
            <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/returns"
          element={
            isLoggedIn ? (
              <AdminReturns />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/reports"
          element={
            isLoggedIn ? (
              <AdminReports />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Admin Products */}
        {/* Admin Suppliers */}
        <Route
          path="/admin/suppliers"
          element={
            isLoggedIn ? (
              <AdminSuppliers />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Staff */}
        {/* Admin Products */}
        <Route
          path="/admin/products"
          element={
            isLoggedIn ? (
              <AdminProducts />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected POS */}
        <Route
          path="/pos"
          element={
            isLoggedIn ? (
              <POS />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Receipt */}
        <Route
          path="/receipt"
          element={
            isLoggedIn ? (
              <Receipt />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Sales History */}
        <Route
          path="/sales"
          element={
            isLoggedIn ? (
              <SalesHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to={isLoggedIn ? "/pos" : "/login"}
              replace
            />
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate
              to={isLoggedIn ? "/pos" : "/login"}
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;