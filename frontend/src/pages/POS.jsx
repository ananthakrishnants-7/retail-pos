import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function POS() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [showCheckout, setShowCheckout] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);

  // -------------------------
  // LOAD PRODUCTS
  // -------------------------

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError("");

      const response = await api.get("/products/");

      setProducts(response.data);
    } catch (err) {
      console.error("PRODUCT LOAD ERROR:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CART
  // -------------------------

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock_quantity) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= item.stock_quantity) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  // -------------------------
  // CALCULATIONS
  // -------------------------

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const discountAmount = Math.min(
    Number(discount) || 0,
    subtotal
  );

  const taxableAmount = subtotal - discountAmount;

  const taxAmount =
    taxableAmount * ((Number(taxRate) || 0) / 100);

  const total = taxableAmount + taxAmount;

  // -------------------------
  // CHECKOUT
  // -------------------------

  const openCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    setError("");
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    if (processingSale) {
      return;
    }

    setShowCheckout(false);
  };

  // -------------------------
  // COMPLETE SALE
  // -------------------------

  const completeSale = async () => {
  if (cart.length === 0) {
    setError("Cart is empty.");
    return;
  }

  try {
    setError("");
    setProcessingSale(true);

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    // Data expected by:
    // POST /api/sales/
    const saleData = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),

      discount: Number(discountAmount),
      tax: Number(taxAmount),
      payment_method: paymentMethod,
    };

    console.log("SENDING SALE:", saleData);

    const response = await api.post(
      "/sales/",
      saleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SALE CREATED:", response.data);

    const sale = response.data;

    // --------------------------------------------------
    // Add product names to receipt items
    // --------------------------------------------------
    const receiptSale = {
      ...sale,

      items: sale.items.map((saleItem) => {
        const product = products.find(
          (p) => p.id === saleItem.product_id
        );

        return {
          ...saleItem,
          product_name:
            product?.name || `Product #${saleItem.product_id}`,
        };
      }),
    };

    console.log("RECEIPT DATA:", receiptSale);

    // Close checkout
    setShowCheckout(false);

    // Clear cart
    setCart([]);

    // Reset checkout values
    setDiscount(0);
    setTaxRate(18);
    setPaymentMethod("CASH");

    // Refresh products so inventory reflects
    // the newly completed sale.
    await loadProducts();

    // Save the completed sale with product names
    // so Receipt.jsx can display them.
    localStorage.setItem(
      "last_sale",
      JSON.stringify(receiptSale)
    );

    // Go to receipt page
    navigate("/receipt");

  } catch (err) {
    console.error("SALE ERROR:", err);
    console.error("SALE RESPONSE:", err.response);
    console.error("SALE REQUEST:", err.request);

    setError(
      err.response?.data?.detail ||
        err.message ||
        "Could not complete sale"
    );
  } finally {
    setProcessingSale(false);
  }
};

  // -------------------------
  // UI
  // -------------------------

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f6f8",
        minHeight: "100vh",
      }}
    >
      <h1>RetailPOS</h1>

      {error && (
        <p
          style={{
            color: "red",
            background: "#ffe5e5",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        {/* ================= PRODUCTS ================= */}

        <div>
          <h2>Products</h2>

          {loading && <p>Loading products...</p>}

          {!loading && !error && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "15px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fff",
                  }}
                >
                  <h3>{product.name}</h3>

                  <p>SKU: {product.sku}</p>

                  <p>
                    Price: ₹
                    {Number(product.price).toFixed(2)}
                  </p>

                  <p>
                    Stock: {product.stock_quantity}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity <= 0}
                  >
                    {product.stock_quantity > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= CART ================= */}

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            background: "#fff",
            height: "fit-content",
          }}
        >
          <h2>Current Sale</h2>

          {cart.length === 0 && (
            <p>No items in cart.</p>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "15px 0",
              }}
            >
              <strong>{item.name}</strong>

              <p>
                ₹{Number(item.price).toFixed(2)} ×{" "}
                {item.quantity}
              </p>

              <p>
                ₹
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}
              </p>

              <button
                onClick={() =>
                  decreaseQuantity(item.id)
                }
              >
                −
              </button>

              <span
                style={{
                  margin: "0 10px",
                }}
              >
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  increaseQuantity(item.id)
                }
              >
                +
              </button>

              <button
                onClick={() =>
                  removeFromCart(item.id)
                }
                style={{
                  marginLeft: "10px",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <hr />

          <p>
            Subtotal:
            <strong>
              {" "}₹{subtotal.toFixed(2)}
            </strong>
          </p>

          <p>
            Discount:
            <strong>
              {" "}₹{discountAmount.toFixed(2)}
            </strong>
          </p>

          <p>
            Tax:
            <strong>
              {" "}₹{taxAmount.toFixed(2)}
            </strong>
          </p>

          <h2>
            Total: ₹{total.toFixed(2)}
          </h2>

          <button
            onClick={openCheckout}
            disabled={cart.length === 0}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
            }}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* ================= CHECKOUT MODAL ================= */}

      {showCheckout && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "420px",
              maxWidth: "90%",
            }}
          >
            <h2>Checkout</h2>

            <hr />

            <p>
              Subtotal: ₹{subtotal.toFixed(2)}
            </p>

            {/* DISCOUNT */}

            <label>
              Discount
            </label>

            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "15px",
              }}
            />

            {/* TAX */}

            <label>
              Tax Rate (%)
            </label>

            <input
              type="number"
              min="0"
              value={taxRate}
              onChange={(e) =>
                setTaxRate(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "15px",
              }}
            />

            <p>
              Discount: ₹
              {discountAmount.toFixed(2)}
            </p>

            <p>
              Tax: ₹
              {taxAmount.toFixed(2)}
            </p>

            <h2>
              Total: ₹{total.toFixed(2)}
            </h2>

            {/* PAYMENT */}

            <label>
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "20px",
              }}
            >
              <option value="CASH">
                Cash
              </option>

              <option value="CARD">
                Card
              </option>

              <option value="UPI">
                UPI
              </option>
            </select>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={closeCheckout}
                disabled={processingSale}
                style={{
                  flex: 1,
                  padding: "12px",
                }}
              >
                Cancel
              </button>

              <button
                onClick={completeSale}
                disabled={processingSale}
                style={{
                  flex: 1,
                  padding: "12px",
                }}
              >
                {processingSale
                  ? "Processing..."
                  : "Complete Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;