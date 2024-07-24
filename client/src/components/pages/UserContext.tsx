import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
