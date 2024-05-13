import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "../Test/Class/ThreeClassSceneManager";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import snowdropTextureImg from "./Texture/snowflake1.png";

const SnowingScene = ({ orientationData }) => {
  const cameraRef = useRef(null);
  const targetPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  const containerRef = useRef(null);
  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();
    const effect = sceneManager.getEffect(); // Get stereo effect from scene manager

    let sky, sun;

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    sun = new THREE.Vector3();

    camera.position.z = 3200;
    cameraRef.current = camera;

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

      renderer.render(scene, camera);
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

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      effect.setSize(window.innerWidth, window.innerHeight);
    };
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

      if (orientationData) {
        const { alpha, beta, gamma } = orientationData;
        targetPosition.current.set(alpha, beta, gamma);
        targetPosition.current.multiplyScalar(0.1);
        velocity.current.lerp(targetPosition.current, 0.1); // Adjust the lerp factor for smoothing
        cameraRef.current.position.x +=
          (velocity.current.x - cameraRef.current.position.x) * 0.1; // Adjust the lerp factor for smoothing
        cameraRef.current.position.y +=
          (velocity.current.y - cameraRef.current.position.y) * 0.1; // Adjust the lerp factor for smoothing
        cameraRef.current.position.z +=
          (velocity.current.z - cameraRef.current.position.z) * 0.1; // Adjust the lerp factor for smoothing
      }

      // Render the scene
      effect.render(scene, cameraRef.current);

      // Use stereo effect to render the scene
      // effect.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [orientationData]);

  return <div ref={containerRef} />;
};

export default SnowingScene;
