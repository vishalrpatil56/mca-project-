// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import CusHeader from "./CusHeader";
// import CusFooter from "./CusFooter";
// import products from "./Telivision";  // Import the products array

// const SearchResult = () => {
//   const { query } = useParams();  // Get search term from URL
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (query) {
//       let results = products.filter(
//         (product) =>
//           product.name.toLowerCase().includes(query.toLowerCase()) ||
//           product.brand.toLowerCase().includes(query.toLowerCase())
//       );

//       // Apply category filter
//       if (selectedCategory !== "All") {
//         results = results.filter((product) => product.category === selectedCategory);
//       }

//       setFilteredProducts(results);
//     }
//   }, [query, selectedCategory]);

//   return (
//     <>
//       <CusHeader />

//       <div className="container my-5">
//         <h2 className="text-center">Search Results for: "{query}"</h2>

//         {/* Category Filter */}
//         <div className="d-flex justify-content-center mb-4">
//           <select
//             className="form-select w-25"
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             <option value="All">All Categories</option>
//             <option value="Television">Televisions</option>
//             <option value="Air Conditioner">Air Conditioners</option>
//             <option value="Washing Machine">Washing Machines</option>
//           </select>
//         </div>

//         {filteredProducts.length === 0 ? (
//           <div className="alert alert-info text-center">
//             No products found for "{query}"
//           </div>
//         ) : (
//           <div className="row">
//             {filteredProducts.map((product) => (
//               <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
//                 <div className="card h-100 shadow-sm">
//                   <img
//                     src={product.image}
//                     className="card-img-top"
//                     alt={product.name}
//                     style={{ height: "250px", objectFit: "cover" }}
//                   />
//                   <div className="card-body">
//                     <h5 className="card-title">{product.brand} - {product.name}</h5>
//                     <p className="card-text">Category: {product.category}</p>
//                     <p className="card-text">Price: ₹{product.price.toLocaleString()}</p>
//                     <button
//                       className="btn btn-warning w-100"
//                       onClick={() => navigate(`/product/${product.id}`)}
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <CusFooter />
//     </>
//   );
// };

// export default SearchResult;
