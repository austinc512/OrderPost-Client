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

function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (token.length) {
      console.log(`in Orders useEffect hook if(props.length), ${token}`);
      axios
        .get(`${host}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProducts(res.data.data);
          console.log(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    }
  }, [token]);

  return (
    <>
      {!products.length ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              return (
                <TableRow key={product.product_id}>
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Products;
