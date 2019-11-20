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
    ctx.drawImage(videos, 10, 10);
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
    
    
      </div>
      <button  className='camera__btn' onClick={() =>!isOpenCamera?startVideo():captureButton()}>
        {!isOpenCamera?'Open Camera':'Capture'}
      </button>
      {!isOpenCamera?images.length === 0? <button onClick={clearImage} disabled>Clear Story</button>:<button onClick={clearImage}>Clear Story</button>:<button onClick={endVideo}>back</button>}
      
      
      
      <div className='camera__history'>
     {images.map((el)=>{
      return (
        <img src={`${el}`} />
      )  
     })}
   </div>
   
    </div>
  );
}

export default App;
