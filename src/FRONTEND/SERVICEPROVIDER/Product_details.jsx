import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "./Header1";
import "../../theme.css";

const ProductDetails = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", long_description: "", price: "", category_id: "", subcategory_id: "" });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    axios.get("http://98.85.25.190:5000/categories").then((r) => setCategories(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setFormData({ ...formData, category_id: id, subcategory_id: "" });
    if (!id) return setSubCategories([]);
    try {
      const res = await axios.get(`http://98.85.25.190:5000/categories/${id}/subcategories`);
      setSubCategories(res.data);
    } catch { setSubCategories([]); }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Product name is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (!formData.price) errs.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) <= 0) errs.price = "Price must be a positive number";
    if (!formData.category_id) errs.category_id = "Select a category";
    if (!formData.subcategory_id) errs.subcategory_id = "Select a subcategory";
    if (!image) errs.image = "Product image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("description", formData.description.trim());
      fd.append("long_description", formData.long_description.trim());
      fd.append("price", formData.price);
      fd.append("subcategory_id", formData.subcategory_id);
      fd.append("image", image);
      await axios.post("http://98.85.25.190:5000/add-product", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product added successfully!");
      setFormData({ name: "", description: "", long_description: "", price: "", category_id: "", subcategory_id: "" });
      setImage(null);
      setSubCategories([]);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return toast.warning("Enter a product ID");
    try {
      const res = await axios.get(`http://98.85.25.190:5000/api/product/${searchId}`);
      setProduct(res.data);
      setEditMode(false);
    } catch { toast.error("Product not found"); setProduct(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(`http://98.85.25.190:5000/api/delete-product/${id}`);
      toast.success("Product deleted");
      setProduct(null);
    } catch { toast.error("Failed to delete product"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!product.product_name?.trim()) errs.product_name = "Name required";
    if (!product.product_price || Number(product.product_price) <= 0) errs.product_price = "Valid price required";
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await axios.put(`http://98.85.25.190:5000/api/update-product/${product.product_id}`, {
        name: product.product_name, description: product.product_description,
        long_description: product.long_description, price: product.product_price,
      });
      toast.success("Product updated successfully!");
      setEditMode(false);
    } catch { toast.error("Failed to update product"); }
  };

  return (
    <>
      <Header />
      <div className="main-content">
        {/* Add Product */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">📦 Product Management</h1>
            <p className="admin-page-subtitle">Add new products or search to edit/delete existing ones</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Add Product Form */}
          <div className="checkout-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>➕ Add New Product</h3>
            <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
              {[
                { name: "name", label: "Product Name *", type: "text", placeholder: "e.g. Samsung 55'' 4K LED TV" },
                { name: "description", label: "Short Description *", type: "text", placeholder: "Brief product summary" },
                { name: "long_description", label: "Full Description", type: "text", placeholder: "Detailed product description" },
                { name: "price", label: "Price (₹) *", type: "number", placeholder: "e.g. 29999" },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name} style={{ marginBottom: 14 }}>
                  <label className="form-label">{label}</label>
                  <input type={type} name={name} className={`form-input ${errors[name] ? "error" : ""}`}
                    value={formData[name]} onChange={handleChange} placeholder={placeholder}
                    min={name === "price" ? "1" : undefined}
                  />
                  {errors[name] && <span className="field-error">{errors[name]}</span>}
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Category *</label>
                <select name="category_id" className={`form-input ${errors.category_id ? "error" : ""}`}
                  value={formData.category_id} onChange={handleCategoryChange}>
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.p_cata_id} value={c.p_cata_id}>{c.p_cata_name}</option>
                  ))}
                </select>
                {errors.category_id && <span className="field-error">{errors.category_id}</span>}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Subcategory *</label>
                <select name="subcategory_id" className={`form-input ${errors.subcategory_id ? "error" : ""}`}
                  value={formData.subcategory_id}
                  onChange={(e) => { setFormData({ ...formData, subcategory_id: e.target.value }); setErrors(p => ({...p, subcategory_id: ""})); }}
                  disabled={!formData.category_id}>
                  <option value="">-- Select Subcategory --</option>
                  {subCategories.map((s) => (
                  <option key={s.p_sub_cata_id} value={s.p_sub_cata_id}>
                      {s.p_sub_cata_name}
                    </option>         
                  ))}
                </select>
                {errors.subcategory_id && <span className="field-error">{errors.subcategory_id}</span>}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Product Image *</label>
                <input type="file" accept="image/*" className={`form-input ${errors.image ? "error" : ""}`}
                  onChange={(e) => { setImage(e.target.files[0]); setErrors(p => ({...p, image: ""})); }}
                  style={{ padding: "8px 12px" }}
                />
                {errors.image && <span className="field-error">{errors.image}</span>}
                {image && <img src={URL.createObjectURL(image)} alt="preview" style={{ marginTop: 8, height: 80, objectFit: "contain", borderRadius: 6 }} />}
              </div>

              <button type="submit" className="checkout-btn" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? <span className="btn-spinner"></span> : "Add Product"}
              </button>
            </form>
          </div>

          {/* Search / Edit / Delete */}
          <div>
            <div className="checkout-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔍 Search Product by ID</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <input type="text" className="form-input" placeholder="Enter Product ID..."
                  value={searchId} onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="btn-primary-admin" onClick={handleSearch}>Search</button>
              </div>
            </div>

            {product && (
              <div className="checkout-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <img
                    src={`http://98.85.25.190:5000/uploads/${product.product_image}`}
                    alt={product.product_name}
                    style={{ width: 80, height: 70, objectFit: "contain", borderRadius: 8, background: "#f7f7f7", padding: 4 }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>#{product.product_id} — {product.product_name}</div>
                    <div style={{ color: "#e8400a", fontWeight: 700 }}>₹{Number(product.product_price).toLocaleString("en-IN")}</div>
                  </div>
                </div>

                {!editMode ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-edit-sm" onClick={() => setEditMode(true)}>✏️ Edit</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(product.product_id)}>🗑️ Delete</button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} noValidate>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Edit Product</h4>
                    {[
                      { key: "product_name", label: "Name" },
                      { key: "product_description", label: "Description" },
                      { key: "product_price", label: "Price (₹)", type: "number" },
                    ].map(({ key, label, type = "text" }) => (
                      <div key={key} style={{ marginBottom: 12 }}>
                        <label className="form-label">{label}</label>
                        <input type={type} className={`form-input ${editErrors[key] ? "error" : ""}`}
                          value={product[key] || ""} onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
                          min={type === "number" ? "1" : undefined}
                        />
                        {editErrors[key] && <span className="field-error">{editErrors[key]}</span>}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" className="btn-primary-admin">Save Changes</button>
                      <button type="button" className="clear-cart-btn" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
