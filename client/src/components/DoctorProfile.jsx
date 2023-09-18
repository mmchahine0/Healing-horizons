import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DoctorProfile = ({userId}) => {

  const [doctorInfo, setDoctorInfo] = useState({});
  const [doctorEmail, setDoctorEmail] = useState("");
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3500/doctor/getspecific/${userId}`)
      .then((response) => {
        setDoctorInfo(response.data.doctor);
        setDoctorEmail(response.data.doctor.email);
        console.log(response.data.doctor)
      })
      .catch((error) => {
        console.error("Error fetching doctor information:", error);
      });
  }, [userId]);

  return (
    <div className="doctor-profile">
      <h1>Doctor Profile</h1>
      <img className="profile-image" src={doctorInfo.image} alt={doctorInfo.fullname}></img>
      <h2>{doctorInfo.fullname}</h2>
      <p>Email: {doctorEmail}</p>
      <p>Specialty: {doctorInfo.specialty}</p>
      <p>Bio: {doctorInfo.bio}</p>
      <p>Office Hours: {doctorInfo.officeHours}</p>
    </div>
  );
};

export default DoctorProfile;
