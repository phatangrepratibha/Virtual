import { createContext, useEffect, useMemo, useState } from "react";
import {
  getAuthUser,
  login as authLogin,
  logout as authLogout,
} from "../services/AuthService";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  // const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await getAuthUser();
        setUserData(response.user);
        setIsLoggedIn(true);
        // setCartCount(response.user.cartCount || 0);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setIsLoggedIn(false);
        setUserData(null);
        // setCartCount(0);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (userData) => {
    try {
      const response = await authLogin(userData);
      localStorage.setItem("token", response.token);
      setUserData(response.user);
      setIsLoggedIn(true);
      // setCartCount(response.user.cartCount || 0);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserData(null);
      // setCartCount(0);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // const addToCart = (quantity = 1) => {
  //   setCartCount((prevCount) => prevCount + quantity);
  // };

  // const removeFromCart = (quantity = 1) => {
  //   setCartCount((prevCount) => Math.max(0, prevCount - quantity));
  // };

  // const updateCartCount = (count) => {
  //   setCartCount(count);
  // };

  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      // cartCount,
      // addToCart,
      // removeFromCart,
      // updateCartCount,
      login,
      handleLogout,
    }),
    // [isLoggedIn, userData, cartCount]
    [isLoggedIn, userData]
  );

  return (
    <AppContent.Provider value={contextValue}>{children}</AppContent.Provider>
  );
};
