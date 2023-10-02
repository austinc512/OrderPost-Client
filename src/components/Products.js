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
import Modal from "@mui/material/Modal";

// import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";

const host = process.env.REACT_APP_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleProductClick = (product_id) => {
    console.log(`handleProductClick is firing`);
    console.log(product_id);
    axios
      .get(`${host}/products/${product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSelectedProduct(res.data);
        return res;
      })
      .then((res) => {
        setOpenModal(true);
      });
  };

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
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {selectedProduct?.product_name}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedProduct?.description}
              </Typography>
            </Box>
            {/* <div>
              <h2 id="product-modal-title">{selectedProduct?.product_name}</h2>
              <p id="product-modal-description">
                {selectedProduct?.description}
              </p>
              
            </div> */}
          </Modal>
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
                  <TableRow
                    key={product.product_id}
                    onClick={async () => {
                      handleProductClick(product.product_id);
                      handleOpen();
                      // console.log(product.product_id);
                    }}
                  >
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.description}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}

export default Products;
