import React from "react";
import { Routes, Route } from "react-router";
import { Link, useNavigate } from "react-router-dom";
// add useContext here
import { useAuth, ProductEditorProvider } from "./AuthProvider";

// import components
import Navigation from "./components/Navigation";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Customers from "./components/Customers";
import Shipments from "./components/Shipments";
import Warehouses from "./components/Warehouses";
import HowTo from "./components/HowTo";

// I need a space to test components
import Testing from "./components/Testing";

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
        <Route path="/tutorial" element={<HowTo />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/testing"
          // instantiate context as a wrapper like this:
          element={
            <ProductEditorProvider>
              <ProtectedRoute component={Testing} />
            </ProductEditorProvider>
          }
        />

        <Route path="/orders" element={<ProtectedRoute component={Orders} />} />
        <Route
          path="/products"
          element={
            <ProductEditorProvider>
              <ProtectedRoute component={Products} />
            </ProductEditorProvider>
          }
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
