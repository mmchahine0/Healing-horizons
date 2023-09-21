import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserProfile from '../components/UserProfile';
import { useParams } from 'react-router-dom';

const PatientProfile = () => {

  const {userId} = useParams();
  
  return (
    <>
      <Navbar />
      <UserProfile userId={userId} />
      <Footer />
    </>
  );
};

export default PatientProfile;