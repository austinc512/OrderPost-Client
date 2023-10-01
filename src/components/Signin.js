import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const host = process.env.REACT_APP_URL;

const Signin = () => {
  const { token, setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // console.log({ username, password });
    console.log(username);
    console.log(password);
  }, [username, password]);

  return (
    <>
      <form
        className="form"
        onSubmit={(e) => {
          console.log({ username, password });
          e.preventDefault();
          axios
            .post(`${host}/auth/login`, { username, password })
            .then((res) => {
              // ^^ this .then be turned off for production
              console.log(res);
              console.log(res.data);
              if (res.status === 200) {
                console.log(`res == 200 is firing`);
              }
              return res;
            })
            .then((res) => {
              setToken(res.data);
              navigate("/orders");
            });
          // ^^ this stays tho
        }}
      >
        <label className="label">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>
        <label className="label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <input type="submit" className="submit" value="Signin!" />
      </form>

      {!token.length ? (
        <p>
          Don't have an account? <Link to="/signup">Visit our Signup page</Link>
        </p>
      ) : null}
    </>
  );
};

export default Signin;
