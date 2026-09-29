import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminSuppliers() {
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  };

  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem(
      "access_token"
    )}`,
  });

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/suppliers/", {
        headers: headers(),
      });

      setSuppliers(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not load suppliers."
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

      if (editingId) {
        await api.put(
          `/suppliers/${editingId}`,
          form,
          {
            headers: headers(),
          }
        );
      } else {
        await api.post(
          "/suppliers/",
          form,
          {
            headers: headers(),
          }
        );
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadSuppliers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not save supplier."
      );
    }
  };

  const editSupplier = (supplier) => {
    setEditingId(supplier.id);

    setForm({
      name: supplier.name || "",
      contact_person:
        supplier.contact_person || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });

    setShowForm(true);
    setError("");
  };

  const deleteSupplier = async (id) => {
    const confirmed = window.confirm(
      "Delete this supplier?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/suppliers/${id}`, {
        headers: headers(),
      });

      await loadSuppliers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Could not delete supplier."
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
              Suppliers
            </h2>

            <small
              style={{
                color: "#d1d5db",
              }}
            >
              Supplier Management
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

          {/* ADD */}

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
              + Add Supplier
            </button>
          )}

          {/* FORM */}

          {showForm && (
            <form onSubmit={handleSubmit}>
              <h3>
                {editingId
                  ? "Edit Supplier"
                  : "Add Supplier"}
              </h3>

              {[
                ["name", "Supplier Name"],
                [
                  "contact_person",
                  "Contact Person",
                ],
                ["email", "Email"],
                ["phone", "Phone"],
                ["address", "Address"],
              ].map(([name, label]) => (
                <div
                  key={name}
                  style={{
                    marginBottom: "12px",
                  }}
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
                    required={name === "name"}
                    type={
                      name === "email"
                        ? "email"
                        : "text"
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px",
                      border:
                        "1px solid #d1d5db",
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
                  ? "Update Supplier"
                  : "Create Supplier"}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "8px",
                  background: "#fff",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          )}

          {/* LIST */}

          {!showForm && (
            <>
              <h3>
                Suppliers ({suppliers.length})
              </h3>

              {loading ? (
                <p>Loading suppliers...</p>
              ) : suppliers.length === 0 ? (
                <p>No suppliers found.</p>
              ) : (
                suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    style={{
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "15px",
                      marginBottom: "12px",
                    }}
                  >
                    <strong>
                      {supplier.name}
                    </strong>

                    {supplier.contact_person && (
                      <div
                        style={{
                          marginTop: "5px",
                          color: "#4b5563",
                        }}
                      >
                        Contact:{" "}
                        {supplier.contact_person}
                      </div>
                    )}

                    {supplier.email && (
                      <div
                        style={{
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        Email: {supplier.email}
                      </div>
                    )}

                    {supplier.phone && (
                      <div
                        style={{
                          fontSize: "14px",
                          marginTop: "4px",
                        }}
                      >
                        Phone: {supplier.phone}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        onClick={() =>
                          editSupplier(
                            supplier
                          )
                        }
                        style={{
                          flex: 1,
                          padding: "9px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteSupplier(
                            supplier.id
                          )
                        }
                        style={{
                          flex: 1,
                          padding: "9px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
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

export default AdminSuppliers;