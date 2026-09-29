import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Receipt() {
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);

  useEffect(() => {
    const storedSale = localStorage.getItem("last_sale");

    if (storedSale) {
      try {
        setSale(JSON.parse(storedSale));
      } catch (error) {
        console.error("Could not read receipt:", error);
      }
    }
  }, []);

  if (!sale) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>No receipt found</h2>

        <button onClick={() => navigate("/pos")}>
          Go to POS
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "420px",
          maxWidth: "100%",
          margin: "0 auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              marginBottom: "5px",
            }}
          >
            RetailPOS
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
            }}
          >
            Sales Receipt
          </p>
        </div>

        <hr />

        {/* SALE INFORMATION */}

        <div
          style={{
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <p>
            <strong>Invoice:</strong>{" "}
            {sale.invoice_number || "-"}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {sale.created_at
              ? new Date(sale.created_at).toLocaleString()
              : "-"}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {sale.payment_method || "-"}
          </p>
        </div>

        <hr />

        {/* ITEMS */}

        <div
          style={{
            marginTop: "20px",
          }}
        >
          {sale.items?.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <div>
                <strong>
                  {item.product_name ||
                    `Product #${item.product_id}`}
                </strong>

                <div
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  {item.quantity} × ₹
                  {Number(item.unit_price || 0).toFixed(2)}
                </div>
              </div>

              <strong>
                ₹
                {Number(item.subtotal || 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        <hr />

        {/* TOTALS */}

        <div
          style={{
            marginTop: "20px",
          }}
        >
          {/* SUBTOTAL */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>Subtotal</span>

            <span>
              ₹
              {Number(sale.subtotal || 0).toFixed(2)}
            </span>
          </div>

          {/* DISCOUNT */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>Discount</span>

            <span>
              - ₹
              {Number(sale.discount || 0).toFixed(2)}
            </span>
          </div>

          {/* TAX */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>Tax</span>

            <span>
              ₹
              {Number(sale.tax || 0).toFixed(2)}
            </span>
          </div>

          <hr />

          {/* TOTAL */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              fontSize: "22px",
            }}
          >
            <strong>Total</strong>

            <strong>
              ₹
              {Number(sale.total || 0).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#666",
          }}
        >
          <p>Thank you for shopping!</p>
          <p>RetailPOS</p>
        </div>

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: "12px",
              cursor: "pointer",
            }}
          >
            Print Receipt
          </button>

          <button
            onClick={() => navigate("/pos")}
            style={{
              flex: 1,
              padding: "12px",
              cursor: "pointer",
            }}
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;