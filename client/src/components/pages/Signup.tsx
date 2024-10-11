import React, { useState } from 'react';
import axios from 'axios';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting signup form");
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`, { email, password });
      console.log("Response received:", response.data);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
