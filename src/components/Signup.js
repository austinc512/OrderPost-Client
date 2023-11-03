import axios from "axios";
import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const host = process.env.REACT_APP_URL;

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

const Signup = () => {
  // const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [goHome, setGoHome] = useState(false);

  useEffect(() => {
    // console.log({ username, password });
    // console.log(username);
    // console.log(password);
  }, [username, password]);

  const handleSubmit = async () => {
    // do something

    try {
      const res = await axios.post(`${host}/auth/register`, {
        username,
        password,
        first_name,
        last_name,
        email,
      });
      if (res.status === 204) {
        setGoHome(true);
      }
    } catch (err) {
      console.log(err.response.data);
      setErrorMessage(err.response.data.error);
    }
  };

  return (
    <>
      {!goHome ? (
        <Box sx={style2}>
          <h2
            style={{
              marginTop: 0,
              paddingTop: 0,
              fontWeight: 625,
              textAlign: "center",
            }}
          >
            Sign Up Form
          </h2>
          <form className="auth-form">
            <TextField
              label="Username"
              variant="outlined"
              required
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <TextField
              label="First Name"
              variant="outlined"
              required
              type="text"
              value={first_name}
              onChange={(e) => {
                set_first_name(e.target.value);
              }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              required
              type="text"
              value={last_name}
              onChange={(e) => {
                set_last_name(e.target.value);
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              required
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <br />
            <Button
              style={{
                textAlign: "center",
                // marginLeft: "1.5%",
                // display: "block",
              }}
              variant="contained"
              onClick={handleSubmit}
            >
              Sign Up!
            </Button>
          </form>
          {errorMessage && (
            <p className="error-message">Error: {errorMessage}</p>
          )}
        </Box>
      ) : null}
      {goHome ? (
        <Box sx={{ ...style2, textAlign: "center" }}>
          <h2>You have registed successfully!</h2>
          <div>
            <Link to="/">Please sign in!</Link>{" "}
          </div>
        </Box>
      ) : null}
    </>
  );
};

export default Signup;
