import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserProfile from '../components/UserProfile';

const PatientProfile = () => {
  const [userProfileData, setUserProfileData] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/user/ownUser`); 
        setUserProfileData(response.data.user._id);
        console.log(response.data.user._id)
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <Navbar />
      <UserProfile userId={userProfileData} />
      <Footer />
    </>
  );
};

export default PatientProfile;