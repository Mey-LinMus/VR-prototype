import React, { useState, useEffect } from "react";

function DeviceOrientationComponent() {
  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);

  useEffect(() => {
    // Request permission for device motion
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("devicemotion", handleDeviceMotion, true);
          }
        })
        .catch(console.error);
    } else {
      // Fallback for non iOS 13+ devices
      window.addEventListener("devicemotion", handleDeviceMotion, true);
    }

    // Request permission for device orientation
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleDeviceOrientation,
              true
            );
          }
        })
        .catch(console.error);
    } else {
      // Fallback for non iOS 13+ devices
      window.addEventListener(
        "deviceorientation",
        handleDeviceOrientation,
        true
      );
    }

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion, true);
      window.removeEventListener(
        "deviceorientation",
        handleDeviceOrientation,
        true
      );
    };
  }, []);

  function handleDeviceOrientation(event) {
    const alpha = event.alpha; // rotation around the z-axis
    const beta = event.beta; // rotation around the x-axis
    const gamma = event.gamma; // rotation around the y-axis

    // Use the orientation data as needed
    setOrientationData({ alpha, beta, gamma });
  }

  function handleDeviceMotion(event) {
    const acceleration = event.acceleration; // Acceleration data
    const accelerationIncludingGravity = event.accelerationIncludingGravity; // Acceleration data including gravity
    const rotationRate = event.rotationRate; // Device rotation rate

    // Use the motion data as needed
    setMotionData({ acceleration, accelerationIncludingGravity, rotationRate });
  }

  return (
    <div>
      <h1>Device Orientation & Motion Demo</h1>
      <div>
        <h2>Orientation Data</h2>
        {orientationData && (
          <ul>
            <li>Alpha: {orientationData.alpha}</li>
            <li>Beta: {orientationData.beta}</li>
            <li>Gamma: {orientationData.gamma}</li>
          </ul>
        )}
      </div>
      <div>
        <h2>Motion Data</h2>
        {motionData && (
          <ul>
            <li>Acceleration: {JSON.stringify(motionData.acceleration)}</li>
            <li>
              Acceleration Including Gravity:{" "}
              {JSON.stringify(motionData.accelerationIncludingGravity)}
            </li>
            <li>Rotation Rate: {JSON.stringify(motionData.rotationRate)}</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default DeviceOrientationComponent;
