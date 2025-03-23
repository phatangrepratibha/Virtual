import React from "react";
import { Link } from "react-router-dom";
import Hero from "./Hero";
import Categories from "./Categories";
import AboutUs from "./AboutUs";
import Feature from "./Feature";
import Pslider from "./Pslider";
import Slider from "./Slider";


const Home = () => {
  return (
    <>
     <Slider />
      <Pslider />
      <Hero />
      
      <Categories />

 <div className="card card-side bg-base-100 shadow-sm ml-5 mt-7">
    <div className="card-image">
    <img src="image/z9.jpg" alt="Movie "/>
    </div>

  <div className="card-body mt-10">
      <img src="image/z6.jpg" alt="Movie"  />
  </div>
</div>
    {/* <AboutHome/> */}
     <Feature/>
     <AboutUs/>

   
    </>
  );
};

export default Home;
