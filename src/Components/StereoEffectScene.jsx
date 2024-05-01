import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const StereoEffectScene = () => {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    let camera,
      scene,
      renderer,
      effect,
      mouseX = 0,
      mouseY = 0;

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

      const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
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
      }

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);

      window.addEventListener("resize", onWindowResize);
      window.addEventListener("deviceorientation", onDeviceOrientation);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    const onDeviceOrientation = (event) => {
      mouseX = (event.gamma / 90) * 1000; // Adjust sensitivity if needed
      mouseY = (event.beta / 90) * 1000; // Adjust sensitivity if needed
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const timer = 0.00001 * Date.now();

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      for (let i = 0; i < scene.children.length; i++) {
        const child = scene.children[i];
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.01;
          child.rotation.y += 0.01;
        }
      }

      effect.render(scene, camera);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("deviceorientation", onDeviceOrientation); // Device Orientation 
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="info"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        margin: 0,
      }}
    ></div>
  );
};

export default StereoEffectScene;
