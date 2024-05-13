import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "./ThreeClassSceneManager";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import snowdropTextureImg from "./Texture/snowflake1.png";
import DeviceOrientationControls from "./DeviceOrientationLogic";

const SnowingScene = () => {
  const containerRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();
    const effect = sceneManager.getEffect();
    let sky, sun;

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    sun = new THREE.Vector3();
    const effectController = {
      turbidity: 0,
      rayleigh: 0.165,
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
    }

    updateSky();

    // Creating snowdrop particles
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.random() * 6000 - 3000;
      positions[i + 1] = Math.random() * 6000 - 3000;
      positions[i + 2] = Math.random() * 6000 - 3000;
    }
    const particles = new THREE.BufferGeometry();
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Load snowdrop texture
    const textureLoader = new THREE.TextureLoader();
    const snowdropTexture = textureLoader.load(snowdropTextureImg); // Use imported variable here
    const snowdropMaterial = new THREE.PointsMaterial({
      map: snowdropTexture, // Apply the texture to the points
      color: 0xfffafa,
      size: 60,
      blending: THREE.AdditiveBlending,
      transparent: 0.05,
    });
    const snowflakes = new THREE.Points(particles, snowdropMaterial);
    scene.add(snowflakes);

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);

    const animate = () => {
      requestAnimationFrame(animate);
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 5;
        if (positions[i + 1] < -3000) {
          positions[i] = Math.random() * 7000 - 3000;
          positions[i + 1] = Math.random() * 7000 + 3000;
          positions[i + 2] = Math.random() * 7000 - 3000;
        }
      }
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      effect.render(scene, camera);
    };

    animate();

    return () => {
      // Clean up Three.js resources if needed
    };
  }, []);

  useEffect(() => {
    const disableScroll = (event) => {
      event.preventDefault();
    };

    // Disable scroll on mount
    document.body.style.overflow = "hidden";
    document.body.addEventListener("scroll", disableScroll);

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.removeEventListener("scroll", disableScroll);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} />
      <button id="request">Request Permission</button>
      {scene && camera && renderer && (
        <DeviceOrientationControls
          camera={camera}
          renderer={renderer}
          scene={scene}
        />
      )}
      <button id="request">Request Permission</button>
    </>
  );
};

export default SnowingScene;
