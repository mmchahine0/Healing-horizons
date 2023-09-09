import { Link } from "react-router-dom";

const DoctorList = () => {
  return (
    <>
    <nav>
      <Link to="/doctoProfile" reloadDocument>visit</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    </>
  );
}

export default DoctorList;