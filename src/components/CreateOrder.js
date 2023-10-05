import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "../AuthProvider";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const style2 = {
  margin: "0 auto",
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  width: "50vw",
  minWidth: 700,
  padding: 1,
  // height: "50vh",
  minHeight: 400,
  height: "min-content",
  // ^^ check with warehouses to make sure this works
  bgcolor: "background.paper",
  //   border: "10px solid #000",
  borderRadius: 1.5,
  boxShadow: 24,
  //   p: 4,
  //   "& .MuiTextField-root": { m: 1, width: "50ch" },
};

const host = process.env.REACT_APP_URL;

export default function MultiStepModal(props) {
  const { token } = useAuth();

  const navigate = useNavigate();

  const handleOpen = () => {
    props.setStep(1);
    props.setOpen(true);
  };
  const handleClose = () => {
    props.setOpen(false);
    props.setStep(0); // Reset step when modal closes
  };
  const nextStep = () => props.setStep((prev) => prev + 1);
  const prevStep = () => props.setStep((prev) => prev - 1);

  // pieces of state needed to create order
  const [warehouse_id, setWarehouse] = useState(null);
  const [customer_id, setCustomer] = useState(null);
  // array of objects [{productId: 5, quantity: 1},{productId: 2, quantity: 3} ]
  const [products, setProducts] = useState(null);
  // not implementing order_items for MVP, however.

  // default values for creatOrder
  // will be configurable later
  const order_date = new Date().toISOString();
  const order_status = "unshipped";
  const ship_by_date = new Date().toISOString();
  const service_code = "usps_priority_mail";
  const package_code = "package";
  const confirmation = "none";
  const weight_units = "pound";
  const dimension_units = "inch";

  // configurable state for order details
  const [order_number, setOrderNumber] = useState(
    Math.trunc(Math.random() * 100)
  );
  const [total_amount, setTotalAmount] = useState(0);
  const [order_weight, setOrderWeight] = useState(1);
  const [dimension_x, setDimX] = useState(1);
  const [dimension_y, setDimY] = useState(1);
  const [dimension_z, setDimZ] = useState(1);

  // trigger order request
  const [triggerOrder, setTriggerOrder] = useState(false);

  useEffect(() => {
    /*
    It looks like you wrote useEffect(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

useEffect(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state


    */
    if (triggerOrder === true) {
      //   console.log({
      //     customer_id,
      //     order_number,
      //     order_date,
      //     total_amount,
      //     order_status,
      //     ship_by_date,
      //     // don't need carrier_code,
      //     service_code,
      //     package_code,
      //     confirmation,
      //     order_weight,
      //     weight_units,
      //     dimension_x,
      //     dimension_y,
      //     dimension_z,
      //     dimension_units,
      //     warehouse_id,
      //   });

      async function createShipment(orderId) {
        let shipmentReturn;
        let statusCheck;
        let shipmentApiRequest = await axios
          // axios.post requires a request body
          // working around this with an empty object
          .post(
            `${host}/orders/${orderId}/create-shipment`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            shipmentReturn = res.data;
            statusCheck = res.status;
          });
        console.log(shipmentReturn);
        console.log(statusCheck);
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

      async function createOrder(body) {
        let id = null;
        let OrderResponse = await axios
          .post(`${host}/orders`, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            id = res.data.order_id;
            // return id;
          });
        // order_id is accessible here
        console.log(id);
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
        let shipmentApiRequest = await createShipment(id);
      }

      createOrder({
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

      // stays at the end
      setTriggerOrder(false);
    }
  }, [triggerOrder]);

  //   useEffect(() => {
  //     console.log(products);
  //   }, [products]);

  const getModalContent = () => {
    switch (props.step) {
      case 1:
        return (
          <Warehouses
            nextStep={nextStep}
            warehouse_id={warehouse_id}
            setWarehouse={setWarehouse}
            step={props.step}
          />
        );
      case 2:
        return (
          <Customers
            nextStep={nextStep}
            prevStep={prevStep}
            customer_id={customer_id}
            setCustomer={setCustomer}
            step={props.step}
          />
        );
      case 3:
        return (
          <Products
            nextStep={nextStep}
            prevStep={prevStep}
            products={products}
            setProducts={setProducts}
            step={props.step}
          />
        );
      case 4:
        return (
          <SubmitOrder
            handleClose={handleClose}
            prevStep={prevStep}
            total_amount={total_amount}
            setTotalAmount={setTotalAmount}
            order_weight={order_weight}
            setOrderWeight={setOrderWeight}
            dimension_x={dimension_x}
            setDimX={setDimX}
            dimension_y={dimension_y}
            setDimY={setDimY}
            dimension_z={dimension_z}
            setDimZ={setDimZ}
            order_number={order_number}
            setOrderNumber={setOrderNumber}
            setTriggerOrder={setTriggerOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ margin: 10 }}
      >
        Create Order
      </Button>
      <Modal
        className="scrollable-content-2"
        style={{ marginTop: "3%", padding: 0 }}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={style2}>{getModalContent()}</Box>
      </Modal>
    </div>
  );
}

function Warehouses(props) {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);

  const fetchWarehouses = () => {
    if (warehouses.length === 0 && props.step === 1) {
      axios
        .get(`${host}/warehouses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setWarehouses(res.data.data);
          console.log(res.data.data);
        });
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [props.step]);

  return (
    <div>
      <h2>Click a warehouse to select your ship-from location</h2>
      <div className="modal-warehouse-next">
        <Button onClick={props.nextStep}>Next →</Button>
      </div>
      {warehouses.length
        ? warehouses.map((element, index) => {
            return (
              <div
                key={index}
                className={`modal-group ${
                  element.warehouse_id === props.warehouse_id
                    ? "selected-instance"
                    : ""
                }`}
                onClick={() => {
                  // const [warehouse_id, setWarehouse] = useState(null);
                  props.setWarehouse(element.warehouse_id);
                }}
              >
                <div className="modal-listing-left">
                  <h3 className="">{element.nick_name}</h3>
                  <span>{element.address_line1}</span>
                  {(() => {
                    if (element.address_line2) {
                      console.log(element.address_line2);
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
                      console.log(element.address_line3);
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
        <Button onClick={props.nextStep}>Next →</Button>
      </div>
    </div>
  );
}

/*

State management for these conditional components:

I need to re-factor these into the useContext API later

(or maybe I bite the bullet and implement Redux.
I still need to figure out local storage for persisting state too)

Right now these will fail to fetch new resources after ANY resource already exists

So if a user creates a new customer, warehouse, product, etc.
then it will not be fetched IF this has already fetched customers, warehouses, etc.

*/

function Customers(props) {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = () => {
    if (customers.length === 0 && props.step === 2) {
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

  useEffect(() => {
    fetchCustomers();
  }, [props.step]);
  return (
    <div>
      <h1>Select a Customer for this order</h1>
      <div className="modal-full-navigation">
        <Button onClick={props.prevStep}>Back</Button>
        <Button onClick={props.nextStep}>Next</Button>
      </div>
      {customers.length
        ? customers.map((element, index) => {
            return (
              <div
                className={`modal-group ${
                  element.customer_id === props.customer_id
                    ? "selected-instance"
                    : ""
                }`}
                onClick={() => {
                  // const [warehouse_id, setWarehouse] = useState(null);
                  props.setCustomer(element.customer_id);
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
        <Button onClick={props.prevStep}>Back</Button>
        <Button onClick={props.nextStep}>Next</Button>
      </div>
    </div>
  );
}

function Products(props) {
  /*
    <Products
            nextStep={nextStep}
            prevStep={prevStep}
            products={products}
            setProducts={setProducts}
            step={props.step}
          />
    */
  const { token } = useAuth();
  // list of products from DB
  const [products, setProducts] = useState([]);
  // passed products back up to order
  const [addProduct, setAddProducts] = useState(
    props.products?.length ? props.products : []
  );
  // if products exists in the top-level CreateOrder component, use that value

  const fetchProducts = () => {
    if (products.length === 0 && props.step === 3) {
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
  }, [props.step]);

  useEffect(() => {
    if (addProduct.length > 1) {
      props.setProducts(addProduct);
    }
  }, [addProduct]);

  return (
    <div>
      <h2>Add some Products</h2>
      <div className="modal-full-navigation">
        <Button onClick={props.prevStep}>Back</Button>
        <Button onClick={props.nextStep}>Next</Button>
      </div>
      {products.length
        ? products.map((element, index) => {
            return (
              <div
                key={index}
                className={`modal-group ${
                  // this conditional will also need to change
                  addProduct.includes(element.product_id)
                    ? "selected-instance"
                    : ""
                }`}
                onClick={(e) => {
                  // const [warehouse_id, setWarehouse] = useState(null);
                  // only allowing quantity 1 at this time
                  // I just need to get this up and running
                  // ... today.
                  // value should look more like:
                  // { product_id: element.product_id, quantity: 1 }
                  setAddProducts([...addProduct, element.product_id]);
                }}
              >
                <h3>{element.product_name}</h3>
                <span>{element.description}</span>
                <br />
                <span>{`$ ${element.price.toFixed(2)}`}</span>
              </div>
            );
          })
        : null}
      <div className="modal-full-navigation">
        <Button onClick={props.prevStep}>Back</Button>
        <Button onClick={props.nextStep}>Next</Button>
      </div>
    </div>
  );
}

function SubmitOrder(props) {
  const { token } = useAuth();
  const handleSubmit = () => {
    // Submit the order logic
    // props.handleClose();
    props.setTriggerOrder(true);
  };

  return (
    <div>
      {/* Your submit content */}
      <h2>Configure shipment details</h2>
      <label>
        Order Number (optional)
        <input
          type="number"
          value={props.order_number}
          onChange={(e) => {
            props.setOrderNumber(e.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Total Amount
        <input
          type="number"
          value={props.total_amount}
          onChange={(e) => {
            props.setTotalAmount(e.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Order Weight (lbs)
        <input
          type="number"
          value={props.order_weight}
          onChange={(e) => {
            props.setOrderWeight(e.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Dimension X (in)
        <input
          type="number"
          value={props.dimension_x}
          onChange={(e) => {
            props.setDimX(e.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Dimension Y (in)
        <input
          type="number"
          value={props.dimension_y}
          onChange={(e) => {
            props.setDimY(e.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Dimension Z (in)
        <input
          type="number"
          value={props.dimension_z}
          onChange={(e) => {
            props.setDimZ(e.target.value);
          }}
        />
      </label>
      <br />
      <Button onClick={props.prevStep}>Back</Button>
      <Button onClick={handleSubmit}>Create Label!</Button>
    </div>
  );
}
