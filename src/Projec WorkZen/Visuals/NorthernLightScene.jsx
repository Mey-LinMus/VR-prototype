import React, { useRef, useEffect } from "react";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import * as THREE from "three";

const NorthernLightsScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);

    // Initialize the scene, camera, and renderer as usual
    // Create a custom geometry and material for the northern lights
    // Create a mesh using the geometry and material
    // Add the mesh to the scene
    // Implement an animation loop

    const geometry = new THREE.SphereGeometry(1000, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("path/to/northern-lights-texture.jpg", (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      sceneManager.getScene().add(mesh);

      const animate = () => {
        requestAnimationFrame(animate);

        // Animate the northern lights by rotating the mesh
        mesh.rotation.y += 0.001;
        mesh.rotation.x += 0.001;

        sceneManager.render();
      };

      animate();
    });

    return () => {
      // Do nothing
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default NorthernLightsScene;
