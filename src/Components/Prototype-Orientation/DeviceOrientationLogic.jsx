import React, { useState, useEffect } from "react";

const DeviceOrientationLogic = () => {
  const [orientationData, setOrientationData] = useState(null);
  const [motionData, setMotionData] = useState(null);

  useEffect(() => {
    const orientationHandler = (event) => {
      const alpha = event.alpha;
      const beta = event.beta;
      const gamma = event.gamma;
      setOrientationData({ alpha, beta, gamma });
    };

    const motionHandler = (event) => {
      const acceleration = event.acceleration;
      const accelerationIncludingGravity = event.accelerationIncludingGravity;
      const rotationRate = event.rotationRate;

      setMotionData({
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
      });
    };

    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", motionHandler);
            }
          })
          .catch(console.error);
      } else {
        alert("DeviceMotionEvent is not defined");
      }
    };

    window.addEventListener("deviceorientation", orientationHandler, true);
    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", orientationHandler);
      window.removeEventListener("devicemotion", motionHandler);
    };
  }, []);

  return (
    <div>
      <h2>Orientation Data</h2>
      {orientationData && (
        <ul>
          <li>Alpha: {orientationData.alpha}</li>
          <li>Beta: {orientationData.beta}</li>
          <li>Gamma: {orientationData.gamma}</li>
        </ul>
      )}
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
    </div>
  );
};

export default DeviceOrientationLogic;
