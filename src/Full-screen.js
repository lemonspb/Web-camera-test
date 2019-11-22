import React, { useState,useEffect } from "react";
import "./App.css";


function FullScreen({picture}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    picture !== '' ? setActive(true): setActive(false)   
  }, [picture]);
    
const closeFullScreen = () => setActive(false)

  return (
      <>
      {active?<div className='full-screen'>
                    <div className='full-screen__container'>  
      <span class="close" onClick={closeFullScreen}>&times;</span>
      <img src={picture} className='full-screen__img' alt='' />
      </div>
      </div>: null}
      
      </>
  )
}

export default FullScreen;
