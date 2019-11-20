import React, { useState } from "react";
import camera from "./image/camera.png";
import "./App.css";

function App() {
  const canvasRef = React.createRef();
  const videoRef = React.createRef();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [isOpenCamera, setIsOpenCamera] = useState(false);

  let video = null;
  let canvas = null;
  let i = 1;
  const constraints = {
    video: { width: 400, height: 320 }
  };

  
  const  addImage = () => {
    canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videos, 0, 0, 200, 150);
    const data = canvas.toDataURL("image/png");
    setImages([...images, data]);
  }

  const clearImage = () => {
    setImages([]);
  };
    console.log(videoRef)

  const startVideo = () => {
    
    setIsOpenCamera(true);
    setShowImage(false);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        video = document.querySelector("video");
        if ("srcObject" in video) {
          video.srcObject = stream;
          setVideos(video);
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
    const stream = videos.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => {
      track.stop();
    });
    videos.srcObject = null;
    setShowImage(true);
    setIsOpenCamera(false);
  };

  return (
    <div className="camera">
      <canvas className="camera__canvas" ref={canvasRef}></canvas>
      <div className="camera__content">
        {showImage ? 
          <img src={camera} className="camera__image" alt="" />: 
          <video src="" className="camera__video" ></video>
      }
        <div className="camera__btn-block">
          <button
            className=" camera__btn camera__btn--screen"
            onClick={() => (!isOpenCamera ? startVideo() : addImage())}>
            {!isOpenCamera ? "Open Camera" : "Capture"}
          </button>
          {!isOpenCamera ? (
            images.length === 0 ? (
              <button
                onClick={clearImage}
                disabled
                className="camera__btn camera__btn--clear">
                Clear Story
              </button>
            ) : (
              <button
                onClick={clearImage}
                className="camera__btn camera__btn--clear">
                Clear Story
              </button>
            )
          ) : (
            <button
              className=" camera__btn camera__btn--back"
              onClick={endVideo}>
              Back
            </button>
          )}
        </div>
      </div>

      {images.length === 0 ? "" : <h3>History</h3>}
      <div className="camera__history">
        {images.map(el => {
          return (
            <div className="camera__wrap-img" key={i++}>
              <img src={`${el}`} alt="" className="camera__img" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
