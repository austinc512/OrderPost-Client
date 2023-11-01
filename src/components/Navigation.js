import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";

/*
import Products from "./components/Products";
import Customers from "./components/Customers";
import Shipments from "./components/Shipments";
import Warehouses from "./components/Warehouses";
*/

const Navigation = () => {
  const { token, setToken } = useAuth();
  return (
    <nav className="nav">
      <div className="nav-left">
        <h3>OrderPost</h3>
      </div>
      <div className="nav-right">
        <Link to="/tutorial">TUTORIAL</Link>
        {/* {token.length ? <Link to="/testing">Testing</Link> : null} */}
        {token.length ? <Link to="/orders">Orders</Link> : null}
        {token.length ? <Link to="/products">Products</Link> : null}
        {token.length ? <Link to="/customers">Customers</Link> : null}
        {token.length ? <Link to="/shipments">Shipments</Link> : null}
        {token.length ? <Link to="/warehouses">Warehouses</Link> : null}
        {token.length ? <span className="separator">|</span> : null}
        {!token.length ? <Link to="/">Signin</Link> : null}
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
