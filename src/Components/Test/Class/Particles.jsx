import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "./ThreeClassSceneManager";
import { Sky } from "three/examples/jsm/objects/Sky.js";

const ParticleScene = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    let sky, sun;

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    sun = new THREE.Vector3();

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
    };

    function updateSky() {
      const uniforms = sky.material.uniforms;
      uniforms["turbidity"].value = effectController.turbidity;
      uniforms["rayleigh"].value = effectController.rayleigh;
      uniforms["mieCoefficient"].value = effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
      const theta = THREE.MathUtils.degToRad(effectController.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      uniforms["sunPosition"].value.copy(sun);

      renderer.render(scene, camera);
    }

    updateSky();

    // Creating raindrop particles
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.random() * 6000 - 3000;
      positions[i + 1] = Math.random() * 6000 - 3000;
      positions[i + 2] = Math.random() * 6000 - 3000;
    }
    const particles = new THREE.BufferGeometry();
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const raindropMaterial = new THREE.PointsMaterial({
      color: 0x55aaff,
      size: 20,
      blending: THREE.AdditiveBlending,
      transparent: 0.5,
    });
    const raindrops = new THREE.Points(particles, raindropMaterial);
    scene.add(raindrops);

    const animate = () => {
      requestAnimationFrame(animate);
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 10;
        if (positions[i + 1] < -3000) {
          positions[i] = Math.random() * 6000 - 3000;
          positions[i + 1] = Math.random() * 6000 + 3000;
          positions[i + 2] = Math.random() * 6000 - 3000;
        }
      }
      particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // Clean up Three.js resources if needed
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ParticleScene;
