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

function Shipments() {
  const { token } = useAuth();
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    if (token.length) {
      axios
        .get(`${host}/shipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setShipments(res.data.data);
          // console.log(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    }
  }, [token]);

  return (
    <>
      {!shipments.length ? (
        <p>(No shipments to show)</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Shipment ID</TableCell>
              <TableCell>Service Code</TableCell>
              <TableCell>Package Type</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Label Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments
              .map((shipment, index) => {
                return (
                  <TableRow key={shipment.shipment_id}>
                    <TableCell>{shipment.order_number}</TableCell>
                    <TableCell>{shipment.shipment_id}</TableCell>
                    <TableCell>{shipment.service_code}</TableCell>
                    <TableCell>{shipment.package_code}</TableCell>
                    <TableCell>
                      {unitConverter(
                        shipment.order_weight,
                        shipment.weight_units
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={shipment.label_reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="contained" color="primary">
                          Open Link
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })
              .sort((a, b) => Number(a.shipment_id) - Number(b.shipment_id))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Shipments;
