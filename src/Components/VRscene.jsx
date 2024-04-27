import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const VRScene = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);
    cameraRef.current = camera;

    // Create a cube
    const geometry = new THREE.SphereGeometry(2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Set up stereo effect
    const stereoEffect = new StereoEffect(renderer);
    stereoEffect.setSize(window.innerWidth, window.innerHeight);

    // Add VR controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set camera position
    camera.position.z = 5;

    // Render function
    const animate = () => {
      requestAnimationFrame(animate);

      // Update VR controls
      controls.update();

      // Update camera aspect ratio
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Resize renderer
      renderer.setSize(width, height);

      // Render stereo effect
      stereoEffect.render(scene, camera);
    };

    // Start animation loop
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  // Rendering the scene
  return <div ref={containerRef} />;
};

export default VRScene;
