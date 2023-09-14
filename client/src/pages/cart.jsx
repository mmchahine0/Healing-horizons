import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  // useEffect(() =>
  //   setTimeout(() => {
  //   navigate("/")},
  //   1000)) to navigate after paying
  return (
    <>
    <Navbar />
    
    {/* <nav>
      <Link to="/order"></Link>
    </nav> */}
    
    <div className="home">
      <h2>Home</h2>
    </div>
    <Footer />
    </>
  );
}

export default Cart;