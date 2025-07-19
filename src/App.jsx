import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MainScreenComponent from './components/MainScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);

  useEffect(() => {
    const status = sessionStorage.getItem('isLoggedIn');
    if (status === 'true') setIsLoggedIn(true);
  }, []);

  if (isLoggedIn) {
    return <MainScreenComponent onLogout={() => setIsLoggedIn(false)} />;
  }

  return isLoginPage ? (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onSwitchToSignup={() => setIsLoginPage(false)}
    />
  ) : (
    <SignUp
      onSignup={() => setIsLoggedIn(true)}
      onSwitchToLogin={() => setIsLoginPage(true)}
    />
  );
}
