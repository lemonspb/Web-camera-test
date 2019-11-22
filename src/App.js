import React, { useState } from "react";
import camera from "./image/camera.png";
import "./App.css";
import Moment from 'react-moment';
function App() {
  
  const canvasRef = React.createRef();
  const videoRef = React.createRef();
  const [history, setHisory] = useState([]);
  const [videos, setVideos] = useState("");
  const [isOpenCamera, setIsOpenCamera] = useState(false);

  const constraints = {
    video: { width: 400, height: 320 }
  };

  
  const addHistory = () => {
    let date = new Date() 
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videos, 0, 0, 350, 160);
    const img = canvasRef.current.toDataURL("image/png");
    const imageDate = {
      date,
      img
    }
    setHisory([...history,imageDate])
    
  };

  const clearHistory = () => {
    setHisory([]);
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

const deleteItem = (img) =>{
const newImages = history.filter((el) =>  el !== img)
setHisory(newImages)  
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
            onClick={() => (!isOpenCamera ? startVideo() : addHistory())}>
            {!isOpenCamera ? "Open Camera" : "Capture"}
          </button>
          {!isOpenCamera ? (
            <button
              onClick={clearHistory}
              disabled={history.length === 0}
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

      {history.length > 0 && <h3>History</h3>}
      <div className="camera__history">
        {history.map((el) => {
          return (
            <div className="camera__wrap-history" >
              <img src={`${el.img}`} alt="" className="camera__img"  />
              <span>
              <Moment format='lll' >
              {el.date}  
            </Moment>
             </span>
              <button onClick={ () =>deleteItem(el)}  className='camera__btn camera__btn--delete'>Delete</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
