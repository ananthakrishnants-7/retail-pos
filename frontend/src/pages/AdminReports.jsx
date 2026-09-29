import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function AdminReports() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const loadSales = async () => {
      try {
        const response = await axios.get(`${API_URL}/sales/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSales(response.data);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total),
    0
  );

  const cashSales = sales
    .filter((sale) => sale.payment_method === "CASH")
    .reduce((sum, sale) => sum + Number(sale.total), 0);

  const cardSales = sales
    .filter((sale) => sale.payment_method === "CARD")
    .reduce((sum, sale) => sum + Number(sale.total), 0);

  const upiSales = sales
    .filter((sale) => sale.payment_method === "UPI")
    .reduce((sum, sale) => sum + Number(sale.total), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#111827",
            color: "white",
            padding: "18px",
            borderRadius: "14px",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={() => navigate("/admin")}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: 0,
              marginBottom: "10px",
            }}
          >
            ← Back to Admin
          </button>

          <h2 style={{ margin: 0 }}>
            Reports & Ledger
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#d1d5db",
              fontSize: "14px",
            }}
          >
            Sales and transaction overview
          </p>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <SummaryCard
                title="Transactions"
                value={sales.length}
              />

              <SummaryCard
                title="Total Sales"
                value={`₹${totalSales.toFixed(2)}`}
              />

              <SummaryCard
                title="Cash"
                value={`₹${cashSales.toFixed(2)}`}
              />

              <SummaryCard
                title="Card"
                value={`₹${cardSales.toFixed(2)}`}
              />

              <SummaryCard
                title="UPI"
                value={`₹${upiSales.toFixed(2)}`}
              />
            </div>

            <h3>Transaction Ledger</h3>

            {sales.length === 0 ? (
              <div
                style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                No transactions found.
              </div>
            ) : (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  style={{
                    background: "white",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <strong>
                      {sale.invoice_number}
                    </strong>

                    <strong>
                      ₹{Number(sale.total).toFixed(2)}
                    </strong>
                  </div>

                  <p style={textStyle}>
                    Payment: {sale.payment_method}
                  </p>

                  <p style={textStyle}>
                    Status: {sale.status}
                  </p>

                  <p style={textStyle}>
                    {new Date(
                      sale.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "6px",
          fontSize: "18px",
          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const textStyle = {
  margin: "6px 0",
  fontSize: "13px",
  color: "#6b7280",
};

export default AdminReports;