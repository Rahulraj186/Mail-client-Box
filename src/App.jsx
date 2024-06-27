// src/App.js

import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Welcome from "./Welcome";
import ComposeMail from "./ComposeMail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignupSuccess = () => {
    setShowLogin(true);
  };

  const toggleAuthScreen = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <>
          {showLogin ? (
            <div>
              <Login onLoginSuccess={handleLoginSuccess} />
              <p>
                Don't have an account?{" "}
                <button onClick={toggleAuthScreen}>Sign Up</button>
              </p>
            </div>
          ) : (
            <div>
              <Signup onSignupSuccess={handleSignupSuccess} />
              <p>
                Already have an account?{" "}
                <button onClick={toggleAuthScreen}>Login</button>
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <Welcome />
          <ComposeMail />
        </>
      )}
    </div>
  );
}

export default App;
