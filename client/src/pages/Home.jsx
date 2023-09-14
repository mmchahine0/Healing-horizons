import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
    <Navbar />

    <nav>
    <Link to="/room" >reserve a room</Link>
    <Link to="/chooseSickness" >make an appointment</Link>
    <Link to="/meds" >buy meds here</Link>
    <Link to="/doctors">checkout our doctors here</Link>
    <Link to="/cart" >your cart</Link>
    <Link to="/chatting" >chat with our bot system here</Link>

    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    <Footer />
    </>
  );
}

export default Home;