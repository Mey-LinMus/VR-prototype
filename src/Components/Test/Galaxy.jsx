import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

const Galaxy = () => {
  const canvasRef = useRef(null);
  const guiRef = useRef(null);

  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new GUI();
    guiRef.current = gui;

    // Scene
    const scene = new THREE.Scene();

    /**
     * Galaxy
     */
    const parameters = {};
    parameters.count = 300000;
    parameters.size = 0.01;
    parameters.radius = 13;
    parameters.branches = 20;
    parameters.spin = 0.5;
    parameters.randomness = 0.16;
    parameters.randomnessPower = 2;
    parameters.insideColor = "#5153e1";
    parameters.outsideColor = "#5e20cf";

    let geometry = null;
    let material = null;
    let points = null;

    const generateGalaxy = () => {
      // Destroy old galaxy
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }

      /**
       * Geometry
       */
      geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        // Position
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;

        const spinAngle = radius * parameters.spin;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 4;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : 2) *
          parameters.randomness *
          radius;
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : 10) *
          parameters.randomness *
          radius;
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : 10) *
          parameters.randomness *
          radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY; // Corrected index from 2 to 1
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g; // Corrected index from 2 to 1
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      /**
       * Material
       */
      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      /**
       * Points
       */
      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
    gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

    generateGalaxy();

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 1;
    camera.position.y = 10;
    camera.position.z = 0;

    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const rotateCamera = () => {
      gsap.to(camera.rotation, {
        z: Math.PI * 2, // Rotate 360 degrees around the y-axis
        duration: 50, // Duration of the rotation animation in seconds
        ease: "linear", // Linear easing for a constant rotation speed
      });
    };

    const startRotation = () => {
      rotateCamera();
    };

    startRotation();

    const tick = () => {
      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Clean up function
    return () => {
      window.removeEventListener("resize", handleResize);
      guiRef.current.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default Galaxy;
