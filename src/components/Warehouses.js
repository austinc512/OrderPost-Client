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

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

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

function Warehouses() {
  const { token } = useAuth();
  const [warehouses, setWarehouses] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedWarehouse(null);
  };

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleWarehouseClick = (warehouse_id) => {
    axios
      .get(`${host}/warehouses/${warehouse_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSelectedWarehouse(res.data);
        return res;
      })
      .then((res) => {
        setOpenModal(true);
      });
  };

  const fetchWarehouses = () => {
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
        });
    }
  };

  useEffect(() => {
    if (token.length) {
      fetchWarehouses();
    }
  }, [token]);

  const WarehouseCreator = () => {
    /*
    required props:
     !first_name ||
    !last_name ||
    !nick_name ||
    !phone ||
    !address_line1 ||
    !city_locality ||
    !state_province ||
    !postal_code ||
    !country_code

    all props:
    {
    first_name,
    last_name,
    nick_name,
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
    address_residential_indicator,
  }

    */
    const [first_name, setFirstName] = useState(null);
    const [last_name, setLastName] = useState(null);
    const [nick_name, setNickName] = useState(null);
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

    // frontend is responsible for formatting request to ShipEngine
    // circular reference in address_residential_indicator code
    // (something in the MUI implementation)
    // will iron this out at a later time.

    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => {
      setOpen2(false);
      setFirstName(null);
      setLastName(null);
      setNickName(null);
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
          Create Warehouse
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
              Create Warehouse
            </h2>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(
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
                    // ^^ this .then be turned off for production
                    console.log(res.data);
                    // return res;
                    if (res.data.status === "verified") {
                      axios.post(
                        `${host}/warehouses/`,
                        {
                          first_name,
                          last_name,
                          nick_name,
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
                      );
                      handleClose2();
                      navigate("/warehouses");
                      fetchWarehouses();
                    } else {
                      alert(
                        "Address validation failed, check your address information. It is required that you input a valid address"
                      );
                    }
                  });
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
                label="Nickname"
                required
                type="text"
                value={nick_name}
                onChange={(e) => {
                  setNickName(e.target.value);
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
                value="Create Warehouse!"
              />
            </form>
          </Box>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <WarehouseCreator />
      {!warehouses.length ? (
        <p>(No warehouses to list)</p>
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
                {selectedWarehouse?.nick_name}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedWarehouse?.address_line1}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedWarehouse?.address_line2}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedWarehouse?.address_line3}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {`${selectedWarehouse?.city_locality}, ${selectedWarehouse?.state_province} ${selectedWarehouse?.postal_code}`}
              </Typography>
            </Box>
          </Modal>
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
              {warehouses.map((warehouse, index) => {
                return (
                  <TableRow className="table-row" key={warehouse.warehouse_id}>
                    {[
                      warehouse.warehouse_id,
                      warehouse.nick_name,
                      warehouse.company_name,
                      warehouse.address_line1,
                      warehouse.city_locality,
                      warehouse.state_province,
                      warehouse.postal_code,
                    ].map((property) => {
                      return (
                        <TableCell key={property}>
                          <span
                            onClick={() => {
                              handleWarehouseClick(warehouse.warehouse_id);
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

export default Warehouses;
