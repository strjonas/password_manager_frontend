import React from "react";
import "./passwordRow.scss";
import { useState, useEffect } from "react";
import { MdRemoveRedEye, MdMoreVert } from "react-icons/md";
import { REACT_APP_API } from "../constants";

export default function PasswordRow(props) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    getPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getPassword() {
    try {
      var res = await fetch(`${REACT_APP_API}/passwords/${props.id}`);
      const data = await res.text();
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
          onClick={() => {
            if (password === "") getPassword();
            setPasswordVisible(!isPasswordVisible);
          }}
        ></MdRemoveRedEye>
        <MdMoreVert className="moreOptions"></MdMoreVert>
      </div>
    </div>
  );
}
