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

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const noise3D = createNoise3D();
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);

      const vertexShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        vec3 transformed = position;
        transformed.z += sin(position.x * 10.0 + time) * 0.1;
        transformed.z += sin(position.y * 10.0 + time) * 0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `;

      const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        float r = abs(sin(time + vUv.x * 3.0));
        float g = abs(sin(time + vUv.y * 3.0));
        float b = abs(sin(time + vUv.x * 3.0 + vUv.y * 3.0));
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 1.0 },
        },
        vertexShader,
        fragmentShader,
      });

      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      const animate = () => {
        requestAnimationFrame(animate);

        material.uniforms.time.value += 0.05;

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
