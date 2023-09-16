import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

//pages 
import Home from "./pages/Home"
import Appointment from './pages/appointment';
import Bill from './pages/bill';
import CartS from './pages/cartS';
import ChooseSickness from './pages/chooseSickness';
import DoctorList from './pages/doctorList';
import DoctorProfile from './pages/doctorProfile';
import EmailSend from './pages/emailSend';
import LoginS from './pages/login';
import Signup from './pages/signup';
import Meds from './pages/meds';
import PatientProfile from './pages/patientProfile';
import Room from './pages/room';
import ChattingAi from './pages/chattingAi';
import Survey from './pages/survey';
import AdminPage from './pages/adminPage';
import NotFound from './pages/notFound';
//components
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthProvider';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout/>}>
            <Route
              path="/*"
              element={<NotFound />}
            />
            {/* public routes */}
            <Route
              path="/login"
              element={<LoginS />}
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            {/* protected */}
            <Route element={<RequireAuth allowedRole={["user"]}/>}>
              <Route
              path="/home"
              element={<Home />}
              />
              <Route
              path="/appointment"
              element={<Appointment />}
              />
              <Route
              path="/cart"
              element={<CartS />}
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
              {/* only once */}
              <Route
              path="/survey"
              element={<Survey />}
              />
          </Route>
            {/* specified role to precced */}
          <Route element={<RequireAuth allowedRole={["doctor","admin"]}/>}>

            <Route
              path="/adminPage"
              element={<AdminPage/>}
            />
          </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
