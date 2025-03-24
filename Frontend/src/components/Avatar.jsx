import React, { useRef, useEffect, useState, useCallback } from "react";
import * as pose from "@mediapipe/pose";
import "@tensorflow/tfjs-backend-webgl";
import { useLocation } from "react-router-dom"; // Import useLocation

const Avatar = () => {
    const location = useLocation(); // Get navigation state
  const clothingImage = location.state?.clothingImage || ""; // Retrieve clothing image from state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const [isPoseLoaded, setIsPoseLoaded] = useState(false);
  const clothingImgRef = useRef(new Image());

  // Load clothing image
  useEffect(() => {
    if (clothingImage) {
      clothingImgRef.current.src = clothingImage;
      clothingImgRef.current.onload = () => console.log("Clothing image loaded!");
    }
  }, [clothingImage]);

  // Function to overlay clothing
  const applyClothingOverlay = useCallback((ctx, landmarks) => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    if (!clothingImgRef.current.complete) {
      console.warn("Clothing image not yet loaded.");
      return;
    }

    // Get key pose points
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      console.warn("Essential landmarks not detected.");
      return;
    }

    // Calculate clothing dimensions
    const clothingWidth =
      Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width * 2.1;
    const torsoHeight = Math.abs(leftHip.y - leftShoulder.y) * canvas.height;
    const clothingHeight = torsoHeight * 1.3;
    const x =
      ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width - clothingWidth / 2;
    const y = leftShoulder.y * canvas.height - clothingHeight * 0.2;

    ctx.drawImage(clothingImgRef.current, x, y, clothingWidth, clothingHeight);
  }, []);

  // Draw detected pose and apply clothing overlay
  const drawResults = useCallback(
    (results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      if (!results.poseLandmarks || !ctx) {
        console.warn("No pose landmarks detected.");
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Draw pose landmarks
      results.poseLandmarks.forEach((landmark) => {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "red";
        ctx.fill();
      });

      applyClothingOverlay(ctx, results.poseLandmarks);
    },
    [applyClothingOverlay] // ✅ Included applyClothingOverlay as a dependency
  );

  // Pose detection loop
  const detectPose = useCallback(async () => {
    if (!poseRef.current || !videoRef.current) return;
    await poseRef.current.send({ image: videoRef.current });
    requestAnimationFrame(detectPose);
  }, []);

  // Initialize and start pose detection
  const startPoseDetection = useCallback(async () => {
    if (!videoRef.current) return;

    console.log("Initializing pose detection...");

    const poseModel = new pose.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseModel.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseModel.onResults(drawResults);
    poseRef.current = poseModel;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        detectPose();
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }

    setIsPoseLoaded(true);
  }, [drawResults, detectPose]); // ✅ Included drawResults & detectPose

  // Start pose detection on mount
  useEffect(() => {
    startPoseDetection();
  }, [startPoseDetection]);

  return (
    <div>
      {!isPoseLoaded && <p>Loading Pose Model...</p>}
      <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default Avatar;