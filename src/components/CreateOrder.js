import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "../AuthProvider";
import axios from "axios";

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
  const [products, setProducts] = useState([]);

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
        return <SubmitOrder handleClose={handleClose} prevStep={prevStep} />;
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
  }, [token]);

  return (
    <div>
      <h2>Click on a warehouse to select your ship-from location</h2>
      <Button className="top-paging-button" onClick={props.nextStep}>
        Next →
      </Button>
      {warehouses.length
        ? warehouses.map((element, index) => {
            return (
              <div
                key={index}
                className={
                  element.warehouse_id === props.warehouse_id
                    ? "selected-instance"
                    : ""
                }
                onClick={() => {
                  // const [warehouse_id, setWarehouse] = useState(null);
                  props.setWarehouse(element.warehouse_id);
                }}
              >
                <h3 table-row className="table-row">
                  {element.nick_name}
                </h3>
                {element.address_line1}
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
                {`${element?.city_locality}, ${element?.state_province} ${element?.postal_code}`}
              </div>
            );
          })
        : null}
      <Button className="" onClick={props.nextStep}>
        Next →
      </Button>
    </div>
  );
}

function Customers(props) {
  const { token } = useAuth();
  return (
    <div>
      {/* Your customer content */}
      <h1>Select a Customer for this order</h1>
      <Button onClick={props.prevStep}>Back</Button>
      <Button onClick={props.nextStep}>Next</Button>
    </div>
  );
}

function Products(props) {
  const { token } = useAuth();
  return (
    <div>
      {/* Your products content */}
      <h1>Add some Products</h1>
      <Button onClick={props.prevStep}>Back</Button>
      <Button onClick={props.nextStep}>Next</Button>
    </div>
  );
}

function SubmitOrder(props) {
  const { token } = useAuth();
  const handleSubmit = () => {
    // Submit the order logic
    props.handleClose();
  };

  return (
    <div>
      {/* Your submit content */}
      <h1>Submit</h1>
      <Button onClick={props.prevStep}>Back</Button>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
