// import { useEffect, useState } from "react";
// import axios from "axios";

import "./App.css";

// import Signin from "./components/Signin";
// import Orders from "./components/Orders";

import Router from "./Router";
import { BrowserRouter } from "react-router-dom";

// import { useAuth } from "./AuthProvider";
// app component doesn't need to handle auth token
// maybe that info is needed later, however.

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
