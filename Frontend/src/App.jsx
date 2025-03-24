import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Shop from "./components/Shop";
import ItemHome from "./components/ItemHome";
import Contactus from "./components/Contactus";
import Slider from "./components/Slider";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import AboutUs from "./components/AboutUs";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Pslider from "./components/Pslider";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Buy from "./components/Buy";
import OrderSuccess from "./components/OrderSuccess";
import ProdSummary from "./components/prodSummary";
import Avatar from "./components/Avatar";

import { useState } from "react";
import ForgetPassword from "./components/ForgetPassword";
import VerifyEmail from "./components/VerifyEmail";
import Home from "./pages/Home";

function App() {

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar
      isAuthModalOpen={isAuthModalOpen}
      setIsAuthModalOpen={setIsAuthModalOpen}
       />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/verify" element={<VerifyEmail />} />

        <Route element={<ProtectedRoutes/>}>

        <Route path="/shop" element={<Shop />} />
        <Route path="/itemhome" element={<ItemHome />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/slider" element={<Slider/>} />
        <Route path="/hero" element={<Hero/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/pslider" element={<Pslider/>} />
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/buy/:id" element={<Buy />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/prodsummary" element={<ProdSummary />} />
        <Route path="/try-on" element={<Avatar />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
