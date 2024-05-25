import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import snowdropTextureImg from "../Texture/snowflake1.png";
import VRButton from "../Utils/VRButton";

const SnowingScene = () => {
  const containerRef = useRef(null);
  const [sceneManager, setSceneManager] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const particlesRef = useRef(null); // Ref for particles
  const positionsRef = useRef(null); // Ref for positions

  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    let sky, sun;

    const init = () => {
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
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      // Store particles and positions in refs
      particlesRef.current = particles;
      positionsRef.current = positions;

      // Load snowdrop texture
      const textureLoader = new THREE.TextureLoader();
      const snowdropTexture = textureLoader.load(snowdropTextureImg);
      const snowdropMaterial = new THREE.PointsMaterial({
        map: snowdropTexture,
        color: 0xfffafa,
        size: 60,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6,
      });
      const snowflakes = new THREE.Points(particles, snowdropMaterial);
      scene.add(snowflakes);
    };

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setSceneManager(sceneManager);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneManager.effect.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const positions = positionsRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 5;
        if (positions[i + 1] < -3000) {
          positions[i] = Math.random() * 7000 - 3000;
          positions[i + 1] = Math.random() * 7000 + 3000;
          positions[i + 2] = Math.random() * 7000 - 3000;
        }
      }
      particles.attributes.position.needsUpdate = true;
      sceneManager.render();
    };

    init();
    animate();

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {sceneManager && <VRButton sceneManager={sceneManager} />}
      <div ref={containerRef} />
    </>
  );
};

export default SnowingScene;
