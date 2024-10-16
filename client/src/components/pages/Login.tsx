import React, { useState } from 'react';
import '../css/Login.css';  // Make sure to update your CSS file
import { useNavigate } from 'react-router-dom';
import loginButtonImage from '../img/btn_login_base.png';
import { useSeller } from './UserContext';

const LoginPage: React.FC = () => {
  const { setSeller } = useSeller(); // access setSeller function from context
  const [sellerName, setSellerName] = useState('');
  const [sellerUsername, setSellerUsername] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const [sellerImage, setSellerImage] = useState<File | null>(null); // New state for image
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Handle buyer login using Line
  const handleLogin = () => {
    const responseType = 'code';
    const clientId = '2005899680';
    const redirectUri = encodeURIComponent(`${process.env.REACT_APP_SERVER_URL}/api/auth/callback`);
    const state = Math.random().toString(36).substring(7);
    const scope = 'profile%20openid%20email';
  
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    window.location.href = lineLoginUrl;
  };

  // Handle seller login
  const handleSellerLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/seller/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: sellerUsername,
          password: sellerPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        setSeller({
          name: data.seller.name,
          username: data.seller.username,
          email: data.seller.email,
          phoneNumber: data.seller.phoneNumber,
          submit: data.seller.submit,
        }); // Store seller data globally
        navigate('/member');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error logging in seller:', error);
    }
  };

  // Handle seller registration with membership payment
  const handleSellerRegistration = async () => {
    const confirmPayment = window.confirm('Do you want to proceed with the membership payment of 600 NTD/year?');

    if (confirmPayment) {
      const formData = new FormData();
      formData.append('name', sellerName);
      formData.append('username', sellerUsername);
      formData.append('password', sellerPassword);
      formData.append('email', sellerEmail);
      formData.append('phoneNumber', sellerPhoneNumber);
      if (sellerImage) {
        formData.append('image', sellerImage); // Append the image to the form data
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/seller/register`, {
          method: 'POST',
          body: formData,  // Send FormData, including image
        });

        const data = await response.json();
        if (response.ok) {
          alert('Registration and payment successful!');
          setIsRegistering(false); // Switch back to login form
        } else {
          alert('Registration failed: ' + data.message);
        }
      } catch (error) {
        console.error('Error registering:', error);
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Buyer Login</h1>
      <button onClick={handleLogin}>
        <img src={loginButtonImage} alt="Login with Line" width="150" />
      </button>
      
      <h1>{isRegistering ? 'Seller Registration' : 'Seller Login'}</h1>
      <div className="seller-form">
        {isRegistering && (
          <>
            <div className="form-group">
              <label className="form-label">名字</label>
              <input
                type="text"
                placeholder="Name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">信箱</label>
              <input
                type="email"
                placeholder="Email"
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">手機號碼</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={sellerPhoneNumber}
                onChange={(e) => setSellerPhoneNumber(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">上傳商業證明</label>
              <input
                type="file"
                onChange={(e) => setSellerImage(e.target.files ? e.target.files[0] : null)}
                className="form-input"
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Username"
            value={sellerUsername}
            onChange={(e) => setSellerUsername(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={sellerPassword}
            onChange={(e) => setSellerPassword(e.target.value)}
            className="form-input"
          />
        </div>

        <button onClick={isRegistering ? handleSellerRegistration : handleSellerLogin} className="form-button">
          {isRegistering ? 'Register and Pay 600 NTD/year' : 'Login'}
        </button>

        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegistering(!isRegistering)} className="form-toggle-button">
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
