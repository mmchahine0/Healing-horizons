import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import logo from "../images/Logo.png";
import '../styles/NavbarStyles.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    localStorage.removeItem('jwt');
    navigate("/login")
  }

  return (
    <>
      <nav className="navbar">
        <a href="/home">
          <img src={logo} alt="Healing Horizons" style={{ width: "105px", height: "80px" }} />
        </a>
        <div>
          <ul id="navbar" >
            <li><a href="/home">Home</a></li>
            <li><a href="/patientProfile">Profile</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/chatting">Chat with AI</a></li>
            <li><button onClick={handleClick}>Sign out</button></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
