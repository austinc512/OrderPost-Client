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
// import DeleteIcon from "@mui/icons-material/Delete";

// GET /customers/:customerId/addresses

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

// handleCustomerClick()
// handleOpen();

function Customers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCustomerClick = (customer_id) => {
    axios
      .get(`${host}/customers/${customer_id}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // getCustomerAddresses
        // this is returning an array
        // another place where wanting to support multiple customer addresses
        // is rearing its ugly head.
        setSelectedCustomer(res.data.data[0]);
        console.log(res.data.data[0]);
        // and this other BS about the .data.data that crops up in a couple spots
        return res;
      })
      .then((res) => {
        setOpenModal(true);
      });
  };

  const fetchCustomers = () => {
    if (token.length) {
      console.log(`in Orders useEffect hook if(props.length), ${token}`);
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
  }, [token]);

  const CustomerCreator = () => {
    // input info -> verify address -> write customer -> write customer address
    /*
            {
            "ship_to_id": 1,
            "customer_id": 1,
            "first_name": "Austin",
            "last_name": "Covey",
            "phone": "512-545-3322",
            "email": "austincovey.dev@gmail.com",
            "company_name": "OrderPost",
            "address_line1": "500 W William Cannon dr",
            "address_line2": null,
            "address_line3": null,
            "city_locality": "Austin",
            "state_province": "TX",
            "postal_code": "78745",
            "country_code": "US",
            "address_residential_indicator": "unknown"
        }
    */
    const [first_name, setFirstName] = useState(null);
    const [last_name, setLastName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [email, setEmail] = useState(null);
    const [company_name, setCompanyName] = useState(null);
    const [address_line1, setAddressLine1] = useState(null);
    const [address_line2, setAddressLine2] = useState(null);
    const [address_line3, setAddressLine3] = useState(null);
    const [city_locality, setCity] = useState(null);
    const [state_province, setStateProvince] = useState(null);
    const [postal_code, setPostalCode] = useState(null);
    const [country_code, SetCountryCode] = useState(null);
    // const [address_residential_indicator, setResidential] = useState(null);
    // (also can't do add. res. ind. here because reasons)

    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => {
      setOpen2(false);
      setFirstName(null);
      setLastName(null);
      setPhone(null);
      setEmail(null);
      setCompanyName(null);
      setAddressLine1(null);
      setAddressLine2(null);
      setAddressLine3(null);
      setCity(null);
      setStateProvince(null);
      setPostalCode(null);
      SetCountryCode(null);
      // setResidential(null)
    };

    const navigate = useNavigate();

    return (
      <div>
        <Button
          style={{ margin: 10 }}
          variant="contained"
          onClick={handleOpen2}
        >
          Create Customer
        </Button>
        <Modal
          className="scrollable-content"
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
              Create Customer
            </h2>
            <form
              className="form"
              onSubmit={async (e) => {
                e.preventDefault();
                let responseData;
                let verifyRes;

                try {
                  verifyRes = await axios
                    .post(
                      // customerAddress endpoint requires a customerId
                      // using warehouses endpoint instead
                      // can reconsider later.
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
                      // ^^ this .then be turned off for production
                      console.log(res.data);
                      responseData = res.data;
                    });
                } catch (err) {
                  console.log(err);
                }
                if (responseData.status !== "verified") {
                  return alert(
                    "Address validation failed, check your address information. It is required that you input a valid address. Use this website to cross-reference your address info: https://tools.usps.com/zip-code-lookup.htm?byaddress"
                  );
                }
                console.log(responseData);
                console.log(`avoided callback hell`);
                let customerRes;
                let custApiReq;
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
                      console.log(res.data);
                      customerRes = res.data;
                    });
                } catch (err) {
                  console.log(err);
                }
                console.log(customerRes);
                /*
                data: 
                  customer_id: 8
                  email: "EX@example.com"
                  first_name: "austin"
                  last_name: "covey"
                  phone: "1234321234"
                  user_id: 1
                */
                const customer_id = customerRes.data.customer_id;
                let AddressRes;
                let AddressApiReq;
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
                      console.log(res.data);
                      AddressRes = res.data;
                    });
                  handleClose2();
                  navigate("/customers");
                  fetchCustomers();
                } catch (err) {
                  console.log(err);
                }

                // end of onSubmit function
              }}
            >
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
                onChange={(e) => {
                  setStateProvince(e.target.value);
                }}
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
                type="text"
                value={country_code}
                onChange={(e) => {
                  SetCountryCode(e.target.value);
                }}
              />
              {
                // This doesn't work right now, and I don't have the bandwidth to fix it.
                /* <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Is this a residential address?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="no"
                  name="radio-buttons-group"
                  value={address_residential_indicator}
                  onChange={setResidential}
                >
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="unknown"
                    control={<Radio />}
                    label="Unknown"
                  />
                </RadioGroup>
              </FormControl> */
              }

              <br />
              <input
                type="submit"
                className="submit"
                value="Create Customer!"
              />
            </form>
          </Box>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <CustomerCreator />
      {!customers.length ? (
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
              <h3>Address Info:</h3>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {`${selectedCustomer?.first_name} ${selectedCustomer?.last_name}`}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedCustomer?.address_line1}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedCustomer?.address_line2}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedCustomer?.address_line3}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {`${selectedCustomer?.city_locality}, ${selectedCustomer?.state_province} ${selectedCustomer?.postal_code}`}
              </Typography>
              <h3>Contact Info:</h3>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Phone: {selectedCustomer?.phone}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Email: {selectedCustomer?.email}
              </Typography>
            </Box>
          </Modal>
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
                              handleCustomerClick(customer.customer_id);
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

export default Customers;
