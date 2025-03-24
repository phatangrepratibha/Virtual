import React, { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import AuthModal from "../components/AuthModal";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useContext(AppContent);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    }
    setCheckedAuth(true);
  }, [isLoggedIn]);

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  if (!checkedAuth) return null;

  return (
    <>
      {isLoggedIn ? (
        <Outlet />
      ) : (
        <>
          <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
          {!isAuthModalOpen && checkedAuth && <Navigate to="/" replace />}
        </>
      )}
    </>
  );
};

export default ProtectedRoutes;
