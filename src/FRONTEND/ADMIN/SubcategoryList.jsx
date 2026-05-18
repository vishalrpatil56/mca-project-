import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaSearch, FaPlus, FaArrowLeft } from "react-icons/fa";
import "./Style/CustomerList.css";
import "./Style/CategoryList.css";

function SubcategoryList() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newSubcat, setNewSubcat] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = new URLSearchParams(location.search).get("categoryId");

  useEffect(() => {
    if (categoryId) fetchSubcategories();
    else setLoading(false);
  }, [categoryId]);

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`http://98.85.25.190:5000/categories/${categoryId}/subcategories`);
      setSubcategories(r.data);
    } catch { toast.error("Failed to load subcategories"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (subcategoryId) => {
    if (!window.confirm("Delete this subcategory and all its products?")) return;
    try {
      await axios.delete(`http://98.85.25.190:5000/subcategories/${subcategoryId}`);
      setSubcategories((prev) => prev.filter((s) => s.p_sub_cata_id !== subcategoryId));
      toast.success("Subcategory deleted");
    } catch { toast.error("Failed to delete subcategory"); }
  };

  const handleAddSubcat = async (e) => {
    e.preventDefault();
    if (!newSubcat.name.trim()) { setFormError("Subcategory name is required"); return; }
    try {
      await axios.post(`http://98.85.25.190:5000/categories/${categoryId}/subcategories`, newSubcat);
      toast.success("Subcategory added successfully");
      setNewSubcat({ name: "", description: "" });
      setShowForm(false);
      fetchSubcategories();
    } catch { toast.error("Failed to add subcategory"); }
  };

  const filtered = subcategories.filter((s) =>
    (s.p_sub_cata_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="main-content">
        <button className="btn-back-link" onClick={() => navigate("/categorylist")}>
          <FaArrowLeft size={12} /> Back to Categories
        </button>

        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">🏷️ Subcategories</h1>
            <p className="admin-page-subtitle">Category ID: {categoryId} — {subcategories.length} subcategories</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="admin-search-box">
              <FaSearch className="admin-search-icon" />
              <input type="text" placeholder="Search subcategories..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary-admin" onClick={() => setShowForm((v) => !v)}>
              <FaPlus size={12} /> {showForm ? "Cancel" : "Add Subcategory"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="admin-inline-form">
            <h3>Add New Subcategory</h3>
            {formError && <div className="admin-alert-error" style={{ marginBottom: 12 }}>{formError}</div>}
            <form onSubmit={handleAddSubcat} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text" className="form-input" placeholder="Subcategory name *"
                value={newSubcat.name} onChange={(e) => { setNewSubcat((p) => ({ ...p, name: e.target.value })); setFormError(""); }}
                style={{ flex: 1, minWidth: 200 }}
              />
              <input
                type="text" className="form-input" placeholder="Description (optional)"
                value={newSubcat.description} onChange={(e) => setNewSubcat((p) => ({ ...p, description: e.target.value }))}
                style={{ flex: 2, minWidth: 200 }}
              />
              <button type="submit" className="btn-primary-admin">Add</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="admin-loading">Loading subcategories...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subcategory Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                    {search ? "No subcategories match your search" : "No subcategories found. Add one above."}
                  </td></tr>
                ) : filtered.map((s, idx) => (
                  <tr key={s.p_sub_cata_id}>
                    <td className="td-muted">{idx + 1}</td>
                    <td className="td-bold">{s.p_sub_cata_name}</td>
                    <td style={{ color: "#6b7280" }}>{s.p_sub_cata_description || <span style={{ color: "#d1d5db" }}>—</span>}</td>
                    <td>
                      <button className="btn-delete-sm" onClick={() => handleDelete(s.p_sub_cata_id)}>
                        <FaTrash size={12} /> Delete
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
}

export default SubcategoryList;
