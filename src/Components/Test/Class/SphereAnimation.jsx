import React, { useEffect, useRef } from "react";
import ThreeClassSceneManager from "./ThreeClassSceneManager"; // Import the ThreeSceneManager class
import * as THREE from "three"; // Import THREE from Three.js

const StereoEffectScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let manager; // Declare manager variable

    const init = () => {
      let directionalLight;
      manager = new ThreeClassSceneManager(containerRef); // Instantiate ThreeSceneManager
      const scene = manager.getScene(); // Get the scene from ThreeSceneManager

      scene.background = new THREE.Color(0x011c47);
      
      // Create sphere geometry and material
      const geometry = new THREE.SphereGeometry(150);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x5391f5),
        roughness: 1,
        metalness: 1,
        opacity: 1,
        emissive: new THREE.Color(0x5391f5),
        fog: true,
      });

      // Creating a directional light
      directionalLight = new THREE.DirectionalLight(0xffffff, 6);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);
      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(1, 5, 0);
      scene.add(pointLight);

      // Add spheres to the scene
      const spheres = [];
      for (let i = 0; i < 200; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
        scene.add(mesh);
        spheres.push(mesh);
      }

      // Start animation
      animate(spheres);
    };

    const animate = (spheres) => {
      requestAnimationFrame(() => animate(spheres));

      const timer = 0.00001 * Date.now();

      // Update spheres position
      for (let i = 0, il = spheres.length; i < il; i++) {
        const sphere = spheres[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }

      // Render the scene
      manager.getEffect().render(manager.getScene(), manager.getCamera());
    };

    // Initialize the scene
    init();

    // Cleanup function
    return () => {
      // Perform cleanup here if necessary
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="info"
      style={{ overflow: "hidden", width: "100%", height: "100%", margin: 0 }}
    ></div>
  );
};

export default StereoEffectScene;
