import React from "react";
import "./passwordRow.scss";
import { useState, useEffect } from "react";
import {
  MdRemoveRedEye,
  MdMoreVert,
  MdDelete,
  MdModeEdit,
  MdClose,
} from "react-icons/md";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { REACT_APP_API } from "../constants";

export default function PasswordRow(props, refresh) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  function showDropdownFunc() {
    setShowDropdown(true);
  }

  function hideDropdownFunc() {
    setShowDropdown(false);
  }

  function showSnackbar(message) {
    setMessage(message);
    setOpen(true);
  }

  async function deleteEntity() {
    try {
      const res = await fetch(`${REACT_APP_API}/delpasswords/${props.id}`);
      const data = await res.text();
      if (data === "success") {
        showSnackbar("successfully deleted");
      } else {
        showSnackbar("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      showSnackbar("Something went wrong!");
    }
    hideDropdownFunc();
    refresh();
  }
  function modifyEntity() {
    hideDropdownFunc();
  }

  async function getPassword() {
    try {
      var res = await fetch(`${REACT_APP_API}/passwords/${props.id}`);
      const data = await res.text();
      if (data === "error") {
        setPassword("This entity is corrupted, please make a new entry!");
        return;
      }
      setPassword(data);
    } catch (error) {
      console.log(error);
    }
  }

  props = props.props;
  const imageUrl =
    props.url === undefined
      ? "jonas-strabel.de"
      : props.url.replace("https://", "");

  const Image = (
    <img
      className="favicon"
      alt="icon"
      src={`https://s2.googleusercontent.com/s2/favicons?domain=${imageUrl}`}
    ></img>
  );

  const Name = <div className="name">{props.name}</div>;

  const Password = (
    <div className="password">{isPasswordVisible ? password : "●●●●●●●●"}</div>
  );

  const Url = (
    <div className="url">
      {props.url === "none" || props.url === "" ? "Url not set" : props.url}
    </div>
  );

  return (
    <>
      <div className="mainContainer">
        <div className="row container">
          {Image}
          {Name}
          <div className="column">
            <div className="urlTag">Url</div> {Url}
          </div>

          {Password}
        </div>
        <div className="row iconContainer">
          <MdRemoveRedEye
            className="showPassword"
            onClick={() => {
              if (password === "") getPassword();
              setPasswordVisible(!isPasswordVisible);
            }}
          ></MdRemoveRedEye>
          <MdMoreVert
            onClick={() => showDropdownFunc()}
            className="moreOptions"
          ></MdMoreVert>
          {showDropdown && (
            <div className="dropdownMenu column">
              <div onClick={modifyEntity} className="edit row">
                <MdModeEdit className="editIcon"> </MdModeEdit>
                Edit
              </div>
              <div onClick={deleteEntity} className="delete row">
                <MdDelete className="deleteIcon"> </MdDelete>
                Delete
              </div>
              <div onClick={hideDropdownFunc} className="delete row">
                <MdClose className="deleteIcon"> </MdClose>
                Close
              </div>
            </div>
          )}
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
    </>
  );
}
