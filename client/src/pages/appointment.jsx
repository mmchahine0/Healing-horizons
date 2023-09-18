import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookAppointment from "../components/BookAppointment";

const Appointment = () => {
  const navigate = useNavigate()
  const doctorIdString = useParams();

  // useEffect(() =>
  //   setTimeout(() => {
  //   navigate("/")},
  //   1000)) to navigate after submission

  return (
    <>
    <Navbar />
    <BookAppointment doctorId={doctorIdString}/>
    <Footer />
    </>
  );
}

export default Appointment;