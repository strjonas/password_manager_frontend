import React from "react";
import { useState, useEffect } from "react";
import Collapsible from "./components/Collapsible";
import "./index.scss";
import { MdClose } from "react-icons/md";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { v4 as uuidv4 } from "uuid";
import { REACT_APP_API } from "./constants";
import PasswordRow from "./components/passwordRow";

const API = REACT_APP_API;

export default function PasswordManager() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);

  const [passwords, setPasswords] = useState([]);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

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

  function onkeypress(e) {
    if (e.key === "Enter") {
      handelAdd();
    }
  }

  function showToast(message) {
    setMessage(message);
    setOpen(true);
  }

  async function handelAdd() {
    const id = uuidv4();
    if (password.length < 8) {
      setMessage("Password is too short!");
      setOpen(true);
      return;
    }
    if (name.length < 4) {
      setMessage("Name is too short!");
      setOpen(true);
      return;
    }
    if (url === "") setUrl("none");
    const body = { id, password, name, url };
    try {
      await fetch(`${API}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      showToast("Successfully added!");

      setPassword("");
      setName("");
      setUrl("");

      getPasswords();
    } catch (error) {
      console.log(error);
      showToast("Something went wrong!");
    }
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
              onKeyPress={(e) => onkeypress(e)}
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
          return (
            <PasswordRow
              key={password.id}
              props={password}
              refresh={getPasswords}
            />
          );
        })}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            <IconButton onClick={handleClose}>
              <MdClose style={{ color: "white" }} />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
