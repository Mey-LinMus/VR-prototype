import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ParticlesComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 50000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Parameters for the tunnel
    const radius = 10; // Radius of the tunnel
    const segments = 500; // Number of segments along the tunnel
    const height = 30; // Height of the tunnel

    for (let i = 0; i < count; i++) {
      // Randomly select a segment along the tunnel
      const t = Math.random();
      const angle = t * Math.PI * 2;
      const y = (Math.random() - 0.5) * height;

      // Calculate the position based on cylindrical coordinates
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Index calculation for position and color arrays
      const index = i * 3; // Corrected index calculation

      // Set the position and color for the particle
      positions[index] = x;
      positions[index + 1] = y;
      positions[index + 2] = z;

      colors[index] = Math.random();
      colors[index + 1] = Math.random();
      colors[index + 2] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const animate = () => {
      requestAnimationFrame(animate);

      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default ParticlesComponent;
