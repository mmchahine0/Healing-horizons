import React, { useState, useEffect } from "react";
import axios from "axios";

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
  }, [doctorId]);

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
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
//adjust the office hours
  return (
    <div>
      {doctor && (
        <>
          <h2>Book Appointment</h2>
          <div>
            <p>Doctor Name: {doctor.fullname}</p>
            <p>Specialty: {doctor.specialty}</p>
            <p>Email: {doctorEmail}</p>
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
    </div>
  );
};

export default BookAppointment;
