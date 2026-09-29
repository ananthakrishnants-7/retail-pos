import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("last_sale");

    navigate("/login");
  };

  const menuItems = [
    {
      title: "Products",
      description: "Manage products and stock",
      path: "/admin/products",
    },
    {
      title: "Suppliers",
      description: "Manage suppliers",
      path: "/admin/suppliers",
    },
    {
      title: "Staff",
      description: "Manage staff accounts",
      path: "/admin/staff",
    },
    {
      title: "Returns",
      description: "Handle product returns",
      path: "/admin/returns",
    },
    {
      title: "Reports",
      description: "Sales and transaction reports",
      path: "/admin/reports",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Mobile App Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          minHeight: "100vh",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#111827",
            color: "#fff",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                RetailPOS
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#d1d5db",
                }}
              >
                Admin Portal
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px" }}>
          <h2>Dashboard</h2>

          <p style={{ color: "#6b7280" }}>
            Manage your retail business from here.
          </p>

          {/* Menu */}
          <div
            style={{
              display: "grid",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  textAlign: "left",
                  padding: "20px",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  {item.description}
                </div>
              </button>
            ))}
          </div>

          {/* Billing */}
          <button
            onClick={() => navigate("/pos")}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "14px",
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go to Billing POS
          </button>

          {/* Sales */}
          <button
            onClick={() => navigate("/sales")}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "14px",
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            View Sales History
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;