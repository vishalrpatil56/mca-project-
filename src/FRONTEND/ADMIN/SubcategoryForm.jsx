import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Style/CategoryList.css"
function SubcategoryForm({
  categoryId,
  subcategory,
  fetchSubcategories,
  setSelectedSubcategory,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (subcategory) {
      setName(subcategory.p_sub_cata_name);
      setDescription(subcategory.p_sub_cata_description);
    } else {
      setName("");
      setDescription("");
    }
  }, [subcategory]);

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }

    const hasNumbers = /\d/.test(name);
    const isEmailLike = /@/.test(name);

    if (hasNumbers || isEmailLike) {
      setNameError("Name cannot contain numbers or email patterns");
      return false;
    }

    setNameError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateName()) return;

    try {
      if (subcategory) {
        await axios.put(
          `http://localhost:5000/subcategories/${subcategory.p_sub_cata_id}`,
          { name, description, category_id: categoryId }
        );
      } else {
        await axios.post(
          `http://localhost:5000/categories/${categoryId}/subcategories`,
          { name, description }
        );
      }
      fetchSubcategories(); // Refresh list
      setSelectedSubcategory(null); // Close form
    } catch (error) {
      console.error("Error saving subcategory:", error);
    }
  };

  return (
    <form className="subcategory-form" onSubmit={handleSubmit}>
      <h2>{subcategory ? "Edit Subcategory" : "Add Subcategory"}</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            validateName();
          }}
          required
        />
        {nameError && <p className="error-message">{nameError}</p>}
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save</button>
      {subcategory && (
        <button type="button" onClick={() => setSelectedSubcategory(null)}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default SubcategoryForm;
