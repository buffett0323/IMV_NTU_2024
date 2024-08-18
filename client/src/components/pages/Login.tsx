import React from 'react';
import '../css/Login.css';
import loginButtonImage from '../img/btn_login_base.png';

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    const responseType = 'code';
    const clientId = '2005899680';
    const redirectUri = 'http://localhost:8000/api/auth/callback'; //encodeURIComponent('http://localhost:8000/api/auth/callback');
    const state = '123456789';
    const scope = 'profile%20openid%20email';
  
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    window.location.href = lineLoginUrl;
  };

  return (
    <div>
      <h1>Login with Line</h1>
      <button onClick={handleLogin}>
        <img src={loginButtonImage} alt="Login with Line" width="150" />
      </button>
    </div>
  );
};

export default LoginPage;
