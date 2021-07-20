import React from "react";
import { useState, useEffect } from "react";
import Collapsible from "./components/Collapsible";
import "./index.scss";
import { v4 as uuidv4 } from "uuid";
import { REACT_APP_API } from "./constants";
import PasswordRow from "./components/passwordRow";
import { isCompositeComponent } from "react-dom/cjs/react-dom-test-utils.production.min";

const API = REACT_APP_API;

export default function PasswordManager() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    getPasswords();
  }, []);

  function onNameChange(e) {
    setName(e.target.value);
  }

  function onPasswordChange(e) {
    setPassword(e.target.value);
  }

  function onUrlChange(e) {
    setUrl(e.target.value);
  }

  async function getPasswords() {
    const pwds = await fetch(`${API}/allkeys`);
    const data = Array.from(await pwds.json());
    setPasswords(data);
  }

  async function handelAdd() {
    const id = uuidv4();
    const body = { id, password, name, url };

    const answer = await fetch(`${API}/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // show something as feedback (success or not)
  }

  return (
    <div className="innerDiv column">
      <Collapsible label="New Password">
        <div className="inputContainer">
          <div className="urlAndName row">
            <input
              value={name}
              onChange={onNameChange}
              placeholder="name"
              type="text"
              className="nameInput"
            ></input>
            <input
              placeholder="url - optional"
              type="text"
              className="urlInput"
              value={url}
              onChange={onUrlChange}
            ></input>
          </div>
          <div className="row">
            <input
              value={password}
              onChange={onPasswordChange}
              placeholder="password"
              type="password"
              className="passwordInput"
            ></input>
            <button onClick={handelAdd} className="addButton">
              Add
            </button>
          </div>
        </div>
      </Collapsible>

      <div className="searchBar row"></div>
      <div className="passwordList column ">
        {passwords.map((password) => {
          return <PasswordRow key={password.id} props={password} />;
        })}
      </div>
    </div>
  );
}
