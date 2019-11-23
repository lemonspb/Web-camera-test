import React, { useState,useEffect } from "react";
import "./App.css";


function FullScreen({picture,closePicture,next,prev}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    picture? setActive(true): setActive(false)   
  }, [picture]);
    


  return (
      <>
      {active?<div className='full-screen'>
                    <div className='full-screen__container'>  
      <span className="close" onClick={()=>closePicture()}>&times;</span>
      <div className='full-screen__btn-block'>
      <button onClick={next} className='full-screen__btn full-screen__btn--next'>&#8250;</button> 
      <button onClick={prev} className='full-screen__btn full-screen__btn--prev'> &#8249;</button> 
      </div>
      <img src={picture} className='full-screen__img' alt='' />
      </div>
      </div>: null}
      
      </>
  )
}

export default FullScreen;
