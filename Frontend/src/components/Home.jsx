import React from "react";
import { Link } from "react-router-dom";
import Hero from "./Hero";
import Categories from "./Categories";
import AboutUs from "./AboutUs";
import Feature from "./Feature";
import AboutHome from "./AboutHome";
import Pslider from "./Pslider";
import Slider from "./Slider";
import Avatar from "./Avatar";

const Home = () => {
  return (
    <>
     <Slider />
      <Pslider />
      <Hero />
      
      <Categories />
    {/* <AboutHome/> */}
     <Feature/>
 
    </>
  );
};

export default Home;
