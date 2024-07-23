import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './pages/UserContext'; // Adjust the path as needed
import './css/Member.css';

const Member: React.FC = () => {

  const { user } = useUser();

  return (
    <section className="member">
      <h2>會員資訊</h2>
      {/* <p>這裡是會員資訊頁面。</p> */}

      {user ? (
        <div>
          <h2>會員名字:  {user.displayName}</h2>
          <p>{user.statusMessage}</p>
          <img src={user.pictureUrl} alt="User profile" />
        </div>
      ) : (
        // <h2>Not Login Yet</h2>
        <div className="auth-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/signup" className="btn">Signup</Link>
        </div>
      )}

      
    </section>
  );
}

export default Member;
