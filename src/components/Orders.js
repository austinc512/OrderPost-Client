import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth, useWarehouseEditor, UseOrderEditor } from "../AuthProvider";
// delete useWarehouseEditor when ready
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
  margin: "0 auto",
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  width: "50vw",
  minWidth: 700,
  // height: "50vh",
  minHeight: 400,
  bgcolor: "background.paper",
  // border: "1px solid #000",
  borderRadius: 1.5,
  boxShadow: 24,
  p: 4,
  "& .MuiTextField-root": { m: 1, width: "50ch" },
};

// different modal screens will be their own functional components
// start by implementing these along with global state

function WarehousesModal() {
  const { token } = useAuth();
  // this piece of state can just stay in this component
  const [warehouses, setWarehouses] = useState([]);

  // view resouce list in this component -> visit actual resource component -> create new resource -> come back to this component
  // new resource DOES show up in list, so I don't think I need global state management for "has this resource list been updated since the last time I visited this page?"
  // however, that might change if I memoize these values later.

  const { step, nextStep, warehouse_id, setWarehouse } = UseOrderEditor();

  useEffect(() => {
    const fetchWarehouses = () => {
      if (warehouses.length === 0 && step === 1) {
        axios
          .get(`${host}/warehouses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setWarehouses(res.data.data);
          });
      }
    };

    fetchWarehouses();
  }, [step, token, warehouses]);

  return (
    <div>
      <h2>Click a warehouse to select your ship-from location</h2>
      <div className="modal-warehouse-next">
        <Button onClick={nextStep}>Next →</Button>
      </div>
      {warehouses.length
        ? warehouses.map((element, index) => {
            return (
              <div
                key={index}
                className={`modal-group ${
                  element.warehouse_id === warehouse_id
                    ? "selected-instance"
                    : ""
                }`}
                onClick={() => {
                  setWarehouse(element.warehouse_id);
                }}
              >
                <div className="modal-listing-left">
                  <h3 className="">{element.nick_name}</h3>
                  <span>{element.address_line1}</span>
                  {(() => {
                    if (element.address_line2) {
                      // console.log(element.address_line2);
                      return (
                        <>
                          <br />
                          <span>{element.address_line2}</span>
                        </>
                      );
                    }
                  })()}
                  {(() => {
                    if (element.address_line3) {
                      // console.log(element.address_line3);
                      return (
                        <>
                          <br />
                          <span>{element.address_line3}</span>
                        </>
                      );
                    }
                  })()}

                  <br />
                  <span>
                    {" "}
                    {`${element?.city_locality}, ${element?.state_province} ${element?.postal_code}`}
                  </span>
                </div>
                {/* <div className="modal-listing-right">
                  <input
                    type="radio"
                    value="option1"
                    checked={
                      element.warehouse_id === props.warehouse_id ? true : false
                    }
                    onClick={() => {
                      // const [warehouse_id, setWarehouse] = useState(null);
                      props.setWarehouse(element.warehouse_id);
                    }}
                  />
                </div> */}
              </div>
            );
          })
        : null}
      <div className="modal-warehouse-next">
        <Button onClick={nextStep}>Next →</Button>
      </div>
    </div>
  );
}

function CustomersModal(props) {
  const { token } = useAuth();
  // resource list can remain only within this component
  const [customers, setCustomers] = useState([]);
  /*

  token
  step
  prevStep
  nextStep
  customer_id
  setCustomer
  prevStep
  nextStep
  
  */
  const { step, prevStep, nextStep, customer_id, setCustomer } =
    UseOrderEditor();

  // const fetchCustomers = () => {
  //   if (customers.length === 0 && props.step === 2) {
  //     axios
  //       .get(`${host}/customers`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         setCustomers(res.data.data);
  //         // console.log(res.data.data);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   fetchCustomers();
  // }, [props.step]);

  useEffect(() => {
    const fetchCustomers = () => {
      if (customers.length === 0 && step === 2) {
        axios
          .get(`${host}/customers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setCustomers(res.data.data);
            console.log(res.data.data);
          });
      }
    };

    fetchCustomers();
  }, [step, token, customers]);

  return (
    <div>
      <h1>Select a Customer for this order</h1>
      <div className="modal-full-navigation">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
      {customers.length
        ? customers.map((element, index) => {
            return (
              <div
                className={`modal-group ${
                  element.customer_id === customer_id ? "selected-instance" : ""
                }`}
                onClick={() => {
                  setCustomer(element.customer_id);
                }}
              >
                <div className="modal-listing-left">
                  <h3>{`${element.first_name} ${element.last_name}`}</h3>
                  <p>{element.email}</p>
                  <p>{element.phone}</p>
                </div>
              </div>
            );
          })
        : null}
      <div className="modal-full-navigation">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}

