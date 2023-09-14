import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DoctorProfile = () => {
  return (
    <>
    <Navbar />

    <nav>
    <Link to="/appointment" >Make an appointment here</Link>
    <Link to="/email">Send an email</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    <Footer />
    </>
  );
}

export default DoctorProfile;