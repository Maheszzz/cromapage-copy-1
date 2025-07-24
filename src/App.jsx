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
        const storedEmail = sessionStorage.getItem('userEmail') || '';
        const storedName = sessionStorage.getItem('userName') || 'Guest';
        const storedLastLogin = sessionStorage.getItem('lastLogin') || new Date().toISOString();

        // Basic validation
        if (storedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storedEmail)) {
          console.warn('Invalid email format in sessionStorage, resetting login');
          setIsLoggedIn(false);
          return;
        }

        setUser({ name: storedName, email: storedEmail, lastLogin: storedLastLogin });
        setIsLoggedIn(true);
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

  const handleLogin = (email, name) => {
    try {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userName', name || 'Guest');
      sessionStorage.setItem('lastLogin', new Date().toISOString());
      setUser({ name: name || 'Guest', email, lastLogin: new Date().toISOString() });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSignup = (email, name) => {
    try {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userEmail', email);
      sessionStorage.setItem('userName', name || 'Guest');
      sessionStorage.setItem('lastLogin', new Date().toISOString());
      setUser({ name: name || 'Guest', email, lastLogin: new Date().toISOString() });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  if (isLoggedIn) {
    return <MainScreenComponent onLogout={handleLogout} user={user} />;
  }

  return isLoginPage ? (
    <Login
      onLogin={(email, name) => handleLogin(email, name)}
      onSwitchToSignup={() => setIsLoginPage(false)}
    />
  ) : (
    <SignUp
      onSignup={(email, name) => handleSignup(email, name)}
      onSwitchToLogin={() => setIsLoginPage(true)}
    />
  );
}