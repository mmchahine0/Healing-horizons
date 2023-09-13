import { Link } from "react-router-dom";
import Register from '../components/Register';

const Signup = () => {
  // useEffect(() =>
  //   setTimeout(() => {
  //   navigate("/")},
  //   1000)) to navigate after submission
  return (
    <div className="signup">
      <Register />
    </div>
  );
}

export default Signup;