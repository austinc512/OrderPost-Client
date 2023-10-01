import React from "react";
import { Link } from "react-router-dom";
import Signin from "./Signin";
import { useAuth } from "../AuthProvider";

const Navigation = () => {
  const { token, setToken } = useAuth();
  return (
    <nav className="nav">
      <div className="nav-left">
        <h3>OrderPost</h3>
      </div>
      <div className="nav-right">
        <Link to="/">Signin</Link>
        {token.length ? <Link to="/orders">Orders</Link> : null}
        {token.length ? (
          <Link
            to="/"
            onClick={() => {
              setToken("");
            }}
          >
            Logout
          </Link>
        ) : null}
        {!token.length ? <Link to="/signup">Signup</Link> : null}
      </div>
      {/* Navigation */}
    </nav>
  );
};

export default Navigation;

/*
 {document.cookie.includes("loggedIn=true") ? (
    <Link to="/add">Add</Link>
    ) : null}
*/
