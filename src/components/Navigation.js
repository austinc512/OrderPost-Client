import React from "react";
import { Link } from "react-router-dom";
import Signin from "./Signin";

const Navigation = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/">Signin</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
      </ul>
      {/* Navigation */}
    </nav>
  );
};

export default Navigation;
