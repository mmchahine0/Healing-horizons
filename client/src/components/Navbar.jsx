import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../images/Logo.png";
import '../styles/NavbarStyles.css'

class Navbar extends Component {
  state={clicked: false};
  handleClick = () => {
    this.setState({clicked: !this.state.clicked});
  }
  render(){
  return (
    <>
        <nav className="navbar">
          <a href="/home">           
                <img src={logo} alt="Healing Horizons" style={{ width: "105px", height: "80px" }} />
          </a>  
          <div>   
              <ul id="navbar" className={this.state.clicked ? "#navbar active":"#navbar"}>
              <li><a href="/home">Home</a></li>
              <li><a href="/room">Room reservation</a></li>
              <li><a href="/chooseSickness">Appointment</a></li>
              <li><a href="/meds">Meds shopping</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/doctors">Doctors</a></li>
              <li><a href="/chatting">Chat</a></li>

              </ul>
          </div>
          <div id="mobile" onClick={this.handleClick}>
            <i id="bar" className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
          </div>
        </nav>
    </>
  );
};
};

export default Navbar;
