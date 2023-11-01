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

// create context
const WarehouseContext = createContext();

// export useContext
export const useWarehouseEditor = () => {
  return useContext(WarehouseContext);
};

export const WarehouseEditorProvider = ({ children }) => {
  // modal stuff
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");

  // I believe this one only controls ID value
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  // active resource stuff
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [nick_name, setNickName] = useState("");

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

  // resource list
  const [warehouses, setWarehouses] = useState([]);

  // opening and closing modal
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setModalType("");
    setOpenModal(false);
    // other active resource resets
    setSelectedWarehouse("");
    setFirstName("");
    setLastName("");
    setNickName("");
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
  };

  return (
    <WarehouseContext.Provider
      value={{
        // modal stuff
        openModal,
        setOpenModal,
        modalType,
        setModalType,
        // active resource
        selectedWarehouse,
        setSelectedWarehouse,
        first_name,
        setFirstName,
        nick_name,
        setNickName,
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
        handleOpen,
        handleClose,
        // resource list
        warehouses,
        setWarehouses,
        // aliases
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

//create context
const OrderEditorContext = createContext();

// export useContext
export const UseOrderEditor = () => {
  return useContext(OrderEditorContext);
};

// export state variables
export const OrderEditorProvider = ({ children }) => {
  // basic modal stuff
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");

  // global state shared among all sub-modals
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  // needed for MultiStepModal
  const handleOpen = () => {
    setStep(1);
    setOpen(true);
  };
  // A SHIT TON OF STATE NEEDS TO BE SET HERE
  const handleClose = () => {
    setOpen(false);
    setStep(0); // Reset step when modal closes
    setWarehouse("");
    setCustomer("");
    setOrderItems([]);
    setOrderNumber("");
    setTotalAmount(0);
    setOrderWeight(1);
    setDimX(1);
    setDimY(1);
    setDimZ(1);
  };
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Some pieces of state are shared between MultiStepModal and each individual sub-modal:

  // 1) WarehousesModal
  const [warehouse_id, setWarehouse] = useState("");

  // 2) CustomersModal
  const [customer_id, setCustomer] = useState("");

  // ProductsModal
  // Order Items Logic needed for ProductsModal
  const [orderItems, setOrderItems] = useState([]);

  // functions for editing order_items
  const addItem = (product_id, quantity, price) => {
    // Check if product_id already exists in the list
    const existingItem = orderItems.find(
      (item) => item.product_id === product_id
    );

    if (existingItem) {
      // Update the quantity if the product_id already exists
      // the input element will be the source of truth
      const updatedItems = orderItems.map((item) =>
        item.product_id === product_id ? { ...item, quantity: quantity } : item
      );
      setOrderItems(updatedItems);
    } else {
      // Add the new order-item if it doesn't exist in the list
      setOrderItems([...orderItems, { product_id, quantity, price }]);
    }
    console.log({
      message: `addItem function has been triggered`,
      targetProduct: { product_id, quantity },
    });
  };

  const deleteItem = (product_id) => {
    const updatedItems = orderItems.filter(
      (item) => item.product_id !== product_id
    );
    setOrderItems(updatedItems);
    console.log({ message: "A product has been deleted", product_id });
  };

  // Don't think I need this one
  // The modal will have an input element to edit quantity
  // const updateQuantity = (product_id, newQuantity) => {
  //   const updatedItems = orderItems.map((item) =>
  //     item.product_id === product_id ? { ...item, quantity: newQuantity } : item
  //   );
  //   setOrderItems(updatedItems);
  // };

  // SubmitOrder
  // don't really want this one here.
  const [triggerOrder, setTriggerOrder] = useState(false);
  const [order_number, setOrderNumber] = useState("");

  // need the default value for totalAmount
  const defaultAmount = () => {
    console.log(`default amount function running`);
    console.log(orderItems);
    let total = 0;
    for (let item of orderItems) {
      total += item.quantity * item.price;
    }
    return total;
  };
  const [total_amount, setTotalAmount] = useState(0);
  const [order_weight, setOrderWeight] = useState(1);
  const [dimension_x, setDimX] = useState(1);
  const [dimension_y, setDimY] = useState(1);
  const [dimension_z, setDimZ] = useState(1);

  // defaulted values
  const [order_date, setOrderDate] = useState(new Date().toISOString());
  const [order_status, setOrderStatus] = useState("unshipped");
  const [ship_by_date, setShipByDate] = useState(new Date().toISOString());
  const [service_code, setServiceCode] = useState("usps_priority_mail");
  const [package_code, setPackageCode] = useState("package");
  const [confirmation, setConfirmation] = useState("none");
  const [weight_units, setWeightUnits] = useState("pound");
  const [dimension_units, setDimensionUnits] = useState("inch");

  // setting orders list needs to happen in 2 separate places
  const [orders, setOrders] = useState([]);

  return (
    <OrderEditorContext.Provider
      value={{
        // basic modal stuff
        openModal,
        setOpenModal,
        modalType,
        setModalType,
        open,
        setOpen,
        step,
        setStep,
        // needed for MultiStepModal
        handleOpen,
        handleClose,
        nextStep,
        prevStep,
        // WarehousesModal
        warehouse_id,
        setWarehouse,
        // CustomersModal
        customer_id,
        setCustomer,
        // ProductsModal
        orderItems,
        setOrderItems,
        // OrderItems
        addItem,
        deleteItem,
        // SubmitOrder
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
        // defaulted values
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
        // global state shared among all sub-modals
        // MultiStepModal
        defaultAmount,
        // setting orders list needs to happen in 2 separate places
        orders,
        setOrders,
      }}
    >
      {children}
    </OrderEditorContext.Provider>
  );
};
