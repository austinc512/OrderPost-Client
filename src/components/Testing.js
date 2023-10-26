import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth, useCustomerEditor } from "../AuthProvider";
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

const CustomerEditor = () => {
  // auth
  const { token } = useAuth();
  const {
    // modal stuff
    openModal,
    modalType,
    // active resource
    selectedCustomer,
    first_name,
    setFirstName,
    last_name,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    company_name,
    setCompanyName,
    address_line1,
    setAddressLine1,
    address_line2,
    setAddressLine2,
    address_line3,
    setAddressLine3,
    city_locality,
    setCity,
    state_province,
    setStateProvince,
    postal_code,
    setPostalCode,
    country_code,
    SetCountryCode,
    // more modal stuff
    handleClose,
    // resource list
    // don't think this exists in global storage yet.
    setCustomers,
    // need to set ship_to_id on customer click.
    ship_to_id,
  } = useCustomerEditor();

  // Validate state input (ex: TX)

  const [stateError, setStateError] = useState(false);
  const [stateHelper, setStateHelper] = useState("");

  const handleStateInput = (e) => {
    const value = e.target.value;
    setStateProvince(value);

    // Validate the input value using the pattern
    if (value && !/^[A-Z]{2}$/.test(value)) {
      setStateError(true);
      setStateHelper("Please enter a valid 2-letter State code (e.g. TX)");
    } else {
      setStateError(false);
      setStateHelper("");
    }
  };

  // validate country input (ex: US)
  const [countryError, setCountryError] = useState(false);
  const [countryHelper, setCountryHelper] = useState("");

  const handleCountryInput = (e) => {
    const value = e.target.value;
    SetCountryCode(value);

    if (value && !/^[A-Z]{2}$/.test(value)) {
      setCountryError(true);
      setCountryHelper("Please enter a valid 2-letter Country code (e.g. US)");
    } else {
      setCountryError(false);
      setCountryHelper("");
    }
  };

  const fetchCustomers = () => {
    if (token.length) {
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

  // modalType and ship_to_id are getting passed properly
  // useEffect(() => {
  //   console.log(modalType);
  // }, [modalType]);

  // useEffect(() => {
  //   console.log({ ship_to_id });
  // }, [ship_to_id]);

  // if updating a customer, this returns an object that contains customer_id
  useEffect(() => {
    console.log(selectedCustomer);
  }, [selectedCustomer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // active resource stuff
    console.log({
      first_name,
      last_name,
      phone,
      email,
      company_name,
      address_line1,
      address_line2,
      address_line3,
      city_locality,
      state_province,
      modalType,
      postal_code,
      country_code,
    });

    let responseData, verifyRes;

    // verify address: this will occur for both CREATE and UPDATE
    // later optimization: only validate if address info is updated
    try {
      verifyRes = await axios
        .post(
          // customerAddress endpoint requires a customerId
          // using warehouses endpoint instead
          `${host}/warehouses/verify`,
          {
            name: `${first_name} ${last_name}`,
            phone,
            email,
            company_name,
            address_line1,
            address_line2,
            address_line3,
            city_locality,
            state_province: `${state_province.toUpperCase()}`,
            postal_code,
            country_code: `${country_code.toUpperCase()}`,
            // address_residential_indicator,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          responseData = res.data;
        });
    } catch (err) {
      //
      console.log(err);
      alert(`An error occurred during the address validation step.`);
    }
    if (responseData.status !== "verified") {
      return alert(
        "Address validation failed, check your address information. It is required that you input a valid address. Use this website to cross-reference your address info: https://tools.usps.com/zip-code-lookup.htm?byaddress"
      );
    }

    // if here, address info passes vaildation
    // Modal types: CREATE or UPDATE

    let customerRes;
    let custApiReq;
    let customer_id;
    let AddressRes;
    let AddressApiReq;

    if (modalType === "CREATE") {
      // if CREATE, make a new customer
      try {
        custApiReq = await axios
          .post(
            `${host}/customers/`,
            {
              first_name,
              last_name,
              phone,
              email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            // console.log(res.data);
            customerRes = res.data;
          });
      } catch (err) {
        console.log(err);
        alert(`An error occurred during the customer creation step.`);
      }

      customer_id = customerRes.data.customer_id;
      // create customer address
      try {
        AddressApiReq = await axios
          .post(
            `${host}/customers/${customer_id}/addresses`,
            {
              first_name,
              last_name,
              phone,
              email,
              company_name,
              address_line1,
              address_line2,
              address_line3,
              city_locality,
              state_province,
              postal_code,
              country_code,
              // address_residential_indicator,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            // console.log(res.data);
            AddressRes = res.data;
          });
        handleClose();
        fetchCustomers();
      } catch (err) {
        console.log(err);
        alert(`An error occurred during the customer address creation step.`);
      }
    } else if (modalType === "UPDATE") {
      // what info is needed?
      // path param: customer ID
      // body: first_name, last_name, phone, email

      customer_id = selectedCustomer.customer_id;
      console.log({
        first_name,
        last_name,
        phone,
        email,
        customer_id,
        ship_to_id,
      });
      // update existing customer
      try {
        custApiReq = await axios
          .patch(
            `${host}/customers/${customer_id}`,
            {
              first_name,
              last_name,
              phone,
              email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            // console.log(res.data);
            customerRes = res.data;
          });
      } catch (err) {
        console.log(err);
        alert(`An error occurred during the update customer step.`);
      }
      // update address
      /*
      {
              first_name,
              last_name,
              phone,
              email,
              company_name,
              address_line1,
              address_line2,
              address_line3,
              city_locality,
              state_province,
              postal_code,
              country_code,
              // address_residential_indicator,
            }
            all of this is stil accessible
      */
      try {
        AddressApiReq = await axios
          .patch(
            `${host}/customers/${customer_id}/addresses/${ship_to_id}`,
            {
              first_name,
              last_name,
              phone,
              email,
              company_name,
              address_line1,
              address_line2,
              address_line3,
              city_locality,
              state_province,
              postal_code,
              country_code,
              // address_residential_indicator,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            AddressRes = res.data;
            console.log(
              `${host}/customers/${customer_id}/addresses/${ship_to_id}`
            );
            console.log(res);
          });
        handleClose();
        fetchCustomers();
      } catch (err) {
        console.log(err);
        alert(`An error occurred during the customer address update step.`);
      }
    }
  };

  const handleDelete = () => {
    console.log(`need to delete customer`);
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
            Customer Editor
          </h2>
          <form className="form" onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              variant="outlined"
              required
              type="text"
              value={first_name}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              required
              type="text"
              value={last_name}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <TextField
              label="Phone (555-444-4321)"
              required
              // multiline
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            <TextField
              label="Email (example@example.com)"
              required
              // multiline
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              label="Company Name"
              type="text"
              value={company_name}
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
            />
            <TextField
              label="Address Line 1"
              required
              // multiline
              type="text"
              value={address_line1}
              onChange={(e) => {
                setAddressLine1(e.target.value);
              }}
            />
            <TextField
              label="Address Line 2"
              type="text"
              value={address_line2}
              onChange={(e) => {
                setAddressLine2(e.target.value);
              }}
            />
            <TextField
              label="Address Line 3"
              type="text"
              value={address_line3}
              onChange={(e) => {
                setAddressLine3(e.target.value);
              }}
            />
            <TextField
              label="City"
              required
              type="text"
              value={city_locality}
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
            <TextField
              label="State (TX, not Texas)"
              required
              type="text"
              value={state_province}
              onChange={handleStateInput}
              error={stateError}
              helperText={stateHelper}
            />
            <TextField
              label="Postal Code"
              required
              type="text"
              value={postal_code}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
            />
            <TextField
              label="Country Code (US, not United States)"
              required
              // pattern="[A-Z]{2}"
              // (doesn't work with MUI TextField)
              type="text"
              value={country_code}
              onChange={handleCountryInput}
              error={countryError}
              helperText={countryHelper}
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
              <button onClick={handleDelete}>Delete Customer</button>
            ) : null}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default function Customers() {
  const { token } = useAuth();

  const {
    // modal stuff
    setModalType,
    setSelectedCustomer,
    handleOpen,
    // setter functions
    setFirstName,
    setLastName,
    setPhone,
    setEmail,
    setCompanyName,
    setAddressLine1,
    setAddressLine2,
    setAddressLine3,
    setCity,
    setStateProvince,
    setPostalCode,
    SetCountryCode,
    setShipToId,
    // resource list
    customers,
    setCustomers,
  } = useCustomerEditor();

  const handleCustomerClick = (customer_id) => {
    console.log(customer_id);
    axios
      .get(`${host}/customers/${customer_id}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // this is returning an array
        // another place where wanting to support multiple customer addresses is rearing its ugly head.
        const address = res.data?.data[0] ?? "";
        setSelectedCustomer(address);
        setFirstName(address?.first_name ?? "");
        setLastName(address?.last_name ?? "");
        setPhone(address?.phone ?? "");
        setEmail(address?.email ?? "");
        setCompanyName(address?.company_name ?? "");
        setAddressLine1(address?.address_line1 ?? "");
        setAddressLine2(address?.address_line2 ?? "");
        setAddressLine3(address?.address_line3 ?? "");
        setCity(address?.city_locality ?? "");
        setStateProvince(address?.state_province ?? "");
        setPostalCode(address?.postal_code ?? "");
        SetCountryCode(address?.country_code ?? "");
        setShipToId(address?.ship_to_id ?? "");
        handleOpen();
      });
  };

  const fetchCustomers = () => {
    if (token.length) {
      // console.log(`in Orders useEffect hook if(props.length), ${token}`);
      axios
        .get(`${host}/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCustomers(res.data.data);
          // console.log(res.data.data);
        });
    }
  };

  useEffect(() => {
    console.log(`customer fetch is occurring`);
    fetchCustomers();
  }, [token]);

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
        Create Customer
      </Button>
      <CustomerEditor />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer, index) => {
            return (
              <TableRow key={customer.customer_id} className="table-row">
                {[
                  customer.customer_id,
                  `${customer.first_name} ${customer.last_name}`,
                  customer.phone,
                  customer.email,
                ].map((property) => {
                  return (
                    <TableCell key={property}>
                      <span
                        onClick={() => {
                          setModalType("UPDATE");
                          handleCustomerClick(customer.customer_id);
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
  );
}
