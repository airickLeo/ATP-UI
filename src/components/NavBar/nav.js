import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/edit"}>Edit</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav