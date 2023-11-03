import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

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

const host = process.env.REACT_APP_URL;

const Signin = () => {
  const { token, setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // console.log({ username, password });
    // console.log(username);
    // console.log(password);
  }, [username, password]);

  const handleSubmit = async () => {
    setErrorMessage("");
    try {
      const res = await axios.post(`${host}/auth/login`, {
        username,
        password,
      });
      setToken(res.data);
      navigate("/orders");
    } catch (err) {
      console.log(err.response.data);
      setErrorMessage(err.response.data.error);
    }
  };

  return (
    <>
      <Box sx={style2}>
        <h2
          style={{
            marginTop: 0,
            paddingTop: 0,
            fontWeight: 625,
            textAlign: "center",
          }}
        >
          Login
        </h2>
        <form className="auth-form" onSubmit={handleSubmit}>
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
          <br />
          <Button
            style={{
              textAlign: "center",
              // marginLeft: "1.5%",
            }}
            variant="contained"
            onClick={handleSubmit}
          >
            Log in!
          </Button>
        </form>
        {errorMessage && <p className="error-message">Error: {errorMessage}</p>}
      </Box>

      {!token.length ? (
        <div
          style={{
            marginTop: 50,
            // fontWeight: 200,
            textAlign: "center",
            marginBottom: 0,
          }}
        >
          <p
            style={{
              fontWeight: 345,
            }}
          >
            Don't have an account?
          </p>
          <p
            style={{
              // fontWeight: 200,
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            <Link to="/signup">Visit our Signup page</Link>
          </p>
        </div>
      ) : null}
    </>
  );
};

export default Signin;
