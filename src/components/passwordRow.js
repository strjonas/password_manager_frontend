import React from "react";
import "./passwordRow.scss";
import { useState } from "react";
import { MdRemoveRedEye, MdMoreVert } from "react-icons/md";

function getPassword() {
  var password = "";

  return password;
}

export default function PasswordRow(props) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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
    <div className="password">
      {isPasswordVisible ? getPassword() : "********"}
    </div>
  );

  const Url = (
    <div className="url">
      {props.url === "none" ? "Url not set" : props.url}
    </div>
  );

  return (
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
          onClick={() => setPasswordVisible(!isPasswordVisible)}
        ></MdRemoveRedEye>
        <MdMoreVert className="moreOptions"></MdMoreVert>
      </div>
    </div>
  );
}
