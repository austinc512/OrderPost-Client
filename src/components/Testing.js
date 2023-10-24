import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  useAuth,
  ProductEditorProvider,
  useProductEditor,
} from "../AuthProvider";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const host = process.env.REACT_APP_URL;

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

const ProductEditor = () => {
  // auth
  const { token } = useAuth();
  // chonky global state
  /*
  Shared State: If product_name is a shared state between multiple components, and it is being modified inside the modal, any change to it will trigger a re-render in any component that uses it, including the Products component. React re-renders a component whenever its state or props change.
  */
  const {
    openModal,
    modalType,
    selectedProduct,
    product_name,
    setProductName,
    price,
    setPrice,
    description,
    setDescription,
    handleClose,
    setProducts,
  } = useProductEditor();
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(product_name);
  // }, [product_name]);

  // useEffect(() => {
  //   console.log(modalType);
  // }, [modalType]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ product_name, price, description, modalType });
    // based on modal type, CREATE or UPDATE product.
    if (modalType === "CREATE") {
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
          if (res.status === 200) {
            handleClose();
            // for some reason this breaks everything
            // but current implementation works
            // navigate("/products");
            fetchProducts();
          }
        });
    } else if (modalType === "UPDATE") {
      // update product logic here
      axios
        .patch(
          `${host}/products/${selectedProduct}`,
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
          // console.log(res.data);
          // return res;
          if (res.status === 200) {
            handleClose();
            // navigate("/products");
            fetchProducts();
          }
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log({ selectedProduct });
    axios
      .delete(
        `${host}/products/${selectedProduct}`,
        // axios.delete doesn't need a req body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          handleClose();
          fetchProducts();
        }
      });
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
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
            Product Editor
          </h2>
          <form className="form" onSubmit={handleSubmit}>
            <TextField
              label="Product Name (must be unique)"
              variant="outlined"
              required
              type="text"
              value={product_name}
              onChange={(e) => {
                setProductName(e.target.value);
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
            <input
              type="submit"
              className="submit"
              value={
                modalType === "CREATE" ? "Create Product!" : "Update Product!"
              }
            />
            {modalType === "UPDATE" ? (
              <button onClick={handleDelete}>Delete product</button>
            ) : null}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default function Products() {
  // auth
  const { token } = useAuth();
  // global state
  const {
    setModalType,
    setSelectedProduct,
    // (these are now aliased)
    // setProductName,
    // setPrice,
    // setDescription,
    handleOpen,
    products,
    // setProducts,
    aliasProductName,
    aliasPrice,
    aliasDescription,
    aliasSetProducts,
  } = useProductEditor();

  const handleProductClick = async (product_id) => {
    console.log(`handleProductClick is firing`);
    // console.log(product_id);
    const response = await axios.get(`${host}/products/${product_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    aliasProductName(response.data.product_name);
    aliasPrice(response.data.price);
    aliasDescription(response.data.description);
    setSelectedProduct(response.data.product_id);
    handleOpen();
  };

  console.log(`Products re-render is occurring`);

  const fetchProducts = () => {
    if (token.length) {
      axios
        .get(`${host}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          aliasSetProducts(res.data.data);
          console.log(res.data.data);
        });
    }
  };

  useEffect(() => {
    console.log(`product fetch is occurring`);
    fetchProducts();
  }, [token]);

  // something like this:
  // {props.action === 'CREATE' ? <h2>Create Product</h2> : <h2>Update Product</h2>}

  return (
    <>
      <Button
        style={{ margin: 10 }}
        variant="contained"
        onClick={() => {
          setModalType("CREATE");
          //   console.log(modalType);
          handleOpen();
        }}
      >
        Create Product
      </Button>

      <ProductEditor />

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
              <TableRow className="table-row" key={index}>
                <TableCell>
                  <span
                    onClick={() => {
                      setModalType("UPDATE");
                      handleProductClick(product.product_id);
                    }}
                  >
                    {product.product_id}
                  </span>
                </TableCell>
                {[product.product_name, product.price, product.description].map(
                  (property, index) => {
                    return (
                      <TableCell key={index}>
                        <span
                          onClick={() => {
                            setModalType("UPDATE");
                            handleProductClick(product.product_id);
                          }}
                        >
                          {
                            // ((input) => {
                            //   // oh look, an IIFE
                            //   if (typeof input === "number" && !isNaN(+input)) {
                            //     console.log(`WHERE IS THIS FUCKING UP?`);
                            //     console.log(input);
                            //     return `$${input.toFixed(2)}`;
                            //   } else {
                            //     return input;
                            //   }
                            // })(property)

                            typeof property === "number" && !isNaN(+property)
                              ? `$${property.toFixed(2)}`
                              : property
                          }
                        </span>
                      </TableCell>
                    );
                  }
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

// export default Products;
