import { OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CustomGeometryParticles = (props) => {
  const { count } = props;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const distance = 1;

    // Loop through each particle and set its initial position
    // Loop through each particle and set its initial position within a cube
    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * distance * 1000;
      let y = (Math.random() - 0.5) * distance * 1000;
      let z = (Math.random() - 0.5) * distance * 1000;

      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  // Use the useFrame hook to update the animation of the particles
  useFrame(() => {
    const speed = 0.5; // Adjust falling speed

    // Loop through each particle and update its position based on falling animation
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Move particles along the y-axis (falling animation)
      points.current.geometry.attributes.position.array[i3 + 1] -= speed;

      // Reset particles if they fall below a certain threshold
      if (points.current.geometry.attributes.position.array[i3 + 1] < -500) {
        points.current.geometry.attributes.position.array[i3 + 1] =
          Math.random() * 1000; // Reset to top
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        {/* Define the position attribute of the particles */}
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 5} // Number of particles
          array={particlesPosition} // Array containing the positions of the particles
          itemSize={3} // Number of values per vertex (x, y, z)
        />
      </bufferGeometry>
      {/* Define the material of the particles */}
      <pointsMaterial
        size={5} // Size of the particles
        color="#5786F5" // Color of the particles
        sizeAttenuation // Allow size attenuation based on distance
        depthWrite={false} // Do not write to depth buffer
      />
    </points>
  );
};

const Scene = () => {
  return (
    <Canvas shadows flat dpr={[2, 2]} style={{ position: "absolute" }}>
      {/* Add ambient light to the scene */}
      <ambientLight intensity={0.5} />
      {/* Add the custom particle component */}
      <CustomGeometryParticles count={2000} />
      {/* Add orbit controls to enable camera movement */}
      <OrbitControls />
      {/* Add a sky to the scene */}
      <Sky
        inclination={0}
        rayleigh={5}
        turbidity={10}
        mieCoefficient={0.01}
        sunPosition={[20, 0, 10]}
      />
    </Canvas>
  );
};

export default Scene;
