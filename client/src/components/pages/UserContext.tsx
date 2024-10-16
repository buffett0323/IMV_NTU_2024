import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  email?: string;
  deliveryAddress?: string;
  premiereLevel?: number;
}

interface Seller {
  name: string;
  username: string;
  password?: string;
  email: string;
  phoneNumber: string;
  submit: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface SellerContextType {
  seller: Seller | null;
  setSeller: React.Dispatch<React.SetStateAction<Seller | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const SellerContext = createContext<SellerContextType | undefined>(undefined);

// User Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Seller Provider
export const SellerProvider = ({ children }: { children: ReactNode }) => {
  const [seller, setSeller] = useState<Seller | null>(null);

  return (
    <SellerContext.Provider value={{ seller, setSeller }}>
      {children}
    </SellerContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Custom hook to use SellerContext
export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};
