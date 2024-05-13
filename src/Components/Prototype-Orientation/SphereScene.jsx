import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const SphereScene = ({ orientationData }) => {
  const containerRef = useRef(null);
  const spheres = useRef([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, effect, directionalLight;

    const init = () => {
      const container = containerRef.current;
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );

      cameraRef.current = camera;

      // set the camera's position in the scene
      camera.position.set(0, 0, 0);

      scene = new THREE.Scene();

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

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);
      window.addEventListener("resize", onWindowResize);

      // Call handleDeviceOrientation function when deviceorientation event is fired
      window.addEventListener("deviceorientation", (event) => {
        console.log("Device orientation event fired:", event);
      });
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      render();
    };

    const render = () => {
      const timer = 0.00001 * Date.now();
      cameraRef.current.lookAt(scene.position);
      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }
      effect.render(scene, cameraRef.current);
    };

    // Function to handle device orientation
    const handleDeviceOrientation = (event) => {
      event.preventDefault();

      // Calculate rotation based on device orientation
      const beta = event.beta || 0; // rotation around x-axis (in degrees)
      const gamma = event.gamma || 0; // rotation around y-axis (in degrees)
      console.log("Beta", beta, "Gamma", gamma);

      // Adjusting beta and gamma to fit the right-handed coordinate system
      const adjustedBeta = -beta; // Inverting beta to match the right-handed system
      const adjustedGamma = -gamma; // Inverting gamma to match the right-handed system

      // // Set camera rotation based on adjusted device orientation
      cameraRef.current.rotation.x = THREE.MathUtils.degToRad(adjustedBeta);
      cameraRef.current.rotation.y = THREE.MathUtils.degToRad(adjustedGamma);

      cameraRef.current.rotation.set(beta, gamma);

      console.log("Camera x:", cameraRef.current.rotation.x);
      console.log("Camera y:", cameraRef.current.rotation.y);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener(
        "deviceorientation",
        handleDeviceOrientation,
        true
      );
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [orientationData]);

  return (
    <div>
      <div
        ref={containerRef}
        id="info"
        style={{ overflow: "hidden", width: "100%", height: "100%", margin: 0 }}
      ></div>
    </div>
  );
};

export default SphereScene;
