import React, { useState, useEffect, useRef } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "../styles/NavBar.module.css";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import axios from "axios";

const NavBar = () => {
  const [navExpanded, setNavExpanded] = useState(false); // State to manage whether the navbar is expanded (mobile view)
  const navRef = useRef(null); // Ref to keep track of the navbar element for handling outside clicks
  const currentUser = useCurrentUser(); // Context hook to get the current logged-in user
  const setCurrentUser = useSetCurrentUser(); // Context hook to update the current user (used for logout)

  // Function to handle user sign-out
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/"); // Make a request to the backend to log out the user
      setCurrentUser(null); // Reset the current user in the context
      handleNavLinkClick(); // Close the navbar (if expanded)
    } catch (err) {
      console.log(err); // Log any errors that occur during the logout process
    }
  };

  // Function to handle clicking on a navigation link
  const handleNavLinkClick = () => {
    setNavExpanded(false); // Close the navbar when a link is clicked
  };

  // Function to handle clicks outside the navbar (to close the navbar if it's open)
  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setNavExpanded(false); // Close the navbar if the click was outside the navbar
    }
  };

  // useEffect hook to add and clean up the event listener for detecting outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Add event listener when the component mounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Remove event listener when the component unmounts
    };
  }, []);

  // Link to add a new task, visible when the user is logged in
  const addTask = (
    <NavLink
      className={styles.NavLink}
      activeClassName={styles.Active}
      to="/tasks/create"
      onClick={handleNavLinkClick}
    >
      <i className="far fa-plus-square"></i>Add task
    </NavLink>
  );

  // Navigation links visible when the user is logged in
  const loggedInIcons = (
    <>
      <NavLink
        exact
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/"
        onClick={handleNavLinkClick}
      >
        <i className="fas fa-home"></i>Home
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
        onClick={handleNavLinkClick}
      >
        <i className="far fa-user"></i>Profile
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/aboutus"
        onClick={handleNavLinkClick}
      >
        <i className="fas fa-info-circle"></i>About
      </NavLink>
      <NavLink className={styles.NavLink} to="/signin" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
    </>
  );

  // Navigation links visible when the user is logged out
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/signin"
        onClick={handleNavLinkClick}
      >
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink
        to="/signup"
        className={styles.NavLink}
        activeClassName={styles.Active}
        onClick={handleNavLinkClick}
      >
        <i className="fas fa-user-plus"></i>Sign up
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/aboutus"
        onClick={handleNavLinkClick}
      >
        <i className="fas fa-info-circle"></i>About
      </NavLink>
    </>
  );

  return (
    <Navbar
      className={styles.NavBar}
      expand="md" // Enable expanding behavior on medium devices
      fixed="top" // Fix the navbar at the top of the viewport
      expanded={navExpanded} // Control the expansion of the navbar (state-controlled)
      onToggle={(expanded) => setNavExpanded(expanded)} // Handle navbar toggling
      ref={navRef} // Ref for tracking clicks outside the navbar
    >
      <Container>
        {currentUser && addTask} {/* Show the "Add Task" link if the user is logged in */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto" /> {/* Toggle button for collapsing the navbar */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-center">
            {currentUser ? loggedInIcons : loggedOutIcons} {/* Display appropriate navigation links based on user's login status */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
