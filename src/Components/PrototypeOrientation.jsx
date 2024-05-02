import React, { useEffect } from "react";

function PrototypeOrientation() {
  useEffect(() => {
    function handleDeviceOrientation(event) {
      const alpha = event.alpha; // rotation around the z-axis
      const beta = event.beta; // rotation around the x-axis
      const gamma = event.gamma; // rotation around the y-axis

      // Use the orientation data as needed
      console.log("Orientation Data:", { alpha, beta, gamma });
    }

    function handleDeviceMotion(event) {
      const acceleration = event.acceleration; // Acceleration data
      const accelerationIncludingGravity = event.accelerationIncludingGravity; // Acceleration data including gravity
      const rotationRate = event.rotationRate; // Device rotation rate

      // Use the motion data as needed
      console.log("Motion Data:", {
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
      });
    }

    window.addEventListener("deviceorientation", handleDeviceOrientation, true);
    window.addEventListener("devicemotion", handleDeviceMotion, true);

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleDeviceOrientation,
        true
      );
      window.removeEventListener("devicemotion", handleDeviceMotion, true);
    };
  }, []);

  return (
    <div>
      <h1>Device Orientation & Motion Demo</h1>
      <p>Check the console for data.</p>
    </div>
  );
}

export default PrototypeOrientation;
