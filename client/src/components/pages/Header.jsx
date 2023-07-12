import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import { Nav, Navbar, Container, Image, Button } from "react-bootstrap";

function Header() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar>
      <Navbar.Brand>
        <Link to="/">SF6 Lab Assistant</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;
