import React, { useState } from 'react';
import { LineLogin } from 'reactjs-line-login';
import 'reactjs-line-login/dist/index.css';

interface Payload {
  sub: string;
  name: string;
  picture: string;
  email?: string;
}

const LoginPage: React.FC = () => {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  return (
    <div>
      <h1>Login with Line</h1>
      <LineLogin
        clientID={process.env.REACT_APP_CLIENT_ID || ''}
        clientSecret={process.env.REACT_APP_CLIENT_SECRET || ''}
        state={process.env.REACT_APP_STATE || ''}
        nonce={process.env.REACT_APP_NONCE || ''}
        redirectURI={process.env.REACT_APP_REDIRECT_URI || ''}
        scope={process.env.REACT_APP_SCOPE || ''}
        setPayload={setPayload}
        setIdToken={setIdToken}
      />
      {payload && idToken ? (
        <div>
          <h2>Welcome, {payload.name}</h2>
          <img src={payload.picture} alt="Profile" />
          <p>ID Token: {idToken}</p>
        </div>
      ) : (
        <p>Please log in with Line</p>
      )}
    </div>
  );
};

export default LoginPage;
