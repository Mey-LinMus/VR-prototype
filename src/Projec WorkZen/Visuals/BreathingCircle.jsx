import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import VRButton from "../Utils/VRButton";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const CustomScene = () => {
  const containerRef = useRef(null);
  const [sceneManager, setSceneManager] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    let circle, composer, growing;
    const objects = [];

    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    const init = () => {
      // Create sphere
      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });
      circle = new THREE.Mesh(geometry, material);
      scene.add(circle);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      // Set camera position
      camera.position.z = 20;

      // Load environment map
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

      // Set up post-processing
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.1,
        0.2,
        0.5
      );
      bloomPass.threshold = 0;
      bloomPass.strength = 0.5;
      bloomPass.radius = 0.5;

      composer = new EffectComposer(renderer);
      const renderScene = new RenderPass(scene, camera);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

      // Set up animation
      let scale = 1;
      growing = true;
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
        sceneManager.render();
      };

      animate();
    };

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setSceneManager(sceneManager);

    init();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneManager.effect.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {sceneManager && <VRButton sceneManager={sceneManager} />}
      <div ref={containerRef} />
    </>
  );
};

export default CustomScene;
