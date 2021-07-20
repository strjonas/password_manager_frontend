import React from "react";
import { useRef, useState } from "react";
import "./Collapsible.css";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Collapsible(props) {
  const [isOpen, setIsOpen] = useState(false);

  const parentRef = useRef();
  return (
    <div className="collapsible">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button className="toggle" onClick={() => setIsOpen(!isOpen)}>
          {props.label}
        </button>
        <div className="iconButtonDeCollapse">
          <MdKeyboardArrowDown
            onClick={() => setIsOpen(!isOpen)}
          ></MdKeyboardArrowDown>
        </div>
      </div>
      <div className="stroke"></div>
      <div
        className="content-parent"
        ref={parentRef}
        style={
          isOpen
            ? {
                height: parentRef.current.scrollHeight + "px",
                marginBottom: "5vh",
              }
            : {
                height: "0px",
              }
        }
      >
        <div className="content">{props.children}</div>
      </div>
    </div>
  );
}
