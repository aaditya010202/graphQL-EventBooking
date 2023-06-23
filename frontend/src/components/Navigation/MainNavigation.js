import React from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
const MainNavigation = (props) => {
  return (
    <header className="main-navigation">
      <div className="main-navigation_logo">
        <h1>Easy Event</h1>
      </div>

      <nav className="main-navigation_items">
        <ul>
          <li>
            <NavLink to="/events">events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
          <li>
            <NavLink to="/auth">Authenticate</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
// NavLink does not allow the page to reload but a normal anchor tag reloads the page
