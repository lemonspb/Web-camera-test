import React, { useState } from "react";
import camera from "./image/camera.png";
import "./App.css";
import Moment from 'react-moment';
function App() {
  
  const canvasRef = React.createRef();
  const videoRef = React.createRef();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState("");
  const [isOpenCamera, setIsOpenCamera] = useState(false);

  const constraints = {
    video: { width: 400, height: 320 }
  };

  
  const addImage = () => {
    let time = new Date() 
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videos, 0, 0, 350, 160);
    const data = canvasRef.current.toDataURL("image/png");
    const object = {
      date: time,
      img: data
    }
    setImages([...images,object])
    
  };
  console.log(images)

  const clearImage = () => {
    setImages([]);
  };

  const startVideo = () => {

    setIsOpenCamera(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        let video = document.querySelector("video");

        setVideos(video);

        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = e => {
          video.play();
        };
      })
      .catch(err => {
        console.log(err.name + ": " + err.message);
      });
  };

  const endVideo = () => {
    videos.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    videos.srcObject = null;
    setIsOpenCamera(false);
  };

const deleteImage = (img) =>{
const newImages = images.filter((el) =>  el !== img)
setImages(newImages)  
}

  return (
    <div className="camera">
      <canvas className="camera__canvas" ref={canvasRef}></canvas>
      <div className="camera__content">
        {!isOpenCamera ? (
          <img src={camera} className="camera__image" alt="" />
        ) : (
            <video src="" className="camera__video" ref={videoRef}></video>
          )}
        <div className="camera__btn-block">
          <button
            className=" camera__btn camera__btn--screen"
            onClick={() => (!isOpenCamera ? startVideo() : addImage())}>
            {!isOpenCamera ? "Open Camera" : "Capture"}
          </button>
          {!isOpenCamera ? (
            <button
              onClick={clearImage}
              disabled={images.length === 0}
              className="camera__btn camera__btn--clear">
              Clear Story
            </button>
          ) : (
              <button
                className=" camera__btn camera__btn--back"
                onClick={endVideo}>
                Back
            </button>
            )}
        </div>
      </div>

      {images.length > 0 && <h3>History</h3>}
      <div className="camera__history">
        {images.map((el) => {
         console.log(el)
          return (
            <div className="camera__wrap-img" >
              <img src={`${el.img}`} alt="" className="camera__img"  download/>
              <span>
              <Moment format='lll'>
              {el.date}  
            </Moment>
             </span>
              <button onClick={ () =>deleteImage(el)}  className='camera__btn camera__btn--delete'>delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
