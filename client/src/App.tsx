import React from 'react';
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import Market from './components/Market';
import Fertilizer from './components/Fertilizer';
import Info from './components/Info';
import Plan from './components/Plan';
import Cart from './components/Cart';
import Member from './components/Member';
import Footer from './components/Footer';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';

const App: React.FC = () => {
  // const location = useLocation();
  // const [user, setUser] = useState<{ userId: string, displayName: string, statusMessage: string, pictureUrl: string } | null>(null);

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const userId = params.get('userId');
  //   const displayName = params.get('displayName');
  //   const statusMessage = params.get('statusMessage');
  //   const pictureUrl = params.get('pictureUrl');

  //   if (userId && displayName) {
  //     setUser({
  //       userId,
  //       displayName,
  //       statusMessage: statusMessage || '',
  //       pictureUrl: pictureUrl || '',
  //     });
  //   }
  // }, [location]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<AboutUs />} />
          <Route path="/market" element={<Market />} />
          <Route path="/fertilizer" element={<Fertilizer />} />
          <Route path="/info" element={<Info />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/member" element={<Member />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />         
        </Routes>
        {/* {user ? (
          <div>
            <p>User ID: {user.userId}</p>
            <p>Display Name: {user.displayName}</p>
            <p>Status Message: {user.statusMessage}</p>
            {user.pictureUrl && <img src={user.pictureUrl} alt="User profile" />}
          </div>
        ) : (
          <p>Loading user information...</p>
        )} */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
