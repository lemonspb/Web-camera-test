import React, { useState } from "react";
import FullScreen from "./Full-screen";
import camera from "./image/camera.png";
import "./App.css";
import Moment from "react-moment";

function App() {
  const canvasRef = React.createRef();
  const videoRef = React.createRef();
  const [history, setHisory] = useState([]);
  const [fullPicture, setFullPicture] = useState("");
  const [videos, setVideos] = useState("");
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [captureDisabled, setCaptureDisabled] = useState(false);
  const constraints = {
    video: { width: 400, height: 320 }
  };
  const addHistory = () => {
    let date = new Date();
    let canvas = document.querySelector('canvas')
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videos, 0, 0, 350, 160);
    const img = canvas.toDataURL("image/png");
    const imageDate = {
      date,
      img
    };
    setHisory([...history, imageDate]);
  };

  const autoScreen = () =>{
    setCaptureDisabled(true)
    setTimeout(() => { 
      addHistory()
      setCaptureDisabled(false)

    }, 3000);
  }

  const clearHistory = () => setHisory([]);

  const startVideo = () => {
    setIsOpenCamera(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
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

  const deleteItem = item => setHisory(history.filter(el => el !== item));

  const openPicture = picture => setFullPicture(picture);
  const closePicture = () => setFullPicture("");

  const nextFullScreenPicture = () => {
    history.find((el, index, array) => {
       
       if (el.img === fullPicture  ) {
         if(index >= array.length-1 ){
          setFullPicture(array[0].img)   
         }
         else{      
        setFullPicture(array[++index].img);
         }
      }
      
    });
  };
  const prevFullScreenPicture = () => {
    history.find((el, index, array) => {
       
      if (el.img === fullPicture  ) {
        if(index <= 0 ){
         setFullPicture(array[array.length - 1].img)   
        }
        else{      
       setFullPicture(array[--index].img);
        }
     }
     
   });
  };

  return (
    <>
      <div className="camera">
        <canvas className="camera__canvas" ref={canvasRef}></canvas>
        <div className="camera__content">
          {!isOpenCamera ? (
            <img src={camera} className="camera__image" alt="" />
          ) : (
            <video src="" className="camera__video" ref={videoRef}></video>
          )}
          <div className="camera__btn-block">
          {isOpenCamera?<button
              className=" camera__btn camera__btn--screen"
              onClick={()=>autoScreen()}>
              autoscreen
              </button>:null}
            <button
              className=" camera__btn camera__btn--screen"
              disabled = {captureDisabled}
              onClick={() => (!isOpenCamera ? startVideo() : addHistory(canvasRef.current))}
            >
              {!isOpenCamera ? "Open Camera" : "Capture"}
            </button>
            {!isOpenCamera ? (
              <button
                onClick={clearHistory}
                disabled={history.length === 0}
                className="camera__btn camera__btn--clear"
              >
                Clear Story
              </button>
            ) : (
              <button
                className=" camera__btn camera__btn--back"
                onClick={endVideo}
              >
                Back
              </button>
            )}
          </div>
        </div>

        {history.length > 0 && <h3>History</h3>}
        <div className="camera__history">
          {history.map((el, i) => {
            return (
              <div className="camera__wrap-history" key={i++}>
                <img
                  src={`${el.img}`}
                  alt=""
                  className="camera__img"
                  onClick={() => {
                    openPicture(el.img);
                  }}
                />
                <span>
                  <Moment format="lll">{el.date}</Moment>
                </span>
                <button
                  onClick={() => deleteItem(el)}
                  className="camera__btn camera__btn--delete"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <FullScreen
        picture={fullPicture}
        closePicture={closePicture}
        next={nextFullScreenPicture}
        prev={prevFullScreenPicture}
      />
    </>
  );
}

export default App;
