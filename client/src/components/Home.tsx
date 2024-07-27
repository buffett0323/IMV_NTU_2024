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
    const email = query.get('query');
    const password = query.get('password');

    console.log("UserID:", userId);
    console.log("statusMessage:", statusMessage);

    if (userId && displayName) {
      setUser({ 
        lineUserId: userId, 
        displayName, 
        pictureUrl: pictureUrl ?? undefined, 
        statusMessage: statusMessage ?? undefined,
        email: email ?? undefined,
        password: password ?? undefined,
      });
      navigate('/');
    }
  }, [location, setUser, navigate]);

  return <div>Loading...</div>;
};

export default Home;
