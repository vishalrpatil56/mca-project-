import React, { useState, useEffect } from "react";
import axios from "axios";

function CategoryForm({ category, fetchCategories, setSelectedCategory }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.productcategory_name);
      setDescription(category.productcategory_description);
    }
  }, [category]);

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (/\d/.test(name) || /@/.test(name)) {
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
      await axios.put(
        `http://localhost:5000/categories/${category.productcategory_id}`,
        { name, description }
      );
      fetchCategories();
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    category && (
      <form className="category-form" onSubmit={handleSubmit}>
        <h2>Edit Category</h2>
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
        <button type="button" onClick={() => setSelectedCategory(null)}>
          Cancel
        </button>
      </form>
    )
  );
}

export default CategoryForm;
