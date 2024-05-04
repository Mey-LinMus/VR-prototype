import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const SphereScene = ({ orientationData }) => {
  const containerRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const spheres = useRef([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, effect, directionalLight;

    const init = () => {
      const container = containerRef.current;
      // Creating a perspective camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.z = 3200;
      cameraRef.current = camera; // Store camera reference
      // Creating a scene
      scene = new THREE.Scene();
      // Loading a cube texture as background
      // Setting background color to blue
      scene.background = new THREE.Color(0x011c47); // 0x0000ff represents blue color in hexadecimal
      // Creating a directional light
      directionalLight = new THREE.DirectionalLight(0xffffff, 6);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);
      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(1, 5, 0);
      scene.add(pointLight);
      // Creating a sphere geometry
      const geometry = new THREE.SphereGeometry(150);
      // Creating a basic material with red color
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x5391f5),
        roughness: 1,
        metalness: 1,
        opacity: 1,
        emissive: new THREE.Color(0x5391f5),
        fog: true,
      });
      // Creating and adding spheres to the scene
      for (let i = 0; i < 200; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
        scene.add(mesh);
        spheres.current.push(mesh);
      }
      // Creating a WebGL renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight); // Set renderer size to window size
      container.appendChild(renderer.domElement);

      // Creating a stereo effect
      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);

      // Event listeners for resizing window and mouse movement
      window.addEventListener("resize", onWindowResize);
      document.addEventListener("mousemove", onDocumentMouseMove);
    };

    const onWindowResize = () => {
      // Adjusting camera aspect ratio and effect size on window resize
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      effect.setSize(window.innerWidth, window.innerHeight);
    };
    const onDocumentMouseMove = (event) => {
      // Updating mouse position on mouse movement
      mouseX.current = (event.clientX - window.innerWidth / 2) * 10;
      mouseY.current = (event.clientY - window.innerHeight / 2) * 10;
    };

    const animate = () => {
      // Recursive animation function
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      // Rendering function
      const timer = 0.00001 * Date.now();
      // Updating camera position based on mouse movement
      camera.position.x += (mouseX.current - camera.position.x) * 0.05;
      camera.position.y += (-mouseY.current - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      // Moving spheres in a circular pattern
      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }

      if (orientationData) {
        const { alpha, beta, gamma } = orientationData;
        // You need to adjust camera position based on alpha, beta, gamma values
        camera.position.x = alpha;
        camera.position.y = beta;
        camera.position.z = gamma;
      }

      // Rendering scene with stereo effect
      effect.render(scene, camera);
    };
    // Initializing the scene and starting animation
    init();
    animate();
    // Clean up function
    return () => {
      // Removing event listeners and renderer's DOM element on unmount
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [orientationData]); // Empty dependency array ensures useEffect runs only once
  // Returning a div container for the scene
  return (
    <div
      ref={containerRef}
      id="info"
      style={{ overflow: "hidden", width: "100%", height: "100%", margin: 0 }}
    ></div>
  );
};

export default SphereScene;
