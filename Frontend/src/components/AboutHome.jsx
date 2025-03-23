import React from 'react'
import { useAuth } from '../store/auth'
import Lottie from "lottie-react"
import anim1 from "../animation/h1.json"

const AboutHome = () => {
    const{user}=useAuth();
  return (
   <>
   
   <div className="about-us">
  <div className="about-us-container">
    <div className="about-text">
      <h2>About Us</h2><hr/>
     <b> <p>Welcome, {user?.username ? `${user.username}!!` : "to our website"}</p>
     </b>
      <p>
      We are passionate about helping individuals achieve financial freedom and make informed decisions about their money. Whether you're just starting your financial journey or looking to optimize your wealth, we provide valuable insights, tools, and resources tailored to your needs.</p>
      <p>
      We aim to empower you with practical financial knowledge, guiding you toward smart budgeting, saving, investing, and wealth-building strategies. Our goal is to help you gain control over your finances and create a secure future.
      </p>
    </div>
    <div className="about-image">
      <Lottie animationData={anim1} loop={true} style={{width:"500px",marginLeft:"100px"}}/>
    </div>
  </div>
</div>
   </>
  )
}

export default AboutHome
