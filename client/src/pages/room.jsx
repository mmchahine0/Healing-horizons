import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Room = () => {
  return (
    <>
    <Navbar />


    <nav>
      <Link to="/cart" >pay here</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    <Footer />
    </>
  );
}

export default Room;