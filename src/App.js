import React, { useState } from "react";
import camera from './image/camera.png'
import "./App.css";

function App() {
  const canvasRef = React.createRef()
  const [images, setImages] = useState([]);
  const [videos, setVideos] =   useState(document.querySelector("video"))
  const [showImage, setShowImage] = useState(true);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  let video = null;
  let canvas = null;
  const constraints = {
    video:{ width: 400, height: 320}
  };

  function addImage() {
    let data = canvas.toDataURL("image/png");
    setImages([...images,data])
  
  }

  function captureButton() {
    canvas = canvasRef.current
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videos, 0, 0,  200, 150);
    addImage();
    
  }
  
const clearImage = () =>{
  setImages([])
}

  const startVideo = () => {
    setIsOpenCamera(true)
    setShowImage(false)
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        video = document.querySelector("video");
        if ("srcObject" in video) {
          video.srcObject = stream;
          setVideos(video)
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
          video.play();
         
        };
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  };
  const endVideo = () =>{
   
      let stream = videos.srcObject;
      let tracks = stream.getTracks();
    
      tracks.forEach(function(track) {
        track.stop();
      });
      setShowImage(true)
      setIsOpenCamera(false)
      videos.srcObject = null;
    }

  

  return (
    <div className="camera">
      <canvas className='camera__canvas' ref={canvasRef}></canvas>
      <div className='camera__content'>
        {showImage? <img src={camera}  className='camera__image' alt=''/> : <video src="" className='camera__video' ></video>}
        <div className='camera__btn-block'>
        <button  className=' camera__btn camera__btn--screen' onClick={() =>!isOpenCamera?startVideo():captureButton()}>
        {!isOpenCamera?'Open Camera':'Capture'}
      </button>
      {!isOpenCamera?images.length === 0? <button onClick={clearImage} disabled className='camera__btn camera__btn--clear'>Clear Story</button>:<button onClick={clearImage} className='camera__btn camera__btn--clear'>Clear Story</button>:<button className=' camera__btn camera__btn--back' onClick={endVideo}>back</button>}
      </div>
      </div>
    
      
      
      {images.length === 0?'':<h3>History</h3>}  
      <div className='camera__history'>
    
     {images.map((el)=>{
      return (
        <div className='camera__wrap-img'>
        <img src={`${el}`}  alt='' className='camera__img' />
        </div>
      )  
     })}
   </div>
   
    </div>
  );
}

export default App;
