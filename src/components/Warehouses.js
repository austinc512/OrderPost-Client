import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth, useWarehouseEditor } from "../AuthProvider";
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

const WarehouseEditor = () => {
  // auth
  const { token } = useAuth();
  const {
    // modal stuff
    openModal,
    modalType,
    // active resource
    selectedWarehouse,
    first_name,
    setFirstName,
    last_name,
    setLastName,
    nick_name,
    setNickName,
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
    setWarehouses,
  } = useWarehouseEditor();

  // Validate state input (ex: TX)
  const [stateError, setStateError] = useState(false);
  const [stateHelper, setStateHelper] = useState("");

  const handleStateInput = (e) => {
    const value = e.target.value;
    setStateProvince(value);

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

  const fetchWarehouses = async () => {
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
    console.log(selectedWarehouse);
  }, [selectedWarehouse]);

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

    let responseData;

    // verify address: this will occur for both CREATE and UPDATE
    // later optimization: only validate if address info is updated

    try {
      await axios
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

    if (modalType === "CREATE") {
      // if CREATE, make a new customer
      try {
        await axios
          .post(
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
          )
          .then(async (res) => {
            // console.log(res.data);
            // customerRes = res.data;
            await fetchWarehouses();
            handleClose();
          });
      } catch (err) {
        console.log(err);
        alert(`An error occurred during the warehouse creation step.`);
      }
    } else if (modalType === "UPDATE") {
      const warehouse_id = selectedWarehouse.warehouse_id;
      try {
        await axios
          .patch(
            `${host}/warehouses/${warehouse_id}`,
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
          )
          .then(async (res) => {
            await fetchWarehouses();
            handleClose();
          });
      } catch (err) {
        console.log(err);
        alert(`An error occurred during the warehouse update step.`);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log(`need to delete warehouse`);
    const warehouse_id = selectedWarehouse?.warehouse_id;
    if (!warehouse_id) {
      alert(`no customer is selected`);
      return;
    }
    //
    try {
      await axios.delete(
        `${host}/warehouses/${warehouse_id}`,
        // axios.delete doesn't need a req body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchWarehouses();
      handleClose();
    } catch (err) {
      console.log(err);
      alert(`an error occurred in the delete warehouse step`);
    }
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
            Warehouse Editor
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
                modalType === "CREATE"
                  ? "Create Warehouse!"
                  : "Update Warehouse!"
              }
            />
            {modalType === "UPDATE" ? (
              <button onClick={handleDelete}>Delete Warehouse</button>
            ) : null}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default function Warehouses() {
  const { token } = useAuth();

  const {
    // modal stuff
    setModalType,
    setSelectedWarehouse,
    handleOpen,
    // setter functions
    setFirstName,
    setLastName,
    setNickName,
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
    // resource list
    warehouses,
    setWarehouses,
  } = useWarehouseEditor();

  console.log(`Warehouse component render`);

  const handleWarehouseClick = (warehouse_id) => {
    console.log(warehouse_id);
    axios
      .get(`${host}/warehouses/${warehouse_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const address = res.data ?? "";
        setSelectedWarehouse(res.data);
        setFirstName(address?.first_name ?? "");
        setLastName(address?.last_name ?? "");
        setNickName(address?.nick_name ?? "");
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
        handleOpen();
      });
  };

  const fetchWarehouses = () => {
    if (token.length) {
      // console.log(`in Orders useEffect hook if(props.length), ${token}`);
      axios
        .get(`${host}/warehouses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setWarehouses(res.data.data);
          // console.log(res.data.data);
        });
    }
  };

  useEffect(() => {
    console.log(`warehouse fetch is occurring`);
    fetchWarehouses();
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
        Create Warehouse
      </Button>
      <WarehouseEditor />
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
              <TableRow key={warehouse.warehouse_id} className="table-row">
                {[
                  warehouse.warehouse_id,
                  warehouse.nick_name,
                  warehouse.company_name,
                  warehouse.address_line1,
                  warehouse.city_locality,
                  warehouse.state_province,
                  warehouse.postal_code,
                ].map((property, idx) => {
                  return (
                    <TableCell key={`${property}${idx}`}>
                      <span
                        onClick={() => {
                          setModalType("UPDATE");
                          handleWarehouseClick(warehouse.warehouse_id);
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
