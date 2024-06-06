import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import VRButton from "../Utils/VRButton";

const BreathingCircle = () => {
  const containerRef = useRef(null);
  const [sceneManager, setSceneManager] = useState(null);

  useEffect(() => {
    const init = () => {
      const manager = new ThreeClassSceneManager(containerRef, THREE);
      const scene = manager.getScene();
      const camera = manager.getCamera();
      const renderer = manager.getRenderer();

      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });
      const circle = new THREE.Mesh(geometry, material);
      scene.add(circle);

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      camera.position.z = 20;

      const loader = new THREE.CubeTextureLoader();
      const envMap = loader.load([
        "/envMap/posx.jpg",
        "/envMap/negx.jpg",
        "/envMap/posy.jpg",
        "/envMap/negy.jpg",
        "/envMap/posz.jpg",
        "/envMap/negz.jpg",
      ]);

      scene.background = envMap;

      const renderScene = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.1,
        0.2,
        0.5
      );
      bloomPass.threshold = 0;
      bloomPass.strength = 0.5;
      bloomPass.radius = 0.5;

      const composer = new EffectComposer(renderer);
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
        manager.render();
      };

      animate();
      setSceneManager(manager);
    };

    init();

    return () => {
      if (sceneManager) {
        sceneManager.dispose();
      }
    };
  }, []);

  return (
    <>
      {sceneManager && <VRButton sceneManager={sceneManager} />}
      <div ref={containerRef} />
    </>
  );
};

export default BreathingCircle;
