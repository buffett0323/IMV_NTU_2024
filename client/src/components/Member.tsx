import React from 'react';
import { Link } from 'react-router-dom';
import './css/Member.css';

const Member: React.FC = () => {
  return (
    <section className="member">
      <h2>會員資訊</h2>
      <p>這裡是會員資訊頁面。</p>
      <div className="auth-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn">Signup</Link>
      </div>
    </section>
  );
}

export default Member;
