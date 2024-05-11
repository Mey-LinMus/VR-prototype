import React, { useEffect } from "react";
import * as THREE from "three";

const CylinderTunnelAnimation = () => {
  useEffect(() => {
    // Your Three.js logic goes here
    const widthSeg = 1;
    const heightSeg = 1;
    const depthSeg = 1;

    const geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      widthSeg,
      heightSeg,
      depthSeg
    );
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      // vertexShader: vertex,
      // fragmentShader: fragment,
      transparent: true,
      uniforms: {
        size: { value: 2 },
      },
    });
    const pointsMesh = new THREE.Points(geometry, material);

    // Add pointsMesh to your scene or perform any other necessary logic

    // Cleanup function for when the component unmounts
    return () => {
      // Perform any cleanup logic here
      // For example, removing event listeners or disposing Three.js objects
    };
  }, []); // Empty dependency array means this effect will only run once after the initial render

  return <div></div>;
};

export default CylinderTunnelAnimation;
