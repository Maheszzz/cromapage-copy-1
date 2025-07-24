import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MainScreenComponent from './components/MainScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [user, setUser] = useState({ name: '', email: '', lastLogin: '' });

  useEffect(() => {
    try {
      const storedStatus = sessionStorage.getItem('isLoggedIn');
      if (storedStatus === 'true') {
        const storedUser = {
          name: sessionStorage.getItem('userName') || 'Guest',
          email: sessionStorage.getItem('userEmail') || '',
          lastLogin: sessionStorage.getItem('lastLogin') || new Date().toISOString(),
        };
        setIsLoggedIn(true);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('lastLogin');
      setIsLoggedIn(false);
      setUser({ name: '', email: '', lastLogin: '' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoggedIn) {
    return <MainScreenComponent onLogout={handleLogout} user={user} />;
  }

  return isLoginPage ? (
    <Login
      onLogin={() => {
        setIsLoggedIn(true);
        setUser({
          name: sessionStorage.getItem('userName') || 'Guest',
          email: sessionStorage.getItem('userEmail') || '',
          lastLogin: new Date().toISOString(),
        });
      }}
      onSwitchToSignup={() => setIsLoginPage(false)}
    />
  ) : (
    <SignUp
      onSignup={() => {
        setIsLoggedIn(true);
        setUser({
          name: sessionStorage.getItem('userName') || 'Guest',
          email: sessionStorage.getItem('userEmail') || '',
          lastLogin: new Date().toISOString(),
        });
      }}
      onSwitchToLogin={() => setIsLoginPage(true)}
    />
  );
}