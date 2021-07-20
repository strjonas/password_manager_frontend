import React from "react";
import Collapsible from "./components/Collapsible";
import "./index.scss";

export default function PasswordManager() {
  return (
    <div className="innerDiv column">
      <Collapsible label="New Password">
        <div className="inputContainer">
          <div className="urlAndName row">
            <input placeholder="name" type="text" className="nameInput"></input>
            <input
              placeholder="url - optional"
              type="text"
              className="urlInput"
            ></input>
          </div>
          <div className="row">
            <input
              placeholder="password"
              type="password"
              className="passwordInput"
            ></input>
            <button className="addButton">Add</button>
          </div>
        </div>
      </Collapsible>

      <div className="searchBar row"></div>
      <div className="passwordList column "></div>
    </div>
  );
}
