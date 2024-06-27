import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import cal_image from "../assets/cal_image.jpg";
import styles from "../styles/NavBar.module.css"
import { NavLink } from "react-router-dom";



const NavBar = () => {
  return (
    <div>
      <Navbar className={styles.NavBar} bg="light" expand="md" fixed="top">
        <Container>
          <NavLink to="/">
          <Navbar.Brand>
            <img src={cal_image} alt="cal_image" height="45" />
          </Navbar.Brand>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <NavLink exact to="/" className={styles.NavLink} activeClassName={styles.Active}>
                <i className="fas fa-calendar-day"></i>
                Home
              </NavLink>
              <NavLink to="/signin" className={styles.NavLink} activeClassName={styles.Active}>
                <i class="fa-solid fa-right-to-bracket"></i>
                Sign In
              </NavLink>
              <NavLink to="/signup" className={styles.NavLink} activeClassName={styles.Active}>
                <i class="fa-solid fa-user-plus"></i>
                Sign Up
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
