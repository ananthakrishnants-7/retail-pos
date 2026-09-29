import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminProducts() {
  const navigate = useNavigate();

  const emptyForm = {
    sku: "",
    name: "",
    category: "",
    description: "",
    price: "",
    cost_price: "",
    stock_quantity: "",
    reorder_level: "5",
    supplier_id: "",
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem(
      "access_token"
    )}`,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/", {
        headers: getHeaders(),
      });

      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Could not load products."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const data = {
        sku: form.sku,
        name: form.name,
        category: form.category,
        description: form.description || null,
        price: Number(form.price),
        cost_price: Number(form.cost_price),
        stock_quantity: Number(form.stock_quantity),
        reorder_level: Number(form.reorder_level),
        supplier_id: form.supplier_id
          ? Number(form.supplier_id)
          : null,
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          {
            ...data,
            is_active: true,
          },
          {
            headers: getHeaders(),
          }
        );
      } else {
        await api.post("/products/", data, {
          headers: getHeaders(),
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not save product."
      );
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: product.price,
      cost_price: product.cost_price,
      stock_quantity: product.stock_quantity,
      reorder_level: product.reorder_level,
      supplier_id: product.supplier_id || "",
    });

    setShowForm(true);
    setError("");
  };

  const deactivateProduct = async (id) => {
    const confirmed = window.confirm(
      "Deactivate this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`, {
        headers: getHeaders(),
      });

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not deactivate product."
      );
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          minHeight: "100vh",
          background: "#fff",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "#111827",
            color: "#fff",
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              Products
            </h2>

            <small
              style={{
                color: "#d1d5db",
              }}
            >
              Product Management
            </small>
          </div>

          <button
            onClick={() => navigate("/admin")}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Admin
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          {/* ERROR */}

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

          {/* ADD BUTTON */}

          {!showForm && (
            <button
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowForm(true);
              }}
              style={{
                width: "100%",
                padding: "13px",
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              + Add Product
            </button>
          )}

          {/* FORM */}

          {showForm && (
            <form onSubmit={handleSubmit}>
              <h3>
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h3>

              {[
                ["sku", "SKU"],
                ["name", "Product Name"],
                ["category", "Category"],
                ["description", "Description"],
                ["price", "Selling Price"],
                ["cost_price", "Cost Price"],
                ["stock_quantity", "Stock Quantity"],
                ["reorder_level", "Reorder Level"],
                ["supplier_id", "Supplier ID"],
              ].map(([name, label]) => (
                <div
                  key={name}
                  style={{ marginBottom: "12px" }}
                >
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    {label}
                  </label>

                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={
                      ![
                        "description",
                        "supplier_id",
                      ].includes(name)
                    }
                    type={
                      [
                        "price",
                        "cost_price",
                        "stock_quantity",
                        "reorder_level",
                        "supplier_id",
                      ].includes(name)
                        ? "number"
                        : "text"
                    }
                    step={
                      ["price", "cost_price"].includes(
                        name
                      )
                        ? "0.01"
                        : undefined
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              ))}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {editingId
                  ? "Update Product"
                  : "Create Product"}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  background: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          )}

          {/* PRODUCT LIST */}

          {!showForm && (
            <>
              <h3>
                Products ({products.length})
              </h3>

              {loading ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "15px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <strong>
                          {product.name}
                        </strong>

                        <div
                          style={{
                            color: "#6b7280",
                            fontSize: "13px",
                            marginTop: "4px",
                          }}
                        >
                          SKU: {product.sku}
                        </div>

                        <div
                          style={{
                            marginTop: "8px",
                          }}
                        >
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              product.stock_quantity <=
                              product.reorder_level
                                ? "#b45309"
                                : "#374151",
                            marginTop: "4px",
                          }}
                        >
                          Stock:{" "}
                          {product.stock_quantity}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "12px",
                          color: product.is_active
                            ? "#15803d"
                            : "#b91c1c",
                        }}
                      >
                        {product.is_active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        onClick={() =>
                          editProduct(product)
                        }
                        style={{
                          flex: 1,
                          padding: "9px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      {product.is_active && (
                        <button
                          onClick={() =>
                            deactivateProduct(
                              product.id
                            )
                          }
                          style={{
                            flex: 1,
                            padding: "9px",
                            cursor: "pointer",
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;