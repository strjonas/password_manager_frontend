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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (localStorage.getItem("key") === null) {
      showToast("Please Login first!");
      setPasswords([]);
      return;
    }
    const key = localStorage.getItem("key");
    const pwds = await fetch(`${API}/allkeys/${key}`);
    var data;

    data = await pwds.text();
    if (data === "Wrong Password") {
      setPasswords([]);
      showToast("Wrong Login Password");
      return;
    }
    setPasswords(Array.from(JSON.parse(data)));
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
    if (localStorage.getItem("key") === null) {
      showToast("Please Login first!");
      return;
    }
    if (url === "") setUrl("none");
    const body = { id, password, name, url };
    try {
      const key = localStorage.getItem("key");
      const answer = await fetch(`${API}/new/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await answer.text();
      if (data === "Wrong Password") {
        setPassword("");
        setName("");
        setUrl("");
        showToast("Wrong Login Password");
        return;
      }
      showToast("Successfully added!");

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
      <Auth refresh={getPasswords}></Auth>
      <Collapsible label="New Password">
        <div className="inputContainer">
          <div
            className={`urlAndName ${
              window.innerWidth > 500 ? "row" : "column"
            }`}
          >
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
          <div className={`${window.innerWidth > 500 ? "row" : "column"}`}>
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
