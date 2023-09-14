import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Appointment = () => {
  const navigate = useNavigate()

  // useEffect(() =>
  //   setTimeout(() => {
  //   navigate("/")},
  //   1000)) to navigate after submission

  return (
    <>
    <Navbar />
    <div className="home">
      <h2>Home</h2>
    </div>
    <Footer />
    </>
  );
}

export default Appointment;