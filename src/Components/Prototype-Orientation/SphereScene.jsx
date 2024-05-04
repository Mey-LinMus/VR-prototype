// ThreeScene.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const SphereScene = ({ orientationData }) => {
  const canvasRef = useRef(null);
  const spheres = useRef([]);
  const camera = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x011c47);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x5391f5),
      roughness: 1,
      metalness: 1,
      opacity: 1,
      emissive: new THREE.Color(0x5391f5),
      fog: true,
    });
    const geometry = new THREE.SphereGeometry(150);

    for (let i = 0; i < 500; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 10000 - 5000;
      mesh.position.y = Math.random() * 10000 - 5000;
      mesh.position.z = Math.random() * 10000 - 5000;
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 2 + 1;
      scene.add(mesh);
      spheres.current.push(mesh);
    }

    const light = new THREE.DirectionalLight(0xffffff, 6);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.current.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      updateCamera();
      render();
    };

    const updateCamera = () => {
      if (orientationData) {
        const { alpha, beta, gamma } = orientationData;

        // Convert degrees to radians for Three.js rotation
        const betaRad = THREE.MathUtils.degToRad(beta);
        const gammaRad = THREE.MathUtils.degToRad(gamma);
        const alphaRad = THREE.MathUtils.degToRad(alpha);

        // Set camera rotation based on device orientation
        camera.current.rotation.set(betaRad, gammaRad, -alphaRad);
      }
    };

    const render = () => {
      const timer = 0.00001 * Date.now();

      camera.current.lookAt(scene.position);

      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 1000 * Math.cos(timer + i);
        sphere.position.y = 1000 * Math.sin(timer + i * 1.1);
      }

      renderer.render(scene, camera.current);
    };

    animate();

    return () => {
      spheres.current = [];
    };
  }, [orientationData]);

  return <canvas ref={canvasRef} />;
};

export default SphereScene;
