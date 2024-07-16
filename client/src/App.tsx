import React from 'react';
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
