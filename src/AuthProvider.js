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
        openModal,
        setOpenModal,
        modalType,
        setModalType,
        selectedProduct,
        setSelectedProduct,
        product_name,
        setProductName,
        price,
        setPrice,
        description,
        setDescription,
        handleOpen,
        handleClose,
        products,
        setProducts,
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
