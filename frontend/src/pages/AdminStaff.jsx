import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

function AdminStaff() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("access_token");

  const loadStaff = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaff(response.data);
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
    loadStaff();
  }, []);

  const createStaff = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/staff/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setShowForm(false);
      loadStaff();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to create staff member"
      );
    }
  };

  const deactivateStaff = async (id) => {
    if (!window.confirm("Deactivate this staff member?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadStaff();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to deactivate staff member"
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
              fontSize: "14px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            ← Back to Admin
          </button>

          <h2 style={{ margin: 0 }}>
            Staff Management
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#d1d5db",
              fontSize: "14px",
            }}
          >
            Manage staff accounts
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "14px",
          }}
        >
          {showForm ? "Cancel" : "+ Add Staff"}
        </button>

        {showForm && (
          <form
            onSubmit={createStaff}
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: "#16a34a",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Staff
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading staff...</p>
        ) : staff.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            No staff members found.
          </div>
        ) : (
          staff.map((member) => (
            <div
              key={member.id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ margin: "0 0 5px" }}>
                {member.name}
              </h3>

              <p
                style={{
                  margin: "0 0 4px",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                {member.email}
              </p>

              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "13px",
                  color: member.is_active
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {member.is_active
                  ? "Active"
                  : "Inactive"}
              </p>

              {member.is_active && (
                <button
                  onClick={() =>
                    deactivateStaff(member.id)
                  }
                  style={{
                    padding: "9px 12px",
                    border: "none",
                    borderRadius: "7px",
                    background: "#dc2626",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Deactivate
                </button>
              )}
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
  marginBottom: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};

export default AdminStaff;