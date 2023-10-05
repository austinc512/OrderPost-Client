import axios from "axios";
import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";

const host = process.env.REACT_APP_URL;

const Signup = () => {
  // const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [email, setEmail] = useState("");
  //   const navigate = useNavigate();
  const [goHome, setGoHome] = useState(false);

  useEffect(() => {
    // console.log({ username, password });
    // console.log(username);
    // console.log(password);
  }, [username, password]);

  return (
    <>
      {!goHome ? (
        <form
          className="form"
          onSubmit={(e) => {
            // console.log({ username, password, first_name, last_name, email });
            e.preventDefault();
            axios
              .post(`${host}/auth/register`, {
                username,
                password,
                first_name,
                last_name,
                email,
              })
              .then((res) => {
                // ^^ this .then be turned off for production
                // console.log(res.data);
                // return res;
                if (res.status === 204) {
                  setGoHome(true);
                }
              });
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
          <label className="label">
            First name
            <input
              type="text"
              value={first_name}
              onChange={(e) => {
                set_first_name(e.target.value);
              }}
            />
          </label>
          <label className="label">
            Last name
            <input
              type="text"
              value={last_name}
              onChange={(e) => {
                set_last_name(e.target.value);
              }}
            />
          </label>
          <label className="label">
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <input type="submit" className="submit" value="Signup!" />
        </form>
      ) : null}
      {goHome ? (
        <div>
          You have registed successfully! <Link to="/">Please sign in!</Link>{" "}
        </div>
      ) : null}
    </>
  );
};

export default Signup;
