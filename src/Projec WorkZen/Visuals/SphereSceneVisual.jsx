import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../Utils/DeviceOrientationManager";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";

const SphereScene = () => {
  const containerRef = useRef(null);
  const spheres = useRef([]);
  const [sceneManager, setSceneManager] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isStereo, setIsStereo] = useState(false);
  
  useEffect(() => {
    let directionalLight;
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    const init = () => {
      scene.background = new THREE.Color(0x011c47);
      directionalLight = new THREE.DirectionalLight(0xffffff, 6);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(1, 5, 0);
      scene.add(pointLight);

      const geometry = new THREE.SphereGeometry(150);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x5391f5),
        roughness: 1,
        metalness: 1,
        opacity: 1,
        emissive: new THREE.Color(0x5391f5),
        fog: true,
      });

      for (let i = 0; i < 200; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
        scene.add(mesh);
        spheres.current.push(mesh);
      }
    };
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setSceneManager(sceneManager);
    setPermissionGranted(permissionGranted);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneManager.effect.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const timer = 0.00001 * Date.now();

      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }
      sceneManager.render();
    };

    init();
    animate();

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handlePermissionGranted = () => {
    setPermissionGranted(true); // Update permission state
  };

  const toggleVR = () => {
    if (isStereo) {
      sceneManager.disableStereoEffect();
      setPermissionGranted(false); // Disable permission when stereo effect is off
    } else {
      sceneManager.enableStereoEffect();
      sceneManager.requestPermission(); // Request permission when stereo effect is on
    }
    setIsStereo(!isStereo);
  };

  return (
    <>
      <button
        id="vr-toggle"
        onClick={toggleVR}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: "1000",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#eb3434",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        VR
      </button>
      <div ref={containerRef} />

      {scene && camera && renderer && (
        <DeviceOrientationControls
          camera={camera}
          renderer={renderer}
          scene={scene}
          containerRef={containerRef} // Pass containerRef as a prop
          onPermissionGranted={handlePermissionGranted}
        />
      )}
    </>
  );
};

export default SphereScene;
