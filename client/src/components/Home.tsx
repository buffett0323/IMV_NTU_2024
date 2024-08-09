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
    const deliveryAddress = query.get('deliveryAddress');
    const email = query.get('email');
    const premiereLevel = query.get('premiereLevel');
    const premiereLevelNumber: number | undefined = premiereLevel ? Number(premiereLevel) : undefined;

    console.log("UserID:", userId);
    console.log(displayName, pictureUrl, deliveryAddress, email, premiereLevel)

    if (userId && displayName) {
      setUser({ 
        lineUserId: userId, 
        displayName, 
        pictureUrl: pictureUrl ?? undefined, 
        deliveryAddress: deliveryAddress ?? undefined,
        email: email ?? undefined,
        premiereLevel: premiereLevelNumber,
      });
      navigate('/');
    }
  }, [location, setUser, navigate]);

  return <div>Loading...</div>;
};

export default Home;
