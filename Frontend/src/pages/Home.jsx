import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import AboutUs from "../components/AboutUs";
import Feature from "../components/Feature";
import Pslider from "../components/Pslider";
import Slider from "../components/Slider";

const Home = () => {
  return (
    <>

    {/* <div className="heroSec">
      <h1>Try Before You Buy</h1>
    </div> */}
      <Slider />
      <Hero />
      <Pslider />

      <div className="card card-side bg-base-100 shadow-sm ml-5 mt-7">
        <div className="card-image">
          <img src="image/z2.jpg" alt="Movie " />
        </div>

        <div className="card-body ">
          <img src="image/z6.jpg" alt="Movie" />
        </div>
      </div>

      <Categories />
      <div className="poster w-full mt-25">
        <img
          src="image/d2.jpeg" // Replace with your image path
          alt="h"
          className="w-full h-auto max-h-[700px] object-cover"
        />
      </div>
      {/* <AboutHome/> */}
      <AboutUs />

      <Feature />
    </>
  );
};

export default Home;
