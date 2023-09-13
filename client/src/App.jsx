import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

//pages 
import Home from "./pages/Home"
import Appointment from './pages/appointment';
import Bill from './pages/bill';
import Cart from './pages/cart';
import ChooseSickness from './pages/chooseSickness';
import DoctorList from './pages/doctorList';
import DoctorProfile from './pages/doctorProfile';
import EmailSend from './pages/emailSend';
import Login from './pages/login';
import Signup from './pages/signup';
import Meds from './pages/meds';
import PatientProfile from './pages/patientProfile';
import Room from './pages/room';
import ChattingAi from './pages/chattingAi';
import Survey from './pages/survey';
import AdminPage from './pages/adminPage';
import NotFound from './pages/notFound';

//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
          <Routes>
            <Route
              path="*"
              element={<NotFound />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/home"
              element={<Home />}
            />
            <Route
              path="/adminPage"
              element={<AdminPage/>}
            />
            <Route
              path="/appointment"
              element={<Appointment />}
            />
            <Route
              path="/cart"
              element={<Cart />}
            />
            <Route
              path="/bill"
              element={<Bill />}
            />
            <Route
              path="/chooseSickness"
              element={<ChooseSickness />}
            />
            <Route
              path="/doctors"
              element={<DoctorList />}
            />
            <Route
              path="/doctorProfile"
              element={<DoctorProfile />}
            />
            <Route
              path="/emailSend"
              element={<EmailSend />}
            />
            <Route
              path="/meds"
              element={<Meds />}
            />
            <Route
              path="/patientProfile"
              element={<PatientProfile />}
            />
            <Route
              path="/room"
              element={<Room />}
            />
            <Route
              path="/chatting"
              element={<ChattingAi />}
            />
            <Route
              path="/survey"
              element={<Survey />}
            />
          </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
