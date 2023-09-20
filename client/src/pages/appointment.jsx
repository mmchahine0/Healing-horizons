import {  useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookAppointment from "../components/BookAppointment";

const Appointment = () => {
  const doctorIdString = useParams();

  return (
    <>
    <Navbar />
    <BookAppointment doctorId={doctorIdString}/>
    <Footer />
    </>
  );
}

export default Appointment;