import React, { createContext, useContext, useState } from "react";

// create context
const AuthContext = createContext();

// export useContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// export state variables
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const value = {
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//create context
const ProductEditorContext = createContext();

// export useContext
export const useProductEditor = () => {
  return useContext(ProductEditorContext);
};

// export state variables
export const ProductEditorProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  // I believe this one only controls ID value
  const [selectedProduct, setSelectedProduct] = useState("");

  // current product
  const [product_name, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // opening and closing modal
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setModalType("");
    setOpenModal(false);
    setSelectedProduct("");
    setProductName("");
    setPrice("");
    setDescription("");
  };

  // all products (is mapped over)
  const [products, setProducts] = useState([]);

  // alias setter functions so that they're unique in each component
  function aliasProductName(value) {
    setProductName(value);
  }
  const aliasPrice = (value) => {
    setPrice(value);
  };
  const aliasDescription = (value) => {
    setDescription(value);
  };
  const aliasSetProducts = (value) => {
    setProducts(value);
  };

  return (
    <ProductEditorContext.Provider
      value={{
        // modal stuff
        openModal,
        setOpenModal,
        modalType,
        setModalType,
        // active resource
        selectedProduct,
        setSelectedProduct,
        product_name,
        setProductName,
        price,
        setPrice,
        description,
        setDescription,
        // modal stuff
        handleOpen,
        handleClose,
        // resource list
        products,
        setProducts,
        // aliases
        aliasProductName,
        aliasPrice,
        aliasDescription,
        aliasSetProducts,
      }}
    >
      {children}
    </ProductEditorContext.Provider>
  );
};

// create context
const CustomerContext = createContext();

// export useContext
export const useCustomerEditor = () => {
  return useContext(CustomerContext);
};

// export state variables
export const CustomerEditorProvider = ({ children }) => {
  // global state management for customer

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  // I believe this one only controls ID value
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // active resource stuff
  // I don't think aliasing these setters actually made a difference
  // updates to any editable field still causes re-render of List component
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [address_line1, setAddressLine1] = useState("");
  const [address_line2, setAddressLine2] = useState("");
  const [address_line3, setAddressLine3] = useState("");
  const [city_locality, setCity] = useState("");

  const [state_province, setStateProvince] = useState("");

  const [postal_code, setPostalCode] = useState("");
  const [country_code, SetCountryCode] = useState("");

  //resource list
  const [customers, setCustomers] = useState([]);

  // need a way of targeting the correct address
  const [ship_to_id, setShipToId] = useState("");

  // opening and closing modal
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setModalType("");
    setOpenModal(false);
    // other active resource resets
    setSelectedCustomer("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setCompanyName("");
    setAddressLine1("");
    setAddressLine2("");
    setAddressLine3("");
    setCity("");
    setStateProvince("");
    setPostalCode("");
    SetCountryCode("");
    setShipToId(0);
    // setCustomerName("");
    // setPrice("");
    // setDescription("");
  };

  return (
    <CustomerContext.Provider
      value={{
        // modal stuff
        openModal,
        setOpenModal,
        modalType,
        setModalType,
        // active resource
        selectedCustomer,
        setSelectedCustomer,
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
        // ship_to_id
        ship_to_id,
        setShipToId,
        // modal stuff
        handleOpen,
        handleClose,
        // resource list
        customers,
        setCustomers,
        // aliases
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
