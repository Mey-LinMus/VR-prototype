import { useEffect } from "react";

const DeviceOrientationManager = ({
  camera,
  renderer,
  scene,
  containerRef,
  onPermissionGranted,
}) => {
  useEffect(() => {
    if (!containerRef.current) return; // Check if containerRef is null

    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              onPermissionGranted(); // Notify parent component
              window.addEventListener(
                "deviceorientation",
                handleDeviceOrientation
              );
            }
          })
          .catch(console.error);
      } else {
        console.log("DeviceOrientationEvent is not defined");
      }
    };

    const btn = document.getElementById("request");
    if (btn) {
      // Check if button exists before adding event listener
      btn.addEventListener("click", requestPermission);
    }

    requestPermission(); // Call requestPermission initially

    const handleDeviceOrientation = (event) => {
      const { alpha, beta, gamma } = event;

      camera.rotation.x = (beta * Math.PI) / 180; // Convert degrees to radians
      camera.rotation.y = (gamma * Math.PI) / 180;
      camera.rotation.z = (alpha * Math.PI) / 180;

      renderer.render(scene, camera);
    };

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      if (btn) {
        // Check if button exists before removing event listener
        btn.removeEventListener("click", requestPermission);
      }
    };
  }, [camera, renderer, scene, onPermissionGranted]);

  return null;
};

export default DeviceOrientationManager;
