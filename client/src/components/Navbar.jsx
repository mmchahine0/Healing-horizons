import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import axios from 'axios'; 
import logo from "../images/Logo.png";
import '../styles/NavbarStyles.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(''); 

  useEffect(() => {
    axios.get('http://127.0.0.1:3500/user/ownUser')
      .then((response) => {
        setUserRole(response.data.user.role);
        setUserId(response.data.user._id);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }, []);

  const handleClick = () => {
    localStorage.removeItem('jwt');
    navigate("/login");
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
            {userRole === "user" && (
              <>
                <li><Link to={`/patientProfile/${userId}`}>Profile</Link></li> 
                <li><a href="/cart">Cart</a></li>
                <li><a href="/chatting">Chat with AI</a></li>
                <li><Link to={`/appointments/${userId}`}>Appointments</Link></li>  
              </>
            )}
            <li><button onClick={handleClick}>Sign out</button></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
