import React from "react";
import { XRButton, XR, Controllers, Hands } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";

function WebXR() {
  return (
    <>
      <XRButton
        mode="VR" // Choose 'AR', 'VR', or 'inline'
        sessionInit={{
          optionalFeatures: [
            "local-floor",
            "bounded-floor",
            "hand-tracking",
            "layers",
          ],
        }}
        enterOnly={false}
        exitOnly={false}
        onError={(error) =>
          console.error("WebXR initialization failed:", error)
        }
      >
        {(status) => `WebXR ${status}`}
      </XRButton>

      <Canvas>
        <XR>
          <Controllers /> {/* Add controllers */}
          <Hands /> {/* Add hand tracking */}
          <mesh>
            <boxGeometry args={[10, 12, 1]} /> {/* Specify box dimensions */}
            <meshBasicMaterial color="blue" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}

export default WebXR;
