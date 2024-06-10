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

    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    const init = () => {
      const geometry = new THREE.SphereGeometry(5, 32, 32);

      const material = new THREE.MeshStandardMaterial({
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 0.9,
        roughness: 0.5,
        color: 0xffffff,
        normalScale: new THREE.Vector2(0.15, 0.15),
        transparent: true, // Enable transparency
        opacity: 0.75, // Set opacity value (0.0 to 1.0)
      });

      circle = new THREE.Mesh(geometry, material);
      scene.add(circle);

      const ambientLight = new THREE.AmbientLight(0xcccccc);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

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

      scene.fog = new THREE.Fog(0xdddddd, 5, 25);

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
