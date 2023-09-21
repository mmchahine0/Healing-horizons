import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/AllAppointmentStyles.css";

const AllAppointment = () => {
  const { userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
        setAppointments(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://127.0.0.1:3500/appointment/cancel/${appointmentId}`);
      const response = await axios.get(`http://127.0.0.1:3500/appointment/get/${userId}`);
      setAppointments(response.data.data);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error("Error cancelling appointment");
    }
  };

  return (
    <>
      <Navbar />
      <div id="appointments-container">
        <h2 style={{padding:"10px"}}>Your Appointments: </h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <ul style={{padding:"5px", margin:"10px"}} id="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-item">
                <div className="datetime">
                  Date: {appointment.date}, Time: {appointment.time}
                </div>
                <button onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default AllAppointment;
