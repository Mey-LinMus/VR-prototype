import React, { useEffect, useRef } from "react";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import * as THREE from "three";

const BreathingCircle = () => {
  const containerRef = useRef(null);
  let sceneManager;

  useEffect(() => {
    const init = () => {
      sceneManager = new ThreeClassSceneManager(containerRef, THREE);

      const geometry = new THREE.CircleGeometry(5, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x87ceeb });
      const circle = new THREE.Mesh(geometry, material);
      sceneManager.getScene().add(circle);

      const ambientLight = new THREE.AmbientLight(0x404040);
      sceneManager.getScene().add(ambientLight);

      sceneManager.getCamera().position.z = 20;

      let scale = 1;
      let growing = true;
      const breathingSpeed = 0.005;

      const animate = () => {
        requestAnimationFrame(animate);

        if (growing) {
          scale += breathingSpeed;
          if (scale >= 2) growing = false;
        } else {
          scale -= breathingSpeed;
          if (scale <= 1) growing = true;
        }
        circle.scale.set(scale, scale, scale);

        sceneManager.render();
      };

      animate();
    };

    init();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(sceneManager.getRenderer().domElement);
      }
    };
  }, []);

  return (
    <div className="App">
      <div ref={containerRef} />
    </div>
  );
};

export default BreathingCircle;
