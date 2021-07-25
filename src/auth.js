import React from "react";
import { useState } from "react";

export default function Auth({ refresh }) {
  const [signedIn, setSignedIn] = useState(
    localStorage.getItem("key") === null
  );

  function notify() {
    setSignedIn(localStorage.getItem("key") === null);
  }

  return (
    <>
      {signedIn ? (
        <SignIn refresh={refresh} notify={notify} />
      ) : (
        <SignOut refresh={refresh} notify={notify} />
      )}
    </>
  );
}

function SignIn({ notify, refresh }) {
  const [key, setkey] = useState("");

  function handleClick() {
    if (key.toString().length > 0) {
      localStorage.setItem("key", key);
      notify();
      refresh();
    }
  }

  return (
    <div className="authContainer row">
      <div className="row signInContainer">
        <input
          value={key}
          type="password"
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

function SignOut({ notify, refresh }) {
  function handleSignOut() {
    localStorage.removeItem("key");
    notify();
    refresh();
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
