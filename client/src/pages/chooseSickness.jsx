import { Link } from "react-router-dom";

const ChooseSickness = () => {
  return (
    <>
    <nav>
      <Link to="/doctors" reloadDocument>Next</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    </>
  );
}

export default ChooseSickness;