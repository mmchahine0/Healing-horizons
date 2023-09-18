import { Link, useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorProfileS from "../components/DoctorProfile";

const DoctorProfile = () => {
  const { doctorIdString } = useParams();

  const appointmentRoute = `/appointment/${doctorIdString}`;

  return (
    <>
      <Navbar />
      <DoctorProfileS userId={doctorIdString} />
      <nav>
        <Link to={appointmentRoute}>Make an appointment here</Link>
        <Link to="/email">Send an email</Link>
      </nav>
      <Footer />
    </>
  );
}

export default DoctorProfile;
