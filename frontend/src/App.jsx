import POS from "./pages/POS";
import Receipt from "./pages/Receipt";
import SalesHistory from "./pages/SalesHistory";
import Login from "./pages/Login";

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