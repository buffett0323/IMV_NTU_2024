import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useSeller } from './pages/UserContext';
import './css/Member.css';
import axios from 'axios';

const Member: React.FC = () => {
  const { setUser, user } = useUser();
  const { seller, setSeller } = useSeller();
  const navigate = useNavigate();

  // State to manage the form inputs
  const [displayName, setDisplayName] = useState(user?.displayName || seller?.name || '');
  const [email, setEmail] = useState(user?.email || seller?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.deliveryAddress || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (user) {
      const updatedUser = {
        displayName,
        email,
        deliveryAddress,
        lineUserId: user.lineUserId,
      };

      try {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/auth/user/${user.lineUserId}`, updatedUser, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('User updated successfully', response.data);
        setIsEditing(false); // Exit edit mode after saving
        setUser(response.data); // Update the user context with new data
      } catch (error) {
        console.error('There was an error updating the user!', error);
      }
    } else if (seller) {
      const updatedSeller = {
        name: displayName,
        email,
        phoneNumber: seller.phoneNumber,
        username: seller.username,
      };

      try {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/auth/seller/${seller.username}`, updatedSeller, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Seller updated successfully', response.data);
        setIsEditing(false); // Exit edit mode after saving
        setSeller(response.data); // Update the seller context with new data
      } catch (error) {
        console.error('There was an error updating the seller!', error);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSeller(null);
    navigate('/');
  };

  return (
    <div className="member">
      
      {user || seller ? (
        <div>
          <h1>{user ? '買家會員中心' : '賣家會員中心'}</h1>
          <h2>{user ? user.displayName : seller?.name} 的會員資訊</h2>
          {user ? (
            <div className="member-figure-container">
            <img src={user.pictureUrl} className="member-figure" alt="Community Figure" />
          </div>):(<div></div>)
          }
          {seller && (
            <div className="seller-info">
              {/* <p>Seller Username: {seller.username}</p> */}
              <p>電子郵件: {seller.email}</p>
              <p>電話號碼: {seller.phoneNumber}</p>
              <p>會員等級: {seller.submit}</p>
            </div>
          )}

          {isEditing ? (
            <div className="edit-form-container">
              <h2 className="edit-form-title">Edit Your Profile</h2>
              <form className="edit-form" onSubmit={handleSave}>
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
                {seller && (
                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input 
                      type="text" id="phoneNumber" name="phoneNumber" className="form-input" 
                      value={seller.phoneNumber}
                      onChange={(e) => setSeller({ ...seller, phoneNumber: e.target.value })}
                    />
                  </div>
                )}
                {user && (
                  <div className="form-group">
                    <label htmlFor="deliveryAddress" className="form-label">配送地址</label>
                    <input 
                      type="text" className="form-input" 
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}
                <button type="submit" className="form-submit-btn">Save Changes</button>
              </form>
            </div>
          ) : (
            <div>
              {user ? (
                <div>
                  <p>電子郵件: {user.email || '未提供'}</p>
                  <p>配送地址: {user.deliveryAddress || '未提供'}</p>
                  <p>會員分級等制: {user.premiereLevel || '0'} 級</p>
                </div>
              ) : (<div></div>)}
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
