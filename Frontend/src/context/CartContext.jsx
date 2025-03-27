import { createContext, useContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Calculate derived values with useMemo
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  }, [cartItems]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
      setCartError("Failed to save cart data");
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      setCartError("Invalid product");
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId, removeAll = false) => {
    setCartItems((prevItems) => {
      if (removeAll) {
        return prevItems.filter((item) => item.id !== productId);
      }

      const existingItem = prevItems.find((item) => item.id === productId);
      if (!existingItem) return prevItems;

      if (existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, true);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const syncCartWithServer = async (token) => {
    if (!token) return;

    setIsCartLoading(true);
    setCartError(null);

    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const serverCart = await response.json();
        setCartItems(serverCart);
      }
    } catch (error) {
      console.error("Error syncing cart with server:", error);
      setCartError("Failed to sync cart with server");
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartLoading,
        cartError,
        isInCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        syncCartWithServer,
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
