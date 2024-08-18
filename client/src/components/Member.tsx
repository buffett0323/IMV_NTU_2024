import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './pages/UserContext';
import './css/Member.css';
import axios from 'axios';

const Member: React.FC = () => {
  const { setUser, user } = useUser();
  const navigate = useNavigate();

  // State to manage the form inputs
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.deliveryAddress || '');
  // const [premiereLevel, setPremiereLevel] = useState(user?.premiereLevel || 0);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (user) {
      const updatedUser = {
        displayName,
        email,
        deliveryAddress,
        lineUserId: user.lineUserId,
      };

      try {
        const response = await axios.put(`http://localhost:8000/api/auth/user/${user.lineUserId}`, updatedUser);
        console.log('User updated successfully', response.data);
        setUser(response.data);
        setIsEditing(false);
      } catch (error) {
        console.error('There was an error updating the user!', error);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <section className="member">
      <h1>會員資訊</h1>
      {user ? (
        <div>
          <h2>會員名字: {user.displayName}</h2>
          <img src={user.pictureUrl} alt="User profile" />

          {isEditing ? (
            <div className="edit-form">
              <label>
                名字:
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </label>
              <label>
                電子郵件:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                配送地址:
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </label>
              <button onClick={handleSave} className="btn save">Save</button>
            </div>
          ) : (
            <div>
              <p>電子郵件: {user.email || '未提供'}</p>
              <p>配送地址: {user.deliveryAddress || '未提供'}</p>
              <p>會員分級等制: {user.premiereLevel} 級</p>
              <button onClick={handleEdit} className="btn edit">Edit</button>
            </div>
          )}

          {/* Logout button at the end of the page */}
          <div className="logout-section">
            <button onClick={handleLogout} className="btn logout">Logout</button>
          </div>
        </div>
      ) : (
        <div className="auth-buttons">
          <h3>Not Logged In Yet</h3>
          <Link to="/login" className="btn">Login with Line</Link>
        </div>
      )}
    </section>
  );
};

export default Member;
