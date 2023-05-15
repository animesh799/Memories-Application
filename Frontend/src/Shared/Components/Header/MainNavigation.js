import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import { useState } from "react";
import BackDrop from "../Utility/Backdrop/Backdrop";
const MainNavigation = (props) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const drawerOpenHandler = () => {
    setDrawerOpen(true);
  };
  const drawerCloseHandler = () => {
    setDrawerOpen(false);
  };
  return (
    <Fragment>
      {isDrawerOpen && <BackDrop onClick={drawerCloseHandler}></BackDrop>}

      <SideDrawer
        className="main-navigation__drawer-nav"
        show={isDrawerOpen}
        onClick={drawerCloseHandler}
      >
        <NavLinks></NavLinks>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={drawerOpenHandler}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Travel Diaries</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks></NavLinks>
        </nav>
      </MainHeader>
    </Fragment>
  );
};

export default MainNavigation;
