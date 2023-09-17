import React, { useState } from 'react';
import "../styles/ProfileStyles.css";

const DoctorProfile = ({ email, dateofbirth, officeHours, specialty, image, bio, onUpdateDateOfBirth }) => {
  const [newDateOfBirth, setNewDateOfBirth] = useState(dateofbirth);

  const handleDateOfBirthChange = (event) => {
    setNewDateOfBirth(event.target.value);
  };

  const handleUpdateDateOfBirth = () => {
    onUpdateDateOfBirth(newDateOfBirth);
  };

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>
      <div>
        <label>Email:</label>
        <span>{email}</span>
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" value={newDateOfBirth} onChange={handleDateOfBirthChange} />
        <button onClick={handleUpdateDateOfBirth}>Update Date of Birth</button>
      </div>
      <div>
        <label>Office Hours:</label>
        <ul>
          {officeHours.map((hours, index) => (
            <li key={index}>{`${hours.day}: ${hours.startTime} - ${hours.endTime}`}</li>
          ))}
        </ul>
      </div>
      <div>
        <label>Specialty:</label>
        <span>{specialty}</span>
      </div>
      <div>
        <label>Image:</label>
        <img src={image} alt="Doctor's profile" />
      </div>
      <div>
        <label>Bio:</label>
        <span>{bio}</span>
      </div>
    </div>
  );
};

export default DoctorProfile;
