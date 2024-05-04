import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Cube = () => {
  const scene = useRef();
  const camera = useRef();
  const renderer = useRef();
  const cube = useRef();

  useEffect(() => {
    // Initialize Three.js scene
    scene.current = new THREE.Scene();

    // Initialize camera
    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.current.position.z = 5;

    // Initialize renderer
    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setSize(window.innerWidth, window.innerHeight);

    // Add cube to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube.current = new THREE.Mesh(geometry, material);
    scene.current.add(cube.current);

    // Start rendering loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.current.rotation.x += 0.01;
      cube.current.rotation.y += 0.01;
      renderer.current.render(scene.current, camera.current);
    };
    animate();

    return () => {
      // Cleanup
      renderer.current.dispose();
    };
  }, []);

  return <></>;
};

export default Cube;
