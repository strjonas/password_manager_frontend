import React from "react";
import { useState, useEffect } from "react";
import Collapsible from "./components/Collapsible";
import "./index.scss";
import { MdClose, MdSearch, MdRemoveRedEye } from "react-icons/md";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { v4 as uuidv4 } from "uuid";
import { REACT_APP_API } from "./constants";
import PasswordRow from "./components/passwordRow";
import Auth from "./auth";

const API = REACT_APP_API;

export default function PasswordManager() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");

  const [message, setMessage] = useState("");

  const [open, setOpen] = useState(false);

  const [passwords, setPasswords] = useState([]);

  const [search, setSearch] = useState([]);

  var [pwShow, setPwShow] = useState(0);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  function onSearchChange(ev) {
    setSearch(ev.target.value);
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

  function password_generator(len) {
    var length = len ? len : 10;
    var string = "abcdefghijklmnopqrstuvwxyz";
    var numeric = "0123456789";
    var punctuation = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    var password = "";
    var character = "";
    while (password.length < length) {
      var entity1 = Math.ceil(string.length * Math.random() * Math.random());
      var entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
      var entity3 = Math.ceil(
        punctuation.length * Math.random() * Math.random()
      );
      var hold = string.charAt(entity1);
      hold = password.length % 2 === 0 ? hold.toUpperCase() : hold;
      character += hold;
      character += numeric.charAt(entity2);
      character += punctuation.charAt(entity3);
      password = character;
    }
    password = password
      .split("")
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join("");
    return password.substr(0, len);
  }

  return (
    <div className="innerDiv column">
      <Auth></Auth>
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
              id="passwordInput"
              className="passwordInput"
            ></input>
            <div className="passwordShowAddDiv">
              <MdRemoveRedEye
                onClick={() => {
                  function show() {
                    var p = document.getElementById("passwordInput");
                    p.setAttribute("type", "text");
                  }

                  function hide() {
                    var p = document.getElementById("passwordInput");
                    p.setAttribute("type", "password");
                  }
                  if (pwShow === 0) {
                    setPwShow(1);
                    show();
                  } else {
                    setPwShow(0);
                    hide();
                  }
                }}
                className="showPasswordAdd"
              ></MdRemoveRedEye>
            </div>
            <button
              onClick={() => {
                setPassword(password_generator(20));
              }}
              className="passwordGeneratorButton"
            >
              Generate
            </button>
            <button onClick={handelAdd} className="addButton">
              Add
            </button>
          </div>
        </div>
      </Collapsible>
      <div className="center">
        {" "}
        <hr className="rounded"></hr>
      </div>
      <div className="searchBar row">
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Search"
          onKeyPress={(e) => {
            if (e.key === "Enter") e.target.blur();
          }}
          type="text"
          className="searchInput"
        ></input>
        <MdSearch className="searchIcon"></MdSearch>
      </div>
      <div className="center">
        {" "}
        <hr className="rounded"></hr>
      </div>

      <div className="passwordList column ">
        {search.length > 0 && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="resetButton"
          >
            Reset search
          </button>
        )}
        {passwords
          .filter(
            (password) =>
              password.name
                .toLowerCase()
                .includes(search.toString().toLowerCase()) ||
              password.url
                .toLowerCase()
                .includes(search.toString().toLowerCase())
          )
          .map((password) => {
            return (
              <PasswordRow
                key={password.id}
                props={password}
                refresh={getPasswords}
                showSnackBar={showToast}
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
