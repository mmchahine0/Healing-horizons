import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorProfile = ({userId}) => {

  const [doctorInfo, setDoctorInfo] = useState({});
  const [doctorEmail, setDoctorEmail] = useState("");
  const [officeHours, setOfficeHours] = useState([]);


  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3500/doctor/getspecific/${userId}`)
      .then((response) => {
        setDoctorInfo(response.data.doctor);
        setDoctorEmail(response.data.doctor.email);
      })
      .catch((error) => {
        console.error("Error fetching doctor information:", error);
      });
  }, [userId]);

  useEffect(() => {
      axios
        .get(`http://127.0.0.1:3500/doctor/getOffice/${userId}`)
        .then((response) => {
          setOfficeHours(response.data.officeHours);
          console.log(response.data.officeHours)
        })
        .catch((error) => {
          console.error("Error fetching office hours:", error);
        });
  }, [userId]);

  return (
    <div className="profile-container">
    <h1>Doctor Profile</h1>
    <img className="profile-image" src={doctorInfo.image} alt={doctorInfo.fullname} />
    <h2>{doctorInfo.fullname}</h2>
    <p className="profile-p">Email: {doctorEmail}</p>
    <p className="profile-p">Specialty: {doctorInfo.specialty}</p>
    <p className="profile-p">Bio: {doctorInfo.bio}</p>
    <div>
      <p className="profile-p">Office Hours:</p>
      <ul>
        {officeHours.map((officeHour, index) => (
          <li className="profile-p" key={index}>
            <p className="profile-p">Day: {officeHour.day}</p>
            <p className="profile-p">Start Time: {officeHour.startTime}</p>
            <p className="profile-p">End Time: {officeHour.endTime}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default DoctorProfile;