function ProductsModal(props) {
  /*
    token
    orderItems
    setOrderItems (takes the place of addProduct in this component)
    step
    prevStep
    nextStep
    customer_id
    order_id -- I think I need the last 2 to fetch order_items in this component
  */
  const { token } = useAuth();
  // resource list can remain only within this component
  const [products, setProducts] = useState([]);

  const {
    orderItems,
    setOrderItems,
    step,
    prevStep,
    nextStep,
    customer_id,
    order_id,
    // functions
    addItem,
    deleteItem,
  } = UseOrderEditor();

  useEffect(() => {
    console.log(orderItems);
  }, [orderItems]);

  /*

  What's the problem statement?
  if updating an order, we need to hydrate those orderItems
  setOrderItems will exist in this component in some capacity

  however, do I even need orderItems in this component?
  or do I just need setOrderItems?

  */

  const fetchProducts = () => {
    if (products.length === 0 && step === 3) {
      axios
        .get(`${host}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProducts(res.data.data);
          // console.log(res.data.data);
        });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [step]);

  // useEffect(() => {
  //   if (addProduct.length > 1) {
  //     setProducts(addProduct);
  //   }
  // }, [addProduct]);

  return (
    <div>
      <h2>Products</h2>
      <div className="modal-full-navigation">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
      {products.length
        ? products.map((product, index) => {
            return (
              // <div
              //   key={index}
              //   className={`modal-group ${
              //     // this conditional will also need to change
              //     orderItems.includes(element.product_id)
              //       ? "selected-instance"
              //       : ""
              //   }`}
              //   onClick={(e) => {
              //     // const [warehouse_id, setWarehouse] = useState(null);
              //     // only allowing quantity 1 at this time
              //     // I just need to get this up and running
              //     // ... today.
              //     // value should look more like:
              //     // { product_id: element.product_id, quantity: 1 }
              //     setAddProducts([...addProduct, element.product_id]);
              //   }}
              // >
              //   <h3>{element.product_name}</h3>
              //   <span>{element.description}</span>
              //   <label>
              //     Quantity
              //     <input
              //       type="number"
              //       value={props.order_weight}
              //       defaultValue={0}
              //       // onChange={(e) => {
              //       //   props.setOrderWeight(e.target.value);
              //       // }}
              //     />
              //   </label>
              //   <br />
              //   <span>{`$ ${element.price.toFixed(2)}`}</span>
              // </div>
              <ProductItem
                key={product.id}
                product={product}
                addItem={addItem}
                deleteItem={deleteItem}
              />
            );
          })
        : null}
      <div className="modal-full-navigation">
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}

// individual products need their own state variables
function ProductItem({ product, addItem, deleteItem }) {
  // console.log(product);
  // if product already exists as orderItem, use it.
  const { orderItems } = UseOrderEditor();
  const checkExistingProduct = orderItems.find(
    (item) => item.product_id === product.product_id
  );
  const [quantity, setQuantity] = useState(
    checkExistingProduct?.quantity || null
  );

  // need to control inputs for product editing
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log({ checkExistingProduct });
  }, [checkExistingProduct]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(isNaN(newQuantity) ? 0 : newQuantity); // only accepts numeric values
  };

  // there's more than likely more shit to do here.
  // but I need to start getting visual feedback first.

  return (
    <div
      className={`modal-group ${
        // this conditional will also need to change
        checkExistingProduct ? "selected-instance" : ""
      }`}
    >
      <h3>{product?.product_name}</h3>
      <p>Description: {product?.description}</p>
      <span>{`Price: $${product?.price.toFixed(2)}`}</span>
      <br />
      {quantity > 0 || isActive ? <span>Quantity: </span> : null}
      {!isActive && quantity > 0 ? <span>{quantity}</span> : null}
      {isActive ? (
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
      ) : null}
      <br />
      {!isActive ? (
        <button
          onClick={() => {
            setIsActive(!isActive);
          }}
        >
          Add/Update
        </button>
      ) : null}
      {isActive ? (
        <button
          onClick={() => {
            if (quantity >= 1) {
              // need to add product.price to this
              addItem(product.product_id, quantity, product.price);
            }
            setIsActive(false);
          }}
        >
          Save
        </button>
      ) : null}
      <button
        onClick={() => {
          deleteItem(product.product_id);
          setQuantity(0);
        }}
      >
        Delete
      </button>
    </div>
  );
}

