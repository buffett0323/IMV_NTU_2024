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

    console.log("UserID:", userId);
    console.log("displayName:", displayName);
    console.log("pictureUrl:", pictureUrl);
    console.log("deliveryAddress:", deliveryAddress);
    console.log("email:", email);
    console.log("premiereLevel:", premiereLevel);

    if (userId && displayName) {
      setUser({
        lineUserId: userId,
        displayName,
        pictureUrl: pictureUrl ?? undefined,
        deliveryAddress: deliveryAddress ?? undefined,
        email: email ?? undefined,
        premiereLevel: premiereLevel ? Number(premiereLevel) : 0,
      });
      navigate('/');
    } else {
      // Handle case where user data is incomplete or missing, perhaps by redirecting or showing an error
      console.error("User data is missing or incomplete");
      navigate('/login');
    }
  }, [location, setUser, navigate]);

  return <div>Loading...</div>;
};

export default Home;
