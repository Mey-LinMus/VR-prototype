import React, { useEffect, useRef, useState } from "react";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import VRButton from "../Utils/VRButton";

const BreathingCircle = () => {
  const containerRef = useRef(null);
  let sceneManager;
  let composer;

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

      const renderScene = new RenderPass(
        sceneManager.getScene(),
        sceneManager.getCamera()
      );

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.1,
        0.2,
        0.5
      );
      bloomPass.threshold = 0;
      bloomPass.strength = 0.5;
      bloomPass.radius = 0.5;

      composer = new EffectComposer(sceneManager.getRenderer());
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

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

        composer.render();
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
    <div>
      <div ref={containerRef} />
      <VRButton sceneManager={sceneManager} />
    </div>
  );
};

export default BreathingCircle;
