import React, { useState } from "react";

const VRButton = ({ sceneManager }) => {
  const [isStereo, setIsStereo] = useState(false);

  const toggleVR = () => {
    if (!isStereo) {
      sceneManager.enableStereoEffect();
      setIsStereo(true);
    } else {
      sceneManager.disableStereoEffect();
      setIsStereo(false);
    }
    sceneManager.requestPermission();
  };

  return (
    <button
      id="vr-toggle"
      onClick={toggleVR}
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: "1000",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: isStereo ? "#30d65c" : "#eb3434",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {isStereo ? "VR On" : "VR Off"}
    </button>
  );
};

export default VRButton;
