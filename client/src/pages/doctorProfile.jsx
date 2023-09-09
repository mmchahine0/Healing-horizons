import { Link } from "react-router-dom";

const DoctorProfile = () => {
  return (
    <>
    <nav>
    <Link to="/appointment" reloadDocument>Make an appointment here</Link>
    <Link to="/email" reloadDocument>Send an email</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    </>
  );
}

export default DoctorProfile;