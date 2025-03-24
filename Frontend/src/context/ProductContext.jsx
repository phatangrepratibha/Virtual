import { createContext, useContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [fashion, setFashion] = useState([]);

  const getFashion = async () => {
    try {
      const response = await fetch("http://localhost:3000/fashion", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fashion data", data.message);
        setFashion(data.message);
      }
    } catch (error) {
      console.log(`Service frontend error: ${error}`);
    }
  };

  useEffect(() => {
    getFashion();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        fashion,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const productContextValue = useContext(ProductContext);
  if (!productContextValue) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return productContextValue;
};
