import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import { useRef, useState, useEffect } from 'react';
import useAuth from '../context/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [welcome, setWelcome] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3500/auth/login', JSON.stringify({ email, password }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const token = response?.data?.token;
      const role = response?.data?.role;
      const message = response?.data?.message;

      // Update auth context to include the token
      setAuth((prevAuth) => ({
        ...prevAuth,
        token: token,
        role: role,
      }));
        // const tokenWithBearer = `Bearer ${token}`;

      // Set the token in a cookie named 'jwt'
      Cookies.set('jwt', token, { expires: 7 });

      setSuccess(true);
      setWelcome(message);
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      console.error(err);

      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className="sectionRegister">
          <h1 style={{ color: '#fff', transition: '0.3s ease-in-out' }}>{welcome} !</h1>
          <br />
        </section>
      ) : (
        <section className="sectionRegister">
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <h1 style={{ color: '#fff' }}>Sign In</h1>
          <form onSubmit={handleSubmit} className="formRegistry">
            <label style={{ color: '#fff' }} htmlFor="email" className="labelRegistry">
              Email:
            </label>
            <input
              className="inputRegistry"
              type="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <label style={{ color: '#fff' }} htmlFor="password" className="labelRegistry">
              Password:
            </label>
            <input
              className="inputRegistry"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button className="buttonRegistry">Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <a className="aRegistry" href="/signup">
                Sign Up
              </a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
