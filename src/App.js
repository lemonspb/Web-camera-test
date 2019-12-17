import React, { useState, useEffect,useRef } from "react";
import FullScreen from "./Full-screen";
import camera from "./image/camera.png";
import soundClick from "./sound/click.mp3";
import "./App.css";
import Moment from "react-moment";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const timerToClearSomewhere = useRef(false)
  const [history, setHisory] = useState([]);
  const [fullPictureIndex, setFullPictureIndex] = useState(undefined);
  const [videos, setVideos] = useState("");
  const [timerCount, setTimerCount] = useState(3)
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [captureDisabled, setCaptureDisabled] = useState(false);
  const constraints = {
    video: { width: 400, height: 320 }
  };


  const makeSoundClick = () => {
    let sound = new Audio();
    sound.src = soundClick;
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          console.log("audio played auto");
        })
        .catch(error => {
          console.log("playback prevented");
        });
    }
  };

  const addHistory = () => {
    makeSoundClick();
    let date = new Date();
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videos, 0, 0, canvas.width, canvas.height);
    const img = canvas.toDataURL("image/png");
    const imageDate = {
      date,
      img
    };
    setHisory([...history, imageDate]);
  };

  const autoScreen = () => {
    setCaptureDisabled(true);
    setTimeout(() => {
      addHistory();
      setCaptureDisabled(false);
    }, 3000);
  };
  

 
  const clearHistory = () => setHisory([]);
  const startVideo = () => {
    setIsOpenCamera(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        let video = videoRef.current;
        

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

  const openPicture = index => setFullPictureIndex(index);
  const closePicture = () => setFullPictureIndex(undefined);

  const nextFullScreenPicture = () => {
    const next = fullPictureIndex + 1;
    setFullPictureIndex(next < history.length ? next : 0);
  };
  const prevFullScreenPicture = () => {
    const prev = fullPictureIndex - 1;
    setFullPictureIndex(prev >= 0 ? prev : history.length - 1);
  };

  useEffect(() => {
   
    window.addEventListener("keyup", e => {
      if (e.key === "Escape") {
        closePicture();
      }
    });
  }, []);
  useEffect(
    () => {
      timerToClearSomewhere.current = setInterval(() => setTimerCount(timerCount-1), 1000)

      return () => {
        clearInterval(timerToClearSomewhere.current)
      }
    },
    [timerCount]
  )
  useEffect(() => {
    setTimeout(() => clearInterval(timerToClearSomewhere.current), 5000)

   
  }, []);
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
            {isOpenCamera ? (
              <button
                className=" camera__btn camera__btn--screen"
                onClick={() => autoScreen()}
              >
               {captureDisabled?timerCount: 'autoscreen'}
              </button>
            ) : null}
            <button
              className=" camera__btn camera__btn--screen"
              disabled={captureDisabled}
              onClick={() =>
                !isOpenCamera ? startVideo() : addHistory(canvasRef.current)
              }
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
              <div className="camera__wrap-history" key={i}>
                <img
                  src={`${el.img}`}
                  alt=""
                  className="camera__img"
                  onClick={() => {
                    openPicture(i);
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
        picture={fullPictureIndex != null && history[fullPictureIndex].img}
        closePicture={closePicture}
        next={nextFullScreenPicture}
        prev={prevFullScreenPicture}
        history={history}
      />
    </>
  );
}

export default App;
