import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SalesHistory() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("last_sale");

    navigate("/login");
  };

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/sales/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSales(response.data);
    } catch (err) {
      console.error("SALES HISTORY ERROR:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not load sales history."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>
              Sales History
            </h1>

            <p style={{ color: "#666" }}>
              View completed sales and transactions
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              onClick={() => navigate("/pos")}
              style={{
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Back to POS
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#b00020",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <p>Loading sales...</p>
        ) : sales.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              textAlign: "center",
              borderRadius: "8px",
            }}
          >
            <h3>No sales found</h3>

            <p>
              Create a sale from the POS to see it here.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              overflow: "auto",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f0f1f3",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "14px" }}>
                    Invoice
                  </th>

                  <th style={{ padding: "14px" }}>
                    Date
                  </th>

                  <th style={{ padding: "14px" }}>
                    Payment
                  </th>

                  <th style={{ padding: "14px" }}>
                    Total
                  </th>

                  <th style={{ padding: "14px" }}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale.id}
                    style={{
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      <strong>
                        {sale.invoice_number}
                      </strong>
                    </td>

                    <td style={{ padding: "14px" }}>
                      {sale.created_at
                        ? new Date(
                            sale.created_at
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {sale.payment_method || "-"}
                    </td>

                    <td style={{ padding: "14px" }}>
                      ₹
                      {Number(
                        sale.total || 0
                      ).toFixed(2)}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {sale.status || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesHistory;