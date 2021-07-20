import React from "react";

export default function PasswordRow(props) {
  props = props.props;
  console.log(props);
  const imageUrl =
    props.url === undefined
      ? "jonas-strabel.de"
      : props.url.replace("https://", "");
  console.log(imageUrl);
  return (
    <div>
      <img
        alt="favicon"
        src={`https://s2.googleusercontent.com/s2/favicons?domain=${imageUrl}`}
      ></img>
    </div>
  );
}
