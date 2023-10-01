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

function Warehouses() {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    if (token.length) {
      axios
        .get(`${host}/warehouses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setWarehouses(res.data.data);
          console.log(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    }
  }, [token]);

  return (
    <>
      {!warehouses.length ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse ID</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Address Line 1</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Postal Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((shipment, index) => {
              return (
                <TableRow key={shipment.warehouse_id}>
                  <TableCell>{shipment.warehouse_id}</TableCell>
                  <TableCell>{shipment.nick_name}</TableCell>
                  <TableCell>{shipment.company_name}</TableCell>
                  <TableCell>{shipment.address_line1}</TableCell>
                  <TableCell>{shipment.city_locality}</TableCell>
                  <TableCell>{shipment.state_province}</TableCell>
                  <TableCell>{shipment.postal_code}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Warehouses;
