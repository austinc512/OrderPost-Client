import React from "react";
import { Routes, Route } from "react-router";
import { Link, useNavigate } from "react-router-dom";
// add useContext here
import {
  useAuth,
  ProductEditorProvider,
  CustomerEditorProvider,
  WarehouseEditorProvider,
  OrderEditorProvider,
} from "./AuthProvider";

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

import Box from "@mui/material/Box";

const style2 = {
  margin: "0 auto",
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  width: "50vw",
  minWidth: 700,
  // height: "50vh",
  minHeight: 400,
  bgcolor: "background.paper",
  // border: "1px solid #000",
  borderRadius: 1.5,
  boxShadow: 24,
  p: 4,
  "& .MuiTextField-root": { m: 1, width: "50ch" },
};

const NotLoggedIn = () => {
  return (
    <Box sx={{ ...style2, textAlign: "center" }}>
      <h2>Oops... It looks like you're not logged in!</h2>
      <div>
        <Link to="/">Please sign in!</Link>{" "}
      </div>
    </Box>
  );
};

// then define their routes

const useCheckAuth = () => {
  const { token } = useAuth();
  return token.length ? true : false;
  // useAuth to check for our Bearer token
};

const ProtectedRoute = (props) => {
  const { component: Component, ...rest } = props;
  // const navigate = useNavigate();

  return useCheckAuth() === true ? <Component {...rest} /> : <NotLoggedIn />;
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
            <OrderEditorProvider>
              <ProtectedRoute component={Testing} />
            </OrderEditorProvider>
          }
        />

        <Route
          path="/orders"
          element={
            <OrderEditorProvider>
              <ProtectedRoute component={Orders} />
            </OrderEditorProvider>
          }
        />
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
          element={
            <CustomerEditorProvider>
              <ProtectedRoute component={Customers} />
            </CustomerEditorProvider>
          }
        />
        <Route
          path="/shipments"
          element={<ProtectedRoute component={Shipments} />}
        />
        <Route
          path="/warehouses"
          element={
            <WarehouseEditorProvider>
              <ProtectedRoute component={Warehouses} />
            </WarehouseEditorProvider>
          }
        />
      </Routes>
    </>
  );
};

export default Router;
