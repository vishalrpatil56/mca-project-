import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { toast } from "react-toastify";
import { FaTrash, FaSearch } from "react-icons/fa";
import "./Style/CustomerList.css";

const ServiceProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://98.85.25.190:5000/serviceproviderslist")
      .then((r) => setProviders(r.data))
      .catch(() => toast.error("Failed to load service providers"))
      .finally(() => setLoading(false));
  }, []);

  const deleteProvider = async (id) => {
    if (!window.confirm("Delete this service provider? This cannot be undone.")) return;
    try {
      await axios.delete(`http://98.85.25.190:5000/serviceprovider/${id}`);
      setProviders((prev) => prev.filter((p) => p.serviceprovider_id !== id));
      toast.success("Service provider deleted successfully");
    } catch { toast.error("Failed to delete service provider"); }
  };

  const filtered = providers.filter((p) =>
  (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
  (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
  (p.mobile || "").includes(search) ||
  (p.address || "").toLowerCase().includes(search.toLowerCase())
);

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">🔧 Service Provider Management</h1>
            <p className="admin-page-subtitle">{providers.length} registered service partners</p>
          </div>
          <div className="admin-search-box">
            <FaSearch className="admin-search-icon" />
            <input type="text" placeholder="Search by name, email, service..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading service providers...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No service providers found</td></tr>
                ) : filtered.map((p, idx) => (
                  <tr key={p.serviceprovider_id}>
  <td className="td-muted">{idx + 1}</td>

  <td className="td-bold">
    {p.name}
  </td>

  <td>
    {p.mobile}
  </td>

  <td>
    {p.email}
  </td>

  <td>
    {p.address || <span style={{ color: "#d1d5db" }}>—</span>}
  </td>

  <td>
    <button
      className="btn-delete-sm"
      onClick={() => deleteProvider(p.serviceprovider_id)}
    >
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

export default ServiceProviderList;
