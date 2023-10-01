import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
// import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const host = process.env.REACT_APP_URL;

function Customers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (token.length) {
      console.log(`in Orders useEffect hook if(props.length), ${token}`);
      axios
        .get(`${host}/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCustomers(res.data.data);
          console.log(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    }
  }, [token]);

  return (
    <>
      {!customers.length ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => {
              return (
                <TableRow key={customer.customer_id}>
                  <TableCell>{customer.customer_id}</TableCell>
                  <TableCell>{`${customer.first_name} ${customer.last_name}`}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Customers;
