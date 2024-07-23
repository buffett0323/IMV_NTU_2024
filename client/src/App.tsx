import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs'
import Home from './components/Home';
import Market from './components/Market';
import Fertilizer from './components/Fertilizer';
import Info from './components/Info';
import Plan from './components/Plan';
import Cart from './components/Cart';
import Member from './components/Member';
import Footer from './components/Footer';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import AIQA from './components/AIQA';
import { UserProvider } from './components/pages/UserContext';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<AboutUs />} />
            <Route path="/home" element={<Home />} /> {/* Handle Login */}
            <Route path="/market" element={<Market />} />
            <Route path="/fertilizer" element={<Fertilizer />} />
            <Route path="/info" element={<Info />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/member" element={<Member />} /> {/* Main Page */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/aiqa' element={<AIQA/>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
