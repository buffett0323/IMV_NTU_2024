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
        console.log("MEMBER:", user, user.lineUserId);
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/auth/user/${user.lineUserId}`, updatedUser);
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
    <div className="member">
      <h1>會員資訊</h1>
      {user ? (
        <div>
          <h2>{user.displayName} 的會員中心</h2>
          <div className="member-figure-container">
            <img src={user.pictureUrl} className="member-figure" alt="Community Figure" />
          </div>

          {isEditing ? (
            <div className="edit-form-container">
              <h2 className="edit-form-title">Edit Your Profile</h2>
              <form className="edit-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">名字</label>
                  <input 
                    type="text" id="name" name="name" className="form-input" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" id="email" name="email" className="form-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="deliveryAddress" className="form-label">配送地址</label>
                  <input 
                    type="text" className="form-input" 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="form-submit-btn" onClick={handleSave}>Save Changes</button>
              </form>
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
          <Link to="/login" className="btn">點此登入</Link>
        </div>
      )}
    </div>
  );
};

export default Member;
