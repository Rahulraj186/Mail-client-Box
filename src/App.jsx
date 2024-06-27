// src/App.js

import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Welcome from "./Welcome";
import ComposeMail from "./ComposeMail";
import Inbox from "./Inbox";
import { InboxProvider } from "./InboxContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showCompose, setShowCompose] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignupSuccess = () => {
    setShowLogin(true);
  };

  const toggleAuthScreen = () => {
    setShowLogin(!showLogin);
  };

  const toggleComposeScreen = () => {
    setShowCompose(!showCompose);
  };

  return (
    <InboxProvider>
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
            <button onClick={toggleComposeScreen}>
              {showCompose ? "Go to Inbox" : "Compose Mail"}
            </button>
            {showCompose ? <ComposeMail /> : <Inbox />}
          </>
        )}
      </div>
    </InboxProvider>
  );
}

export default App;
