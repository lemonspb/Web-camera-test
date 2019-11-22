import React, { useState,useEffect } from "react";
import "./App.css";


function FullScreen({picture,closePicture}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    picture !== '' ? setActive(true): setActive(false)   
  }, [picture]);
    


  return (
      <>
      {active?<div className='full-screen'>
                    <div className='full-screen__container'>  
      <span className="close" onClick={()=>closePicture()}>&times;</span>
      <button>next</button> 
      <img src={picture} className='full-screen__img' alt='' />
      </div>
      </div>: null}
      
      </>
  )
}

export default FullScreen;
