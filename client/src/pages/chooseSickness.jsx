import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import '../styles/SpecialtyStyles.css';

const ChooseSickness = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState(null);
  const navigate = useNavigate(); 
  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Urology',
  ];

  const handleSpecialtyClick = (specialty) => {
    console.log(`Specialty clicked: ${specialty}`);
    setSelectedSpecialty(specialty);
    fetchDoctorsForSpecialty(specialty);
  };

  const fetchDoctorsForSpecialty = async (specialty) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3500/doctor/getspecialty/${specialty}`);
      console.log(`Doctors for ${specialty}:`, response.data);
      setDoctors(response.data.data); 
      console.log(response.data.data)
      console.log(typeof response.data.data)
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]); 
    }
  };

  const handleVisit = (doctorId) => {
    const doctorIdString =  doctorId.toString();
    navigate(`/doctorProfile/${doctorIdString}`);
  };

  return (
    <>
      <Navbar />
      <div style={{ width: '80%', margin: '0 auto' }}>
        <h2 style={{ padding: '10px', borderLeft: '#022d36 solid' }}>Choose your intended Specialty: </h2>
        <div className="specialty-buttons">
          {specialties.map((specialty, index) => (
            <button
              key={index}
              onClick={() => handleSpecialtyClick(specialty)}
              className="specialty-button"
            >
              {specialty}
            </button>
          ))}
        </div>
        {selectedSpecialty && (
          <div>
            <h2 style={{ padding: '10px', borderLeft: '#022d36 solid' }}>Doctors for {selectedSpecialty}:</h2>
            {doctors !== null ? (
              <ul>
                {doctors.map((doctor, index) => (
                  <li style={{ padding: '10px' }} key={index}>
                    <img className="profile-image" src={doctor.image} alt={doctor.fullname} /> <br />
                    <strong>Name:</strong> {doctor.fullname}, <strong>Email:</strong> {doctor.email}, <strong>Specialty:</strong> {doctor.specialty} <br/>
                    <button className="visit-button" onClick={() => handleVisit(doctor._id)}>Visit</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading doctors...</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ChooseSickness;
