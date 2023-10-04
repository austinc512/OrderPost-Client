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
import Button from "@mui/material/Button";

import CreateOrder from "./CreateOrder";

const host = process.env.REACT_APP_URL;

const dateConverter = (iso) => {
  let date = new Date(iso);

  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extracting various components
  let year = date.getUTCFullYear();
  let month = monthNames[date.getUTCMonth()]; // Using the monthNames array
  let day = date.getUTCDate();

  // Getting the day suffix (st, nd, rd, or th)
  let daySuffix = "th";
  if (day % 10 === 1 && day !== 11) {
    daySuffix = "st";
  } else if (day % 10 === 2 && day !== 12) {
    daySuffix = "nd";
  } else if (day % 10 === 3 && day !== 13) {
    daySuffix = "rd";
  }

  return `${month} ${day}${daySuffix}, ${year}`;
};

const unitConverter = (value, unit) => {
  // weight units: "pound" "ounce" "gram" or "kilogram"
  // dim units "inch" or "centimeter"
  if (value <= 1 && unit === "pound") {
    return `${value} lb`;
  } else if (unit === "pound") {
    return `${value} lbs`;
  } else if (unit === "ounce") {
    return `${value} oz`;
  } else if (unit === "gram") {
    return `${value} g`;
  } else if (unit === "kilogram") {
    return `${value} g`;
  } else if (unit === "inch") {
    return `${value} in`;
  } else if (unit === "centimeter") {
    return `${value} cm`;
  } else {
    return `${value} ${unit}`;
  }
};

function Orders() {
  const { token } = useAuth();
  console.log(`looking for token on orders page`);
  console.log(token);
  const [orders, setOrders] = useState([]);
  //   const navigate = useNavigate();
  useEffect(() => {
    if (token.length) {
      console.log(`in Orders useEffect hook if(props.length), ${token}`);
      axios
        .get(`${host}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data.data);
          console.log(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    }
  }, [token]);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <>
      {/* <Button
        onClick={() => {
          setStep(1);
        }}
      >
        Create Order
      </Button> */}
      <CreateOrder
        open={open}
        setOpen={setOpen}
        step={step}
        setStep={setStep}
      />
      {!orders.length ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Ship-By Date</TableCell>
              <TableCell>Address Line 1</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell>Weight</TableCell>
              {/* <TableCell>Delete</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => {
              return (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{`${order.first_name} ${order.last_name}`}</TableCell>
                  <TableCell>{dateConverter(order.order_date)}</TableCell>
                  <TableCell>{dateConverter(order.ship_by_date)}</TableCell>
                  <TableCell>{order.address_line1}</TableCell>
                  <TableCell>{order.city_locality}</TableCell>
                  <TableCell>{order.state_province}</TableCell>
                  <TableCell>{order.postal_code}</TableCell>
                  <TableCell>
                    {unitConverter(order.order_weight, order.weight_units)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Orders;