function SubmitOrder() {
  const { token } = useAuth();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const {
    triggerOrder,
    setTriggerOrder,
    order_number,
    setOrderNumber,
    total_amount,
    setTotalAmount,
    order_weight,
    setOrderWeight,
    dimension_x,
    setDimX,
    dimension_y,
    setDimY,
    dimension_z,
    setDimZ,
    // not implemented yet
    order_date,
    setOrderDate,
    order_status,
    setOrderStatus,
    ship_by_date,
    setShipByDate,
    service_code,
    setServiceCode,
    package_code,
    setPackageCode,
    confirmation,
    setConfirmation,
    weight_units,
    setWeightUnits,
    dimension_units,
    setDimensionUnits,
    // modal stuff
    prevStep,
    // trying to autofill order total
    defaultAmount,
    modalType,
    // extra stuff needed to create order/label
    customer_id,
    warehouse_id,
    handleClose,
    orderItems,
    // this component needs to fetch orders too
    setOrders,
  } = UseOrderEditor();

  const navigate = useNavigate();

  const handleSubmit = async (type) => {
    // pass an argument to this function to deal with the case
    // values: "create", "create/ship", "update", "update/ship"
    // something like that

    // Submit the order logic
    // props.handleClose();
    // setTriggerOrder(true);
    console.log({
      triggerOrder,
      setTriggerOrder,
      order_number,
      setOrderNumber,
      total_amount,
      setTotalAmount,
      order_weight,
      setOrderWeight,
      dimension_x,
      setDimX,
      dimension_y,
      setDimY,
      dimension_z,
      setDimZ,
      // not implemented yet
      order_date,
      setOrderDate,
      order_status,
      setOrderStatus,
      ship_by_date,
      setShipByDate,
      service_code,
      setServiceCode,
      package_code,
      setPackageCode,
      confirmation,
      setConfirmation,
      weight_units,
      setWeightUnits,
      dimension_units,
      setDimensionUnits,
      // modal stuff
      prevStep,
      modalType,
      orderItems,
    });

    const fetchOrders = () => {
      axios
        .get(`${host}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data.data);
          // console.log(res.data.data);
          // ^^ this is super fucking annoying
          // I don't have time to change my API design for this right now
        });
    };

    async function createOrder(body) {
      let order_id = null;
      let OrderResponse = await axios
        .post(`${host}/orders`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          order_id = res.data.order_id;
          // return id;
        });
      // order_id is accessible here
      //  don't think this is necessary
      let orderItemsReturnValue;
      let shipmentReturn;

      // let shipmentApiRequest = await axios
      //   .post(`${host}/orders/${id}/create-shipment`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   })
      //   .then((res) => {
      //     shipmentReturn = res.data;
      //   });
      // console.log(shipmentReturn);
      try {
        orderItemsReturnValue = await createOrderItems(order_id);
        console.log(orderItemsReturnValue);
      } catch (err) {
        console.log(err);
        alert(`An err occurred in the createOrderItems step`);
      }

      return order_id;
    }

    // at some point I need to fix camel vs. snake case accross the board
    async function createOrderItems(order_id) {
      console.log({ message: `Inside createOrderItems`, order_id, orderItems });
      const postOrderItem = (order_item, authConfig) => {
        return axios.post(
          `${host}/orders/${order_id}/order-items`,
          order_item,
          authConfig
        );
      };
      const apiRequests = orderItems.map((item) =>
        postOrderItem(item, authConfig)
      );
      // function handleOrderItem()
      Promise.all(apiRequests)
        .then((responses) => {
          // All requests were successful
          responses.forEach((res) => console.log(res.data));
        })
        .catch((error) => {
          // Handle any errors here
          console.error("An error occurred:", error);
        });
    }

    async function createShipment(orderId) {
      let shipmentReturn;
      let statusCheck;
      let shipmentApiRequest = await axios
        // axios.post requires a request body
        // working around this with an empty object
        .post(`${host}/orders/${orderId}/create-shipment`, {}, authConfig)
        .then((res) => {
          shipmentReturn = res.data;
          statusCheck = res.status;
        });
      // console.log(shipmentReturn);
      // console.log(statusCheck);
      if (statusCheck === 200) {
        alert(
          `Your label has been created! Please go to the Shipments tab in order to get your label.`
        );
        handleClose();
        navigate("/shipments");
      } else {
        alert(
          `We're sorry, something has failed. Please ensure you've filled out all information in the Order Creation screens in order to get a shipping label. If that still does not solve your issue, please contact the maintainer of this application.`
        );
      }
    }
    if (modalType === "CREATE" && type === "create/ship") {
      const order_id = await createOrder({
        // payload
        customer_id,
        order_number: `${order_number}`,
        order_date,
        total_amount,
        order_status,
        ship_by_date,
        // don't need carrier_code,
        service_code,
        package_code,
        confirmation,
        order_weight,
        weight_units,
        dimension_x,
        dimension_y,
        dimension_z,
        dimension_units,
        warehouse_id,
      });
      createShipment(order_id);
    } else if (modalType === "CREATE" && type === "create") {
      // create and then fetchOrders
      await createOrder({
        // payload
        customer_id,
        order_number: `${order_number}`,
        order_date,
        total_amount,
        order_status,
        ship_by_date,
        // don't need carrier_code,
        service_code,
        package_code,
        confirmation,
        order_weight,
        weight_units,
        dimension_x,
        dimension_y,
        dimension_z,
        dimension_units,
        warehouse_id,
      });
      fetchOrders();
      handleClose();
    }
  };

  // try autofill on initial render?
  useEffect(() => {
    console.log(`initialRender useEffect for defaultAmount()`);
    setTotalAmount(defaultAmount());
  }, [total_amount]);

  return (
    <div className="form-container">
      <h2>Configure shipment details</h2>

      <div className="input-group">
        <label>Order Number</label>
        <input
          type="number"
          required
          value={order_number}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Total Amount</label>
        <input
          type="number"
          value={total_amount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Order Weight (lbs)</label>
        <input
          type="number"
          value={order_weight}
          onChange={(e) => setOrderWeight(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Dimension X (in)</label>
        <input
          type="number"
          value={dimension_x}
          onChange={(e) => setDimX(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Dimension Y (in)</label>
        <input
          type="number"
          value={dimension_y}
          onChange={(e) => setDimY(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Dimension Z (in)</label>
        <input
          type="number"
          value={dimension_z}
          onChange={(e) => setDimZ(e.target.value)}
        />
      </div>

      <Button onClick={prevStep}>Back</Button>
      {modalType === "CREATE" ? (
        <Button
          onClick={() => {
            handleSubmit("create/ship");
          }}
        >
          Create Label!
        </Button>
      ) : null}
      {modalType === "CREATE" ? (
        <Button
          onClick={() => {
            if (modalType === "CREATE") {
              handleSubmit("create");
            }
          }}
        >
          Save Order
        </Button>
      ) : null}
      {modalType === "UPDATE" ? (
        <Button
          onClick={() => {
            handleSubmit("update");
          }}
        >
          Update Order
        </Button>
      ) : null}
      {modalType === "UPDATE" ? (
        <Button
          onClick={() => {
            handleSubmit("update/ship");
          }}
        >
          Update And Ship!
        </Button>
      ) : null}
    </div>
  );
}

function MultiStepModal() {
  // do something
  const { token } = useAuth();
  const {
    handleOpen,
    handleClose,
    setModalType,
    nextStep,
    prevStep,
    step,
    setStep,
    open,
    setOpen,
  } = UseOrderEditor();

  const getModalContent = () => {
    switch (step) {
      case 1:
        return <WarehousesModal />;
      case 2:
        return <CustomersModal />;
      case 3:
        return <ProductsModal />;
      case 4:
        return <SubmitOrder />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleOpen();
          setModalType("CREATE");
        }}
        style={{ margin: 10 }}
      >
        Create Order
      </Button>
      <Modal
        className="scrollable-content-2"
        style={{ marginTop: "3%", padding: 0 }}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={style2}>{getModalContent()}</Box>
      </Modal>
    </div>
  );
}

/*
MultiStepModal deals with the case statement to display the correct content
each page of the modal will set shared state

there will then be an Orders component that contains the MultiStepModal

and it will also render the list of Orders

*/

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

export default function Orders() {
  const { token } = useAuth();
  // console.log(`looking for token on orders page`);
  // console.log(token);
  const { orders, setOrders } = UseOrderEditor();
  //   const navigate = useNavigate();
  const fetchOrders = () => {
    axios
      .get(`${host}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data.data);
        // console.log(res.data.data);
        // ^^ this is super fucking annoying
        // I don't have time to change my API design for this right now
      });
  };
  useEffect(() => {
    if (token.length) {
      fetchOrders();
    }
  }, [token]);

  // these are in global state, but it doesn't look like I'm using this anywhere
  // const [open, setOpen] = useState(false);
  // const [step, setStep] = useState(0);

  return (
    <>
      {/* <Button
        onClick={() => {
          setStep(1);
        }}
      >
        Create Order
      </Button> */}
      <MultiStepModal />
      {!orders.length ? (
        <p>(No Orders to show)</p>
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
