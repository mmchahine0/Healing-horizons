import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ChooseSickness = () => {
  return (
    <>
    <Navbar />

    <nav>
      <Link to="/doctors" >Next</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    <Footer />
    </>
  );
}

export default ChooseSickness;