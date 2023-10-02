import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

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

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  minWidth: 700,
  height: "50vh",
  minHeight: 400,
  bgcolor: "background.paper",
  // border: "1px solid #000",
  borderRadius: 1.5,
  boxShadow: 24,
  p: 4,
  "& .MuiTextField-root": { m: 1, width: "50ch" },
};

export default function Products() {
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

  const fetchProducts = () => {
    if (token.length) {
      axios
        .get(`${host}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProducts(res.data.data);
          console.log(res.data.data);
        });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const ProductCreator = () => {
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => {
      setOpen2(false);
    };

    const [product_name, set_product_name] = useState(null);
    const [price, setPrice] = useState(null);
    const [description, setDescription] = useState(null);

    const navigate = useNavigate();

    return (
      <div>
        <Button
          style={{ margin: 10 }}
          variant="contained"
          onClick={handleOpen2}
        >
          Create Product
        </Button>

        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <h2
              style={{
                marginTop: 0,
                fontWeight: 625,
              }}
            >
              Create Product
            </h2>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(
                    `${host}/products/`,
                    {
                      product_name,
                      price,
                      description,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((res) => {
                    // ^^ this .then be turned off for production
                    console.log(res.data);
                    // return res;
                    if (res.status === 200) {
                      handleClose2();
                      navigate("/products");
                      fetchProducts();
                    }
                  });
              }}
            >
              <TextField
                label="Product Name (must be unique)"
                variant="outlined"
                required
                type="text"
                value={product_name}
                onChange={(e) => {
                  set_product_name(e.target.value);
                }}
              />

              <TextField
                label="Price (in USD)"
                required
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <TextField
                label="Description (max 150 chars)"
                required
                multiline
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />

              <br />
              <input type="submit" className="submit" value="Create Product!" />
            </form>
          </Box>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <ProductCreator />
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
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {`$${selectedProduct?.price}`}
              </Typography>
            </Box>
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
                  <TableRow className="table-row" key={product.product_id}>
                    {[
                      product.product_id,
                      product.product_name,
                      product.price,
                      product.description,
                    ].map((property) => {
                      return (
                        <TableCell key={property}>
                          <span
                            onClick={() => {
                              handleProductClick(product.product_id);
                              handleOpen();
                            }}
                          >
                            {property}
                          </span>
                        </TableCell>
                      );
                    })}
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

// export default Products;
