import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeClassSceneManager from "./ThreeClassSceneManager";

const CustomGeometryParticles = (props) => {
  const { count } = props;
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const distance = 1;

    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * distance * 1000;
      let y = (Math.random() - 0.5) * distance * 1000;
      let z = (Math.random() - 0.5) * distance * 1000;

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  useFrame(() => {
    const speed = 0.5;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      points.current.geometry.attributes.position.array[i3 + 1] -= speed;

      if (points.current.geometry.attributes.position.array[i3 + 1] < -500) {
        points.current.geometry.attributes.position.array[i3 + 1] =
          Math.random() * 1000;
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 5}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={5}
        color="#5786F5"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const Scene = ({ containerRef }) => {
  useEffect(() => {
    const manager = new ThreeClassSceneManager(containerRef, THREE);
    const scene = manager.getScene();
    const camera = manager.getCamera();
    const renderer = manager.getRenderer();

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();

    return () => {
      // Clean up ThreeClassSceneManager resources if needed
    };
  }, [containerRef]);

  return (
    <Canvas>
    <CustomGeometryParticles count={2000} />
    <OrbitControls />
  </Canvas>
  );
};

export default Scene;
