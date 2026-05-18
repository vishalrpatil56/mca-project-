import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { toast } from "react-toastify";
import { FaTrash, FaSearch, FaEye, FaPlus } from "react-icons/fa";
import "./Style/CustomerList.css";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const r = await axios.get("/categories");
      setCategories(r.data);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category and all its subcategories? This cannot be undone.")) return;
    try {
      await axios.delete(`/categories/${categoryId}`);
      setCategories((prev) => prev.filter((c) => c.p_cata_id !== categoryId));
      toast.success("Category deleted");
    } catch { toast.error("Failed to delete category"); }
  };

  const filtered = categories.filter((c) =>
    (c.p_cata_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">🏷️ Categories & Products</h1>
            <p className="admin-page-subtitle">{categories.length} product categories</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="admin-search-box">
              <FaSearch className="admin-search-icon" />
              <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary-admin" onClick={() => navigate("/categoryform")}>
              <FaPlus size={12} /> Add Category
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading categories...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No categories found</td></tr>
                ) : filtered.map((cat, idx) => (
                  <tr key={cat.p_cata_id}>
                    <td className="td-muted">{idx + 1}</td>
                    <td className="td-bold">{cat.p_cata_name}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-edit-sm" onClick={() => navigate(`/subcategorylist?categoryId=${cat.p_cata_id}`)}>
                          <FaEye size={12} /> View Subcategories
                        </button>
                        <button className="btn-delete-sm" onClick={() => handleDelete(cat.p_cata_id)}>
                          <FaTrash size={12} /> Delete
                        </button>
                      </div>
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

export default CategoryList;
