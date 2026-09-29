import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function AdminReturns() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [returns, setReturns] = useState([]);
  const [form, setForm] = useState({
    sale_id: "",
    product_id: "",
    quantity: 1,
    reason: "",
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadData = async () => {
    try {
      const [salesResponse, returnsResponse] =
        await Promise.all([
          axios.get(`${API_URL}/sales/`, { headers }),
          axios.get(`${API_URL}/returns/`, { headers }),
        ]);

      setSales(salesResponse.data);
      setReturns(returnsResponse.data);
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

  useEffect(() => {
    loadData();
  }, []);

  const selectedSale = sales.find(
    (sale) => sale.id === Number(form.sale_id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.sale_id || !form.product_id) {
      alert("Please select a sale and product.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/returns/`,
        {
          sale_id: Number(form.sale_id),
          product_id: Number(form.product_id),
          quantity: Number(form.quantity),
          reason: form.reason || null,
        },
        { headers }
      );

      alert("Return processed successfully.");

      setForm({
        sale_id: "",
        product_id: "",
        quantity: 1,
        reason: "",
      });

      loadData();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to process return."
      );
    }
  };

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
            Product Returns
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#d1d5db",
              fontSize: "14px",
            }}
          >
            Process customer returns
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "18px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Process Return
          </h3>

          <label>Sale</label>

          <select
            value={form.sale_id}
            onChange={(e) =>
              setForm({
                ...form,
                sale_id: e.target.value,
                product_id: "",
              })
            }
            required
            style={inputStyle}
          >
            <option value="">
              Select sale
            </option>

            {sales.map((sale) => (
              <option
                key={sale.id}
                value={sale.id}
              >
                {sale.invoice_number} - ₹
                {Number(sale.total).toFixed(2)}
              </option>
            ))}
          </select>

          {selectedSale && (
            <>
              <label>Product</label>

              <select
                value={form.product_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    product_id: e.target.value,
                  })
                }
                required
                style={inputStyle}
              >
                <option value="">
                  Select product
                </option>

                {selectedSale.items.map((item) => (
                  <option
                    key={item.product_id}
                    value={item.product_id}
                  >
                    Product #{item.product_id} -
                    Qty {item.quantity}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Quantity</label>

          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
            required
            style={inputStyle}
          />

          <label>Reason</label>

          <input
            type="text"
            placeholder="Reason for return"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#dc2626",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Process Return
          </button>
        </form>

        <h3>Return History</h3>

        {loading ? (
          <p>Loading...</p>
        ) : returns.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            No returns recorded.
          </div>
        ) : (
          returns.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            >
              <strong>
                Return #{item.id}
              </strong>

              <p style={textStyle}>
                Sale ID: {item.sale_id}
              </p>

              <p style={textStyle}>
                Product ID: {item.product_id}
              </p>

              <p style={textStyle}>
                Quantity: {item.quantity}
              </p>

              <p style={textStyle}>
                Refund: ₹
                {Number(item.refund_amount).toFixed(2)}
              </p>

              <p style={textStyle}>
                Reason: {item.reason || "Not specified"}
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#16a34a",
                  fontWeight: "600",
                }}
              >
                {item.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px",
  marginTop: "6px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};

const textStyle = {
  margin: "6px 0",
  fontSize: "14px",
  color: "#4b5563",
};

export default AdminReturns;