import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { toast } from "react-toastify";
import { FaTrash, FaSearch } from "react-icons/fa";
import "./Style/CustomerList.css";

const ComplainList = () => {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/complainlist")
      .then((r) => setComplains(r.data))
      .catch(() => toast.error("Failed to load complaints"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`/complain/${id}`);
      setComplains((prev) => prev.filter((c) => c.complain_id !== id));
      toast.success("Complaint deleted");
    } catch { toast.error("Failed to delete complaint"); }
  };

  const filtered = complains.filter((c) =>
    String(c.complain_id).includes(search) ||
    (c.complain_text || "").toLowerCase().includes(search.toLowerCase()) ||
    String(c.customer_id || "").includes(search)
  );

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">📋 Complaint Management</h1>
            <p className="admin-page-subtitle">{complains.length} total complaints</p>
          </div>
          <div className="admin-search-box">
            <FaSearch className="admin-search-icon" />
            <input type="text" placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading complaints...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Complaint ID</th>
                  <th>Complaint</th>
                  <th>Customer ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No complaints found</td></tr>
                ) : filtered.map((c, idx) => (
                  <tr key={c.complain_id}>
                    <td className="td-muted">{idx + 1}</td>
                    <td className="td-bold">#{c.complain_id}</td>
                    <td style={{ maxWidth: 300 }}>{c.complain_text}</td>
                    <td>{c.customer_id}</td>
                    <td>
                      <span className={c.status === "Resolved" ? "badge-resolved" : "badge-pending"}>
                        {c.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <button className="btn-delete-sm" onClick={() => handleDelete(c.complain_id)}>
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

export default ComplainList;
