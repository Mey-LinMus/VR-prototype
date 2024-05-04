import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const SphereScene = ({ orientationData }) => {
  const containerRef = useRef(null);
  const spheres = useRef([]);
  const cameraRef = useRef(null);
  const targetPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    let camera, scene, renderer, effect, directionalLight;

    const init = () => {
      const container = containerRef.current;
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.z = 3200;
      cameraRef.current = camera;
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x011c47);
      directionalLight = new THREE.DirectionalLight(0xffffff, 6);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);
      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(1, 5, 0);
      scene.add(pointLight);
      const geometry = new THREE.SphereGeometry(150);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x5391f5),
        roughness: 1,
        metalness: 1,
        opacity: 1,
        emissive: new THREE.Color(0x5391f5),
        fog: true,
      });
      for (let i = 0; i < 200; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
        scene.add(mesh);
        spheres.current.push(mesh);
      }
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);
      window.addEventListener("resize", onWindowResize);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      update();
      render();
    };

    const update = () => {
      if (orientationData) {
        const { alpha, beta, gamma } = orientationData;
        targetPosition.current.set(alpha, beta, gamma);
        targetPosition.current.multiplyScalar(0.1);
        velocity.current.lerp(targetPosition.current, 0.05);
        cameraRef.current.position.x = velocity.current.x;
        cameraRef.current.position.y = velocity.current.y;
        cameraRef.current.position.z = velocity.current.z;
      }
    };

    const render = () => {
      const timer = 0.00001 * Date.now();
      cameraRef.current.lookAt(scene.position);
      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }
      effect.render(scene, cameraRef.current);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [orientationData]);

  return (
    <div
      ref={containerRef}
      id="info"
      style={{ overflow: "hidden", width: "100%", height: "100%", margin: 0 }}
    ></div>
  );
};

export default SphereScene;
