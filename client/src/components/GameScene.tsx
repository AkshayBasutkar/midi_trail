import { useEffect } from "react";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { MemoryTile } from "./MemoryTile";

export function GameScene() {
  const layers = useMemoryGame((state) => state.layers);
  const startTime = useMemoryGame((state) => state.startTime);
  const updateTimer = useMemoryGame((state) => state.updateTimer);
  
  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      updateTimer(elapsed);
    }, 100);
    
    return () => clearInterval(interval);
  }, [startTime, updateTimer]);
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#a8d5ba" />
      </mesh>
      
      {layers.map((layer) =>
        layer.tiles.map((tile) => (
          !tile.isMatched && <MemoryTile key={tile.id} tile={tile} />
        ))
      )}
    </>
  );
}
