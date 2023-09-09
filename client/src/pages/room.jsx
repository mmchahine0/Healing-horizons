import { Link } from "react-router-dom";

const Room = () => {
  return (
    <>
    <nav>
      <Link to="/cart" reloadDocument>pay here</Link>
    </nav>
    <div className="home">
      <h2>Home</h2>
    </div>
    </>
  );
}

export default Room;