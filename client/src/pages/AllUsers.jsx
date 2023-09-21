import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import "../styles/AllUsersStyles.css";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3500/auth/allusers', {});
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickVisit = (selectedUserId) => {
    const userId = selectedUserId.toString()
    navigate(`/patientProfile/${userId}`);
  }

  const filteredUsers = users.filter(user => {
    return user.fullname.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="containerUser">
        <h2 className="h2User">All Users</h2>
        <input
          type="text"
          placeholder="Search by fullname"
          className="textInputUser"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul className="ulUser">
          {filteredUsers.map((user) => (
            <li className="liUser" key={user._id}>
              {user.fullname} - {user.username} - {user.email} <br/>
              <button onClick={() => handleClickVisit(user._id)}>Visit Profile</button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default AllUsers;
