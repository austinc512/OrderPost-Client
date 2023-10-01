import React from "react";
import { Routes, Route } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

// import components
import Navigation from "./components/Navigation";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Customers from "./components/Customers";
import Shipments from "./components/Shipments";
import Warehouses from "./components/Warehouses";

// then define their routes

const useCheckAuth = () => {
  const { token } = useAuth();
  return token.length ? true : false;
  // useAuth to check for our Bearer token
};

const ProtectedRoute = (props) => {
  const { component: Component, ...rest } = props;
  // const navigate = useNavigate();

  return useCheckAuth() === true ? (
    <Component {...rest} />
  ) : (
    <Link to="/">Login</Link>
  );
};

const Router = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<ProtectedRoute component={Orders} />} />
        <Route
          path="/products"
          element={<ProtectedRoute component={Products} />}
        />
        <Route
          path="/customers"
          element={<ProtectedRoute component={Customers} />}
        />
        <Route
          path="/shipments"
          element={<ProtectedRoute component={Shipments} />}
        />
        <Route
          path="/warehouses"
          element={<ProtectedRoute component={Warehouses} />}
        />
      </Routes>
    </>
  );
};

export default Router;
