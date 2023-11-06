import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Webcam from "react-webcam";

import { Box, Typography } from "@mui/material";
import { sessionImage } from "src/calls/respondent";

import { SessionImageProps } from "./SessionImage.types";

// Video constraints for the webcam
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

// Image constraints for the webcam
const imageConstraints = {
  width: 426,
  height: 240,
};

const SessionImage: React.FC<SessionImageProps> = (props) => {
  // Refs
  const timeoutRef = useRef<number>();
  const webcamRef = useRef<Webcam>(null);
  // Webcam states
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(true);

  useEffect(() => {
    if (props.is_proctoring_enabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          setVideoAvailable(true);
          setLoadingVideo(false);
          const runAndWait = () => {
            const delaySecs = (Math.floor(Math.random() * 10) % 10) + 5;
            const imageSrc =
              webcamRef?.current?.getScreenshot(imageConstraints);
            sessionImage(props.inviteID, imageSrc ?? "");
            timeoutRef.current = setTimeout(runAndWait, delaySecs * 1000);
          };
          runAndWait();
        })
        .catch(() => {
          toast.error("Please provide required permissions");
        });
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  return (
    <>
      {props.is_proctoring_enabled && (
        <Box
          height={150}
          width={150}
          position="absolute"
          right={10}
          bottom={10}
          zIndex={999}
          className="session-image"
        >
          {videoAvailable ? (
            <Webcam
              audio={false}
              videoConstraints={videoConstraints}
              screenshotFormat="image/jpeg"
              height={"100%"}
              width={"100%"}
              ref={webcamRef}
            />
          ) : (
            <Box
              sx={{
                border: (t) => `thin solid ${t.palette.grey[400]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 5,
                textAlign: "center",
              }}
            >
              <Typography>
                {loadingVideo ? "Loading video" : "Video not available"}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default SessionImage;
