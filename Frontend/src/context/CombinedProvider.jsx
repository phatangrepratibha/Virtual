import React from "react";
import { AppContextProvider } from "./AppContext";
import { CartProvider } from "./CartContext";
import { ProductProvider } from "./ProductContext";

export const CombinedProvider = ({ children }) => {
  return (
    <AppContextProvider>
      <CartProvider>
        <ProductProvider>{children}</ProductProvider>
      </CartProvider>
    </AppContextProvider>
  );
};
