import { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(Array(cartCount).fill("item")));
  }, [cartCount]);

  const addToCart = (quantity = 1) => {
    setCartCount((prevCount) => prevCount + quantity);
  };

  const removeFromCart = (quantity = 1) => {
    setCartCount((prevCount) => Math.max(0, prevCount - quantity));
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const cartContextValue = useContext(CartContext);
  if (!cartContextValue) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return cartContextValue;
};
