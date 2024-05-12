import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Sky,
  Cloud,
  PresentationControls,
} from "@react-three/drei";

import Particle from "./Particles";

const Background = () => {
  return (
    <Canvas shadows flat dpr={[2, 2]}>
      <Sky
        distance={450000}
        inclination={0}
        azimuth={-180}
        rayleigh={5}
        turbidity={10}
        mieCoefficient={0.01}
        sunPosition={[20, 0, 10]}
      />
      <hemisphereLight args={[0x606060, 0x404040]} />
      <directionalLight position={[1, 1, 1]} />
      {/* <Cloud
      segments={90}
      bounds={[100, 100, 100]}
      volume={4}
      color="#FEF9E7"
      fade={600}
    /> */}
      <Particle />

      <ambientLight intensity={5} />
    </Canvas>
  );
};

export default Background;
