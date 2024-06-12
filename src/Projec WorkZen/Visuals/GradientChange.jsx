import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ThreeClassSceneManager from "../Utils/ThreeClassSceneManager";
import VRButton from "../Utils/VRButton";

const CustomScene = () => {
  const containerRef = useRef(null);
  const [sceneManager, setSceneManager] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    // Initialize ThreeClassSceneManager and required objects
    const sceneManager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = sceneManager.getScene();
    const camera = sceneManager.getCamera();
    const renderer = sceneManager.getRenderer();

    // Initialize function containing scene setup and animation
    const init = () => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

      const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec3 color1 = vec3(0.0, 0.5, 1.0);
        vec3 color2 = vec3(1.0, 0.5, 0.0);
        float gradient = (sin(time + vUv.y * 3.14159) + 1.0) / 2.0;
        vec3 color = mix(color1, color2, gradient);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide, 
      });

      const sphereGeometry = new THREE.SphereGeometry(100, 32, 32);
      const sphere = new THREE.Mesh(sphereGeometry, shaderMaterial);
      scene.add(sphere);

      const animate = () => {
        requestAnimationFrame(animate);

        shaderMaterial.uniforms.time.value += 0.01;

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

export default CustomScene;
