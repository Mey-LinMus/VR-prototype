import React, { useRef, useEffect, useState } from "react";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import VRButton from "../Utils/VRButton";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const LavaLamp = () => {
  const containerRef = useRef(null);
  const [sceneManager, setSceneManager] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    const init = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffa000, 1); // Warm orange point light
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const noise3D = createNoise3D();
      camera.position.set(0, 0, 10); // Adjusted camera position for better view
      camera.lookAt(0, 0, 0);

      const vertexShader = `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          vec3 transformed = position;
          transformed.z += sin(position.x * 3.0 + time) * 0.5; // Adjusted speed and magnitude
          transformed.z += sin(position.y * 3.0 + time) * 0.5; // Adjusted speed and magnitude
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float r = abs(sin(time + vUv.x * 2.0));
          float g = abs(sin(time + vUv.y * 2.0));
          float b = abs(sin(time + vUv.x * 2.0 + vUv.y * 2.0));
          gl_FragColor = vec4(r, g * 0.5, b * 0.2, 1.0); // Soft warm colors
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
        },
        vertexShader,
        fragmentShader,
      });

      const numSpheres = 80;
      const spheres = [];

      for (let i = 0; i < numSpheres; i++) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.set(
          Math.random() * 20 - 10,
          Math.random() * 20 - 10,
          Math.random() * 20 - 10
        );

        scene.add(sphere);
        spheres.push(sphere);
      }

      const animate = () => {
        requestAnimationFrame(animate);

        material.uniforms.time.value += 0.01;

        sceneManager.render();
      };

      animate();
    };

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setSceneManager(sceneManager);

    init();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      sceneManager.effect.setSize(window.innerWidth, window.innerHeight);
    };

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

export default LavaLamp;
