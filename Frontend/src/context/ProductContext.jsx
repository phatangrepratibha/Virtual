import { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [fashion, setFashion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Fetch fashion products
  const getFashion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/fashion", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch fashion products");
      }

      const data = await response.json();
      setFashion(data.message);
    } catch (error) {
      console.error(`Service frontend error: ${error}`);
      setError(error?.message || error.toString()); // handle undefined error message
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding a product to cart
  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
  };

  // Fetch products on component mount
  useEffect(() => {
    getFashion();
  }, []); // Only run once on mount

  return (
    <ProductContext.Provider
      value={{
        fashion,
        isLoading,
        error,
        handleAddToCart,
        refreshProducts: getFashion, // This can be used to trigger a manual refresh
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
