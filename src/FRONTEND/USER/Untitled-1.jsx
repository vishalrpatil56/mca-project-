import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FeaturedCategories.css"; // Custom styles

const categories = [
  { name: "Fans", img: "/images/fan.png", subcategories: ["Ceiling Fans", "Table Fans", "Exhaust Fans"] },
  { name: "Air Coolers", img: "/images/air-cooler.png" },
  { name: "Parts & Accessories", img: "/images/parts-accessories.png" },
  { name: "Humidifiers", img: "/images/humidifier.png" },
  { name: "Water Heaters & Geysers", img: "/images/water-heater.png" },
  { name: "Air Conditioners", img: "/images/air-conditioner.png" },
  { name: "Dehumidifiers", img: "/images/dehumidifier.png" },
  { name: "Room Heaters", img: "/images/room-heater.png" },
  { name: "Air Purifiers", img: "/images/air-purifier.png" },
  { name: "Deodorisers", img: "/images/deodoriser.png" },
];

const FeaturedCategories = () => {
  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Featured Categories</h2>
      <div className="row row-cols-2 row-cols-md-4 g-2">
        {categories.map((category, index) => (
          <div className="col text-center" key={index}>
            <div className="category-card">
              <img src={category.img} alt={category.name} className="category-img" />
            </div>
            <h5 className="mt-2 fw-bold">{category.name}</h5>
            {category.subcategories && (
              <ul className="subcategory-list">
                {category.subcategories.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;

// .category-card {
//   width: 120px;
//   height: 120px;
//   background: #f5f5f5;
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow: hidden;
//   margin: auto;
//   transition: transform 0.3s ease-in-out;
// }

// .category-card:hover {
//   transform: scale(1.1);
// }

// .category-img {
//   width: 80%;
//   height: auto;
//   object-fit: contain;
// }

// .subcategory-list {
//   list-style: none;
//   padding: 0;
//   font-size: 14px;
//   color: gray;
// }

// .subcategory-list li {
//   line-height: 1.5;
// }
