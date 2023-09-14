import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import "../styles/RegistryStyles.css"

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const FULLNAME_REGEX = /^[A-Za-z\s]+$/;

const Register = () => {
    const fullnameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const matchPasswordRef = useRef();
    const errRef = useRef();

    const [fullname, setFullname] = useState('');
    const [validFullname, setValidFullname] = useState(false);
    const [fullnameFocus, setFullnameFocus] = useState(false);

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fullnameRef.current.focus();
    }, [])

    useEffect(() => {
        setValidFullname(FULLNAME_REGEX.test(fullname));
    }, [fullname])

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatchPassword(password === matchPassword);
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    }, [fullname, username, email, password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = FULLNAME_REGEX.test(fullname);
        const v2 = USERNAME_REGEX.test(username);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = PASSWORD_REGEX.test(password);

        if (!v1 || !v2 || !v3 || !v4 || password !== matchPassword) {
            setErrMsg("Invalid Entry");
            return;
        }
        
        try {
            const response = await axios.post(
                'http://127.0.0.1:3500/auth/signup',
                JSON.stringify({ fullname, username, email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true, // Allow credentials
                }
            );
            console.log(response?.data);
            console.log(response?.token);
            console.log(JSON.stringify(response))
            setSuccess(true);
            // Clear state and controlled inputs
            setFullname('');
            setUsername('');
            setEmail('');
            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section className="sectionRegister">
                    <h1 style={{color:"#fff"}}>Success!</h1>
                    <p>
                        <a href="/login">Sign In Here!</a>
                    </p>
                </section>
            ) : (
                <section className="sectionRegister">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 style={{color:"#fff"}}>Register</h1>
                    <form onSubmit={handleSubmit} className="formRegistry">
                        {/* Fullname Field */}
                        <label style={{color:"#fff"}} htmlFor="fullname">
                            Fullname:
                            <FontAwesomeIcon icon={faCheck} className={validFullname ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validFullname || !fullname ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="inputRegistry"  // Add the class name here
                            type="text"
                            id="fullname"
                            ref={fullnameRef}
                            autoComplete="off"
                            onChange={(e) => setFullname(e.target.value)}
                            value={fullname}
                            required
                            aria-invalid={validFullname ? "false" : "true"}
                            aria-describedby="fullnamenote"
                            onFocus={() => setFullnameFocus(true)}
                            onBlur={() => setFullnameFocus(false)}
                        />
                        <p id="fullnamenote" className={fullnameFocus && fullname && !validFullname ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Only letters and spaces allowed.
                        </p>

                        {/* Username Field */}
                        <label style={{color:"#fff"}} htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="inputRegistry"                        
                            type="text"
                            id="username"
                            ref={usernameRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validUsername ? "false" : "true"}
                            aria-describedby="usernamenote"
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                        />
                        <p id="usernamenote" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        {/* Email Field */}
                        <label style={{color:"#fff"}} htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="inputRegistry"  // Add the class name here
                            type="email"
                            id="email"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter a valid email address.
                        </p>

                        {/* Password Field */}
                        <label style={{color:"#fff"}} htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="inputRegistry"                        
                            type="password"
                            id="password"
                            ref={passwordRef}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="passwordnote"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="passwordnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        {/* Confirm Password Field */}
                        <label style={{color:"#fff"}} htmlFor="confirm_password">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatchPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatchPassword || !matchPassword ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="inputRegistry"                        
                            type="password"
                            id="confirm_password"
                            ref={matchPasswordRef}
                            onChange={(e) => setMatchPassword(e.target.value)}
                            value={matchPassword}
                            required
                            aria-invalid={validMatchPassword ? "false" : "true"}
                            aria-describedby="confirm_passwordnote"
                            onFocus={() => setMatchPasswordFocus(true)}
                            onBlur={() => setMatchPasswordFocus(false)}
                        />
                        <p id="confirm_passwordnote" className={matchPasswordFocus && !validMatchPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the password field.
                        </p>

                        {/* Submit Button */}
                        <button className="buttonRegistry" disabled={!validFullname || !validUsername || !validEmail || !validPassword || !validMatchPassword}>Sign Up</button>
                    </form>
                    <p >
                        Already registered?<br />
                        <span className="line">
                            {/* Put router link here */}
                            <a href="/login" className="aRegistry">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register;
