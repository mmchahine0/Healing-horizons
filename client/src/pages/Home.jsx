import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import roomimg from '../images/room.png';
import appointmentimg from '../images/appointment.png';
import doctorimg from '../images/doctor.png';
import medsimg from '../images/meds.png';

import "../styles/HomeStyles.css"

const Home = () => {
  return (
    <>
    <Navbar />

    <div className="firstColumnHome">
      <div className="image-container">
        <img src={roomimg} alt="Hospital Image" />
        <div className="column-textHome" style={{ borderRight: '3px solid #022d36' }}>
          <p>Text about our hospital</p>
          <p style={{ paddingTop: '5px' }}>Discover your perfect retreat.</p>
          <p style={{ paddingTop: '5px' }}>Book a cozy room with modern amenities.</p>
          <p style={{ paddingTop: '5px' }}> Unwind and make memories</p>
          <p style={{ paddingTop: '5px' }}>in our welcoming accommodations.</p></div>
          <button className="buttonHome">Reserve a Room</button>

      </div>
    </div>

      <div className="secondColumnHome">
        <div className="image-container">
          <img src={appointmentimg} alt="Hospital Image" />
          <div className="column-textHome" style={{ borderLeft: '3px solid #022d36' }}>
          <p style={{ paddingTop: '5px', textAlign:"left"}}>Take control of your health.</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Schedule medical appointments easily.</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Connect with trusted healthcare</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>providers and prioritize your well-being.</p></div>
          <button className="buttonHome">Make an Appointment</button>
        </div>
      </div>

      <div className="thirdColumnHome">
        <div className="image-container">
          <img src={medsimg} alt="Hospital Image" />
          <div className="column-textHome" style={{ borderRight: '3px solid #022d36' }}>
          <p style={{ paddingTop: '5px' }}>Browse a vast range of quality medicines products</p>
          <p style={{ paddingTop: '5px' }}> Order conveniently and have</p>
          <p style={{ paddingTop: '5px' }}>your essentials delivered to your door.</p>
          </div>
          <a href="/meds" className="buttonHome">We do sell Medicine</a>
        </div>
      </div>

      <div className="forthColumnHome">
        <div className="image-container">
          <img src={doctorimg} alt="Hospital Image" />
          <div className="column-textHome" style={{ borderLeft: '3px solid #022d36' }} >
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Explore diverse doctor profiles.</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}>Discover expertise and book appointments</p>
          <p style={{ paddingTop: '5px', textAlign:"left" }}> with trusted healthcare professionals tailored to your needs.</p>
          </div>
          <a href="/doctorList" className="buttonHome">Check out our Doctors</a>
        </div>
      </div>

      <div className="circleColumnHome">
  <div className="health-infoHome">
    <div className="info-itemHome">
      <i className="fas fa-apple-alt"></i>
      <div className="health-tip">Tip: Include fruits and vegetables in your daily diet.</div>
    </div>
    <div className="info-itemHome">
      <i className="fas fa-dumbbell"></i>
      <div className="health-tip">Tip: Exercise regularly to stay fit and healthy.</div>
    </div>
    <div className="info-itemHome">
      <i className="fas fa-bed"></i>
      <div className="health-tip">Tip: Aim for 7-9 hours of quality sleep each night.</div>
    </div>
    <div className="info-itemHome">
      <i className="fas fa-glass-whiskey"></i>
      <div className="health-tip">Tip: Stay hydrated by drinking enough water throughout the day.</div>
    </div>
  </div>
</div>


    <Footer />
    </>
  );
}

export default Home;