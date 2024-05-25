import React, { useEffect, useState } from "react";
import VRButton from "./VRButton"; 

const DeviceOrientationManager = ({
  camera,
  renderer,
  scene,
  containerRef,
  onPermissionGranted,
}) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isStereo, setIsStereo] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return; // Check if containerRef is null

    const handleDeviceOrientation = (event) => {
      const { alpha, beta, gamma } = event;

      camera.rotation.x = (beta * Math.PI) / 180; // Convert degrees to radians
      camera.rotation.y = (gamma * Math.PI) / 180;
      camera.rotation.z = (alpha * Math.PI) / 180;

      renderer.render(scene, camera);
    };

    if (permissionGranted) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [camera, renderer, scene, permissionGranted]);

  const handlePermissionGranted = () => {
    setPermissionGranted(true); // Update permission state
  };

  const toggleVR = (value) => {
    setIsStereo(value);
    if (!value) {
      setPermissionGranted(false); // Disable permission when stereo effect is off
    } else {
      onPermissionGranted(); // Request permission when stereo effect is on
    }
  };

  return (
    <>
      <VRButton onToggle={toggleVR} />
    </>
  );
};

export default DeviceOrientationManager;
