import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Styles/CusHeader.css";

function CusHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const syncState = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
      setUserName(localStorage.getItem("user_name") || null);
    };
    syncState();
    window.addEventListener("storage", syncState);
    const id = setInterval(syncState, 800);
    return () => { window.removeEventListener("storage", syncState); clearInterval(id); };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return;
    if (s.includes("wash")) navigate("/washing");
    else if (s.includes("ac") || s.includes("air") || s.includes("conditioner")) navigate("/aircon");
    else if (s.includes("fridge") || s.includes("refrig")) navigate("/fridge");
    else if (s.includes("tv") || s.includes("television") || s.includes("led") || s.includes("qled")) navigate("/telivision");
    else if (s.includes("water") || s.includes("purifier") || s.includes("ro")) navigate("/waterpurifier");
    else toast.info("No matching category. Try: TV, AC, Fridge, Washing, Water Purifier");
    setSearchTerm("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setUserName(null);
    setUserMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/cuslogin");
  };

  return (
    <header className="cus-header">
      <nav className="cus-nav">
        <Link to="/" className="cus-logo">
          <img src="/uploads/Untitled design.jpeg" alt="Balaji" className="cus-logo-img" onError={(e) => { e.target.style.display="none"; }} />
          <span className="cus-logo-text">Balaji<span>Enterprises</span></span>
        </Link>

        <div className="cus-search">
          <input
            type="text" placeholder="Search TV, AC, Fridge, Washing Machine..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="cus-search-input"
          />
          <button onClick={handleSearch} className="cus-search-btn" aria-label="Search"><FiSearch size={18} /></button>
        </div>

        <div className="cus-actions">
          <Link to="/loginpage" className="cus-sp-btn">Be a Service Provider</Link>

          <Link to="/orders" className="cus-icon-btn" title="My Orders"><FiPackage size={22} /></Link>

          <Link to="/cart" className="cus-icon-btn cus-cart-btn" title="Cart">
            <AiOutlineShoppingCart size={24} />
            {cartCount > 0 && <span className="cus-cart-badge">{cartCount > 9 ? "9+" : cartCount}</span>}
          </Link>

          <div className="cus-user-menu" ref={userMenuRef}>
            <button className="cus-icon-btn cus-user-btn" onClick={() => setUserMenuOpen(v => !v)} title={userName || "Account"}>
              <FiUser size={22} />
              {userName && <span className="cus-username-label">{userName.split(" ")[0]}</span>}
            </button>
            {userMenuOpen && (
              <div className="cus-dropdown">
                {userName ? (
                  <>
                    <div className="cus-dropdown-header"><strong>{userName}</strong><span>Logged in</span></div>
                    <Link to="/orders" className="cus-dropdown-item" onClick={() => setUserMenuOpen(false)}><FiPackage size={15} /> My Orders</Link>
                    <button className="cus-dropdown-item cus-logout" onClick={handleLogout}><FiLogOut size={15} /> Logout</button>
                  </>
                ) : (
                  <>
                    <div className="cus-dropdown-header"><strong>Welcome!</strong><span>Sign in to your account</span></div>
                    <Link to="/cuslogin" className="cus-dropdown-item" onClick={() => setUserMenuOpen(false)}>Login</Link>
                    <Link to="/userregister" className="cus-dropdown-item" onClick={() => setUserMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="cus-mobile-toggle" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      <div className="cus-categories-bar">
        <div className="cus-categories-inner">
          {[["Washing Machines","/washing"],["Air Conditioners","/aircon"],["Refrigerators","/fridge"],["Televisions","/telivision"],["Water Purifiers","/waterpurifier"]].map(([label, path]) => (
            <Link key={path} to={path} className="cus-cat-link">{label}</Link>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="cus-mobile-menu">
          <div className="cus-mobile-search">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <button onClick={handleSearch}><FiSearch /></button>
          </div>
          {[["Home","/"],["Washing Machines","/washing"],["Air Conditioners","/aircon"],["Refrigerators","/fridge"],["Televisions","/telivision"],["Water Purifiers","/waterpurifier"],["Cart","/cart"],["My Orders","/orders"]].map(([label,path]) => (
            <Link key={path} to={path} className="cus-mobile-link" onClick={() => setMenuOpen(false)}>{label} {path==="/cart" && cartCount > 0 ? `(${cartCount})` : ""}</Link>
          ))}
          {userName
            ? <button className="cus-mobile-link cus-mobile-logout" onClick={handleLogout}>Logout ({userName})</button>
            : <>
                <Link to="/cuslogin" className="cus-mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/userregister" className="cus-mobile-link" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
          }
        </div>
      )}
    </header>
  );
}

export default CusHeader;
