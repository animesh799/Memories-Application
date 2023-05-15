import React from "react";
import ReactDOM from "react-dom";
import "./SideDrawer.css";
import { CSSTransition } from "react-transition-group";

const SideDrawer = (props) => {
  return ReactDOM.createPortal(
    <CSSTransition classNames="side-in-left" in={props.show} mountOnEnter unmountOnExit timeout={200}>
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>,
    document.getElementById("side-drawer")
  );
};

export default SideDrawer;
