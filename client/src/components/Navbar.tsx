import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CircleUser, AlignJustify } from 'lucide-react';
import './css/Navbar.css';
const IPCC_Weblink = 'https://www.ipcc.ch/';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="menu-icon" onClick={toggleMenu}>
        <AlignJustify />
      </div>
      <div className="navbar-logo">
        <Link to="/">碳索者農業網</Link>
      </div>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        {menuOpen && (
          <>
            <li><Link to="/market">農產品市場</Link></li>
            <li><Link to="/fertilizer">肥料與資源</Link></li>
            <li><Link to="/info">生產者資訊</Link></li>
            <li><Link to="/plan">碳固定計畫</Link></li>
            <li><a href={IPCC_Weblink} target="_blank" rel="noopener noreferrer">氣候變遷網站</a></li>
          </>
        )}
      </ul>
      <div className="navbar-icons">
        <Link to="/cart" className="navbar-icon">
          <ShoppingCart />
        </Link>
        <Link to="/member" className="navbar-link">
          <CircleUser />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;