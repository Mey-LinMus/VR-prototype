import React from "react";
// import VRScene from "./VRscene";
import StereoEffectScene from "./StereoEffectScene";
// import WebXR from "./WebXR"
import BackgroundMusic from "./Music";

function App() {
  return (
    <div className="App">
      <BackgroundMusic />
      <StereoEffectScene />
    </div>
  );
}

export default App;
