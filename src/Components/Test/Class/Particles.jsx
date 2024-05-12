import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "./ThreeClassSceneManager";

const ParticleScene = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();
    // Loading a cube texture as background
    // Creating raindrop particles
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3); // Each particle has 3 coordinates (x, y, z)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.random() * 6000 - 3000; // x
      positions[i + 1] = Math.random() * 6000 - 3000; // y
      positions[i + 2] = Math.random() * 6000 - 3000; // z
    }
    const particles = new THREE.BufferGeometry();
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const raindropMaterial = new THREE.PointsMaterial({
      color: 0x55aaff, // Blue color
      size: 20, // Adjust the size of raindrops0000
      blending: THREE.AdditiveBlending,
      //https://www.kenney.nl/assets/particle-pack
      transparent: true,
    });
    const raindrops = new THREE.Points(particles, raindropMaterial);
    scene.add(raindrops);
    const animate = () => {
      requestAnimationFrame(animate);
      // Move raindrops downwards along the y-axis
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 10; // Adjust the speed of raindrops falling
        // Reset raindrops position when they go below a certain y-coordinate
        if (positions[i + 1] < -3000) {
          positions[i] = Math.random() * 6000 - 3000; // x
          positions[i + 1] = Math.random() * 6000 + 3000; // y
          positions[i + 2] = Math.random() * 6000 - 3000; // z
        }
      }
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      // Render the scene
      if (sceneManager.getEffect()) {
        sceneManager.getEffect().render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();
    // Clean up
    return () => {
      // Clean up Three.js resources if needed
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ParticleScene;
