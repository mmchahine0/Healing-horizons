import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
    <nav>
    <Link to="/room" reloadDocument>reserve a room</Link>
    <Link to="/chooseSickness" reloadDocument>make an appointment</Link>
    <Link to="/meds" reloadDocument>buy meds here</Link>
    <Link to="/doctors" reloadDocument>checkout our doctors here</Link>
    <Link to="/cart" reloadDocument>your cart</Link>
    <Link to="/chatting" reloadDocument>chat with our bot system here</Link>

    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    </>
  );
}

export default Home;