import React, { useEffect } from "react";

const DeviceOrientationControls = ({ camera, renderer, scene }) => {
  useEffect(() => {
    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener(
                "deviceorientation",
                handleDeviceOrientation
              );
            }
          })
          .catch(console.error);
      } else {
        alert("DeviceOrientationEvent is not defined");
      }
    };

    const handleDeviceOrientation = (event) => {
      const { alpha, beta, gamma } = event;

      // Example: Rotate the camera based on device orientation
      camera.rotation.x = (beta * Math.PI) / 180; // Convert degrees to radians
      camera.rotation.y = (gamma * Math.PI) / 180;
      camera.rotation.z = (alpha * Math.PI) / 180;

      console.log("x", camera.rotation.x);
      console.log("y", camera.rotation.y);
      console.log("z", camera.rotation.z);
      // Render the updated scene
      renderer.render(scene, camera);

      // You may need to adjust this logic depending on your specific requirements
    };

    const btn = document.getElementById("request");
    btn.addEventListener("click", requestPermission);

    requestPermission();

    return () => {
      // Clean up event listener
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [camera, renderer, scene]); // Dependency array to ensure effect runs only when camera, renderer, or scene changes

  return null; // Since this component doesn't render anything, return null
};

export default DeviceOrientationControls;
