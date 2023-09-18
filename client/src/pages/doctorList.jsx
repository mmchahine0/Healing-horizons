import React, { useState, useEffect } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/doctorListStyles.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3500/doctor/get")
      .then((response) => {
        setDoctors(response.data.doctors);
        console.log(response.data.doctors);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleVisitClick = (doctorId) => {
    const doctorIdString = doctorId.toString();
    navigate(`/doctorProfile/${doctorIdString}`);
  };
  

  return (
    <>
      <Navbar />

      <div className="doctor-list">
        <h1>Available Doctors</h1>
        <ul>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <li key={doctor._id} className="doctor-item">
                <img src={doctor.image} alt={`${doctor.fullname} Image`} />
                <div className="doctor-info">
                  <h2>{doctor.fullname}</h2>
                  <p>{doctor.specialty}</p>
                </div>
                <button onClick={() => handleVisitClick(doctor._id)}>Visit</button>
              </li>
            ))
          ) : (
            <p>No doctors found</p>
          )}
        </ul>
      </div>

      <Footer />
    </>
  );
};

export default DoctorList;
