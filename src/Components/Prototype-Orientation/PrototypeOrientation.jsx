import React, { useState } from "react";
import SphereScene from "./SphereScene";
import DeviceOrientationLogic from "./DeviceOrientationLogic";

const PrototypeOrientation = () => {
  const [orientationData, setOrientationData] = useState(null);

  return (
    <div>
      <h1>Device Orientation & Motion Demo 🤓</h1>
      <DeviceOrientationLogic orientationData={setOrientationData} />
      <SphereScene setOrientationData={orientationData} />
    </div>
  );
};

export default PrototypeOrientation;
