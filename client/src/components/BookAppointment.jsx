import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/BookAppointmentStyles.css";

const BookAppointment = ({ doctorId }) => {
  const DocId = doctorId.doctorIdString;
  const [doctor, setDoctor] = useState({});
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [doctorEmail, setDoctorEmail] = useState("");       

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/doctor/getspecific/${DocId}`);
        setDoctor(response.data.doctor);
        setDoctorEmail(response.data.doctor.email);
      } catch (error) {
        console.error("Error fetching doctor information:", error);
      }
    };

    fetchDoctorInfo();
  }, [DocId]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    const formattedAppointmentDate = `${appointmentDate.getFullYear()}-${
      String(appointmentDate.getMonth() + 1).padStart(2, '0')
    }-${String(appointmentDate.getDate()).padStart(2, '0')}T${String(
      appointmentDate.getHours()
    ).padStart(2, '0')}:${String(appointmentDate.getMinutes()).padStart(2, '0')}`;
  
    try {
      const response = await axios.post("http://127.0.0.1:3500/appointment/book", {
        doctorId: DocId,
        appointmentDate: formattedAppointmentDate
      });
      console.log("Appointment booked successfully:", response.data);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error booking appointment, try another date.");
    }
  };

  return (
    <div className="book-appointment-container">
      {doctor && (
        <>
          <h2>Book Appointment</h2>
          <div className="doctor-info">
            <img className="profile-image" src={doctor.image} alt={doctor.fullname} />
            <p className="profile-p">You're making an appointment with doctor: <p className="profile-p" style={{fontWeight:"bold"}}>{doctor.fullname}</p></p>
            <p className="profile-p">Specialty: {doctor.specialty}</p>
            <p className="profile-p">Email: {doctorEmail}</p>
          </div>
          <form onSubmit={handleBookAppointment}>
            <input
              type="datetime-local"
              value={appointmentDate.toISOString().slice(0, 16)}
              onChange={(e) => setAppointmentDate(new Date(e.target.value))}
            />
            <button type="submit">Book Appointment</button>
          </form>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookAppointment;
