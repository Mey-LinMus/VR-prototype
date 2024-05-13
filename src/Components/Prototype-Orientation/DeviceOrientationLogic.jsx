import React, { useState, useEffect } from "react";
import SphereScene from "./SnowingScene";

const DeviceOrientationLogics = () => {
  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);

  useEffect(() => {
    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", (e) => {
                // Handle 'e' here (e.g., update UI based on motion data)
              });
            }
          })
          .catch(console.error);
      } else {
        alert("DeviceMotionEvent is not defined");
      }
    };
    const btn = document.getElementById("request");
    btn.addEventListener("click", requestPermission);

    const handleDeviceOrientation = (event) => {
      event.preventDefault();
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
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, []);

  return (
    <div>
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
              Acceleration Including Gravity:
              {JSON.stringify(motionData.accelerationIncludingGravity)}
            </li>
            <li>Rotation Rate: {JSON.stringify(motionData.rotationRate)}</li>
          </ul>
        )}
        <button id="request">Request Permission</button>
        <SphereScene orientationData={orientationData} />
      </div>
    </div>
  );
};

export default DeviceOrientationLogics;
