import { Link, useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorProfileS from "../components/DoctorProfile";

const DoctorProfile = () => {
  const { doctorIdString } = useParams();

  const appointmentRoute = `/appointment/${doctorIdString}`;
  const emailSender = `/emailSend/${doctorIdString}`


  return (
    <>
      <Navbar />
      <DoctorProfileS userId={doctorIdString} />
      <nav className="profile-a">
        <Link to={appointmentRoute}>Make an Appointment</Link> <br/>
        <Link to={emailSender}>Send an Email</Link>
      </nav>
      <Footer />
    </>
  );
}

export default DoctorProfile;
