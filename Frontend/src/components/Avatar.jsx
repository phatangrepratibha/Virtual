import React, { useRef, useState, useEffect } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { useSearchParams } from "react-router-dom";

const FIXED_WIDTH = 500; // Fixed canvas width
const FIXED_HEIGHT = 700; // Fixed canvas height

const Avatar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [searchParams] = useSearchParams();
  const clothingImage = searchParams.get("clothingImage");

  // Load Pose Detection Model Once
  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl");
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );
      console.log("Pose detection model loaded.");
    };
    loadModel();
  }, []);

  // Access Camera
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          console.log("Camera stream loaded.");
        };
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Camera access denied. Please allow camera access to use this feature.");
      }
    };
    setupCamera();
  }, []);

  // Apply Virtual Try-On
  useEffect(() => {
    if (!detectorRef.current || !clothingImage) return;

    const applyVirtualTryOn = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size to match video stream
      canvas.width = FIXED_WIDTH;
      canvas.height = FIXED_HEIGHT;

      // Draw video frame on canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, FIXED_WIDTH, FIXED_HEIGHT);

      // Detect pose
      const poses = await detectorRef.current.estimatePoses(video);
      console.log("Detected poses:", poses);

      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        console.log("Keypoints:", keypoints);

        const leftShoulder = keypoints.find((p) => p.name === "left_shoulder");
        const rightShoulder = keypoints.find((p) => p.name === "right_shoulder");
        const leftHip = keypoints.find((p) => p.name === "left_hip");
        const rightHip = keypoints.find((p) => p.name === "right_hip");

        if (leftShoulder && rightShoulder && leftHip && rightHip) {
          // Calculate clothing placement
          const shoulderWidth = Math.abs(
            rightShoulder.x - leftShoulder.x
          );
          const torsoHeight = Math.abs(
            (leftHip.y + rightHip.y) / 2 -
              (leftShoulder.y + rightShoulder.y) / 2
          );
          const clothingWidth = shoulderWidth * 1.5; // Adjusted scaling factor
          const midX = (leftShoulder.x + rightShoulder.x) / 2;
          const x = midX - clothingWidth / 2;
          const y =
            (leftShoulder.y + rightShoulder.y) / 2 - torsoHeight * 0.2; // Adjusted y offset

          // Draw the clothing image
          const clothingImg = new Image();
          clothingImg.src = clothingImage;
          clothingImg.onload = () => {
            console.log("Clothing image loaded:", clothingImg);
            const aspectRatio = clothingImg.width / clothingImg.height;
            const scaledHeight = clothingWidth / aspectRatio; // Maintain aspect ratio
            ctx.globalAlpha = 0.9;
            ctx.drawImage(clothingImg, x, y, clothingWidth, scaledHeight);
          };
          clothingImg.onerror = (error) => {
            console.error("Error loading clothing image:", error);
          };
        }
      }
      requestAnimationFrame(applyVirtualTryOn); // Continuously update the canvas
    };

    applyVirtualTryOn();
  }, [clothingImage]);

  return (
    <div style={{ textAlign: "center" }}>
      {isLoading && <p>Loading Camera...</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ maxWidth: "100%" }} // Make video visible for debugging
      />
      <canvas
        ref={canvasRef}
        style={{ marginTop: "10px", maxWidth: "50%" }}
      />
    </div>
  );
};

export default Avatar;