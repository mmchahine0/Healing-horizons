import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate()

  // useEffect(() =>
  //   setTimeout(() => {
  //   navigate("/")},
  //   1000)) to navigate after submission

  return (
    <>
    <div className="home">
      <h2>Home</h2>
    </div>
    </>
  );
}

export default Appointment;