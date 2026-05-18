import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { toast } from "react-toastify";
import { FaTrash, FaSearch } from "react-icons/fa";
import "./Style/CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/customerslist")
      .then((r) => setCustomers(r.data))
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  const deleteCustomer = async (userId) => {
    if (!window.confirm("Delete this customer account? This cannot be undone.")) return;
    try {
      await axios.delete(`/customer/${userId}`);
      setCustomers((prev) => prev.filter((c) => c.user_id !== userId));
      toast.success("Customer deleted successfully");
    } catch { toast.error("Failed to delete customer"); }
  };

  const filtered = customers.filter((c) =>
    (c.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.user_email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.user_contact || "").includes(search)
  );

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">👥 Customer Management</h1>
            <p className="admin-page-subtitle">{customers.length} registered customers</p>
          </div>
          <div className="admin-search-box">
            <FaSearch className="admin-search-icon" />
            <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading customers...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No customers found</td></tr>
                ) : filtered.map((customer, idx) => (
                  <tr key={customer.user_id}>
                    <td className="td-muted">{idx + 1}</td>
                    <td className="td-bold">{customer.user_name}</td>
                    <td>{customer.user_contact}</td>
                    <td>{customer.user_email}</td>
                    <td>
                      <button className="btn-delete-sm" onClick={() => deleteCustomer(customer.user_id)} title="Delete customer">
                        <FaTrash size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerList;
