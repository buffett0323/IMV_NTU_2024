import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './pages/UserContext';

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const userId = query.get('userId');
    const displayName = query.get('displayName');
    const pictureUrl = query.get('pictureUrl');
    const statusMessage = query.get('statusMessage');

    console.log("UserID:", userId);
    console.log("statusMessage:", statusMessage);

    if (userId && displayName) {
      setUser({ 
        userId, 
        displayName, 
        pictureUrl: pictureUrl ?? undefined, 
        statusMessage: statusMessage ?? undefined 
      });
      navigate('/');
    }
  }, [location, setUser, navigate]);

  return <div>Loading...</div>;
};

export default Home;
