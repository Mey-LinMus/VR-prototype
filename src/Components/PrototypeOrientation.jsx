import React, { useState, useEffect } from "react";


const DeviceOrientationMotionComponent = () => {
  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);

  useEffect(() => {
    const requestPermission = () => {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              console.log("Permission for device motion events granted");
            } else {
              console.log("Permission for device motion events denied");
            }
          })
          .catch(console.error);
      }

      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === "granted") {
              console.log("Permission for device orientation events granted");
            } else {
              console.log("Permission for device orientation events denied");
            }
          })
          .catch(console.error);
      }
    };

    const handleDeviceOrientation = (event) => {
      const alpha = event.alpha; // rotation around the z-axis
      const beta = event.beta; // rotation around the x-axis
      const gamma = event.gamma; // rotation around the y-axis
      setOrientationData({ alpha, beta, gamma });

      // Use the orientation data as needed
    };

    const handleDeviceMotion = (event) => {
      const acceleration = event.acceleration; // Acceleration data
      const accelerationIncludingGravity = event.accelerationIncludingGravity; // Acceleration data including gravity
      const rotationRate = event.rotationRate; // Device rotation rate

      // Use the motion data as needed
      setMotionData({
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
      });
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation, true);
    window.addEventListener("devicemotion", handleDeviceMotion, true);

    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, []);

  return (
    <div>
      <h1>Device Orientation & Motion Demo 🤓</h1>
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
};

export default DeviceOrientationMotionComponent;
