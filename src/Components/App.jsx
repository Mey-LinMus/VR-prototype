import React from "react";
// import VRScene from "./VRscene";
import StereoEffectScene from "./StereoEffectScene";
// import WebXR from "./WebXR"
import BackgroundMusic from "./Music";
import DeviceOrientation from "./DeviceOrientation";

function App() {
  return (
    <div className="App">
      {/* <BackgroundMusic />
      <StereoEffectScene /> */}
      <DeviceOrientation />
    </div>
  );
}

export default App;
