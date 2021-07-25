import React from "react";
import { useState } from "react";

export default function Auth() {
  const [signedIn, setSignedIn] = useState(
    localStorage.getItem("key") === null
  );

  function notify() {
    setSignedIn(localStorage.getItem("key") === null);
  }

  return (
    <>{signedIn ? <SignIn notify={notify} /> : <SignOut notify={notify} />}</>
  );
}

function SignIn({ notify }) {
  const [key, setkey] = useState("");

  function handleClick() {
    if (key.toString().length > 0) {
      localStorage.setItem("key", key);
      notify();
    }
  }

  return (
    <div className="authContainer row">
      <div className="row signInContainer">
        <input
          value={key}
          onChange={(e) => {
            setkey(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleClick();
            }
          }}
          className="signInInput"
        ></input>
        <button
          onClick={() => {
            handleClick();
          }}
          className="signInButton"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function SignOut({ notify }) {
  function handleSignOut() {
    localStorage.removeItem("key");
    notify();
  }
  return (
    <div className="signOutContainer">
      {" "}
      <button
        onClick={() => {
          handleSignOut();
        }}
        className="signOutButton"
      >
        Sign Out
      </button>
    </div>
  );
}
