import Webcam from "react-webcam";
import { useEffect, useState, useRef, useCallback } from "react";

const WebcamStreamCapture = () => {
    
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);

    
    const handleStartCaptureClick = useCallback(() => {
        setRecordedChunks([])
        setCapturing(true)

        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
          });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);


    const handleDataAvailable = useCallback(({data}) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
    }, [setRecordedChunks]);


    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef,setCapturing]);


    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
          const blob = new Blob(recordedChunks, {
            type: "video/webm"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = url;
          a.download = "react-webcam-stream-capture.webm";
          a.click();
          window.URL.revokeObjectURL(url);
          setRecordedChunks([]);
        }
    }, [recordedChunks]);


    return (
        <div className="Container">
            <Webcam audio={false} ref={webcamRef} />
            {capturing ? (
                <button onClick={handleStopCaptureClick}>Stop Capture</button>
            ) : (
                <button onClick={handleStartCaptureClick}>Start Capture</button>
            )}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>Download</button>
            )}
            
            <>
                <p>Number of Chunks: {recordedChunks.length}</p>
            </>
        </div>       
    );
};

export default WebcamStreamCapture;