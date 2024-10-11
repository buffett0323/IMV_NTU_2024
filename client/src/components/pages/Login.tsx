import React, { useState } from 'react';
import '../css/Login.css';
import loginButtonImage from '../img/btn_login_base.png';
import { useSeller } from './UserContext'; 

const LoginPage: React.FC = () => {
  // State for seller login and registration
  const { seller, setSeller } = useSeller(); // access setSeller function from context
  const [sellerName, setSellerName] = useState('');
  const [sellerUsername, setSellerUsername] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

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
        }); // Store seller data globally
        console.log("SET Seller!", seller);
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error logging in seller:', error);
    }
  };

  // Handle seller registration
  const handleSellerRegistration = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/auth/seller/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sellerName,
          username: sellerUsername,
          password: sellerPassword,
          email: sellerEmail,
          phoneNumber: sellerPhoneNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        setIsRegistering(false); // Switch back to login form
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div>
      <h1>Buyer Login</h1>
      <button onClick={handleLogin}>
        <img src={loginButtonImage} alt="Login with Line" width="150" />
      </button>
      
      <h1>{isRegistering ? 'Seller Registration' : 'Seller Login'}</h1>
      <div>
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={sellerPhoneNumber}
              onChange={(e) => setSellerPhoneNumber(e.target.value)}
            />
          </>
        )}
        <input
          type="text"
          placeholder="Username"
          value={sellerUsername}
          onChange={(e) => setSellerUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={sellerPassword}
          onChange={(e) => setSellerPassword(e.target.value)}
        />
        <button onClick={isRegistering ? handleSellerRegistration : handleSellerLogin}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
