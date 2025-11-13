import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import { useMemoryGame, type Tile } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";

interface MemoryTileProps {
  tile: Tile;
}

export function MemoryTile({ tile }: MemoryTileProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const flipTile = useMemoryGame((state) => state.flipTile);
  const { playHit, playSuccess } = useAudio();
  
  const targetRotation = tile.isFlipped ? Math.PI : 0;
  const targetScale = tile.isMatched ? 0 : 1;
  const targetOpacity = tile.isMatched ? 0 : 1;
  
  useFrame(() => {
    if (groupRef.current) {
      const currentRotation = groupRef.current.rotation.y;
      const rotationDiff = targetRotation - currentRotation;
      
      if (Math.abs(rotationDiff) > 0.01) {
        groupRef.current.rotation.y += rotationDiff * 0.15;
      } else {
        groupRef.current.rotation.y = targetRotation;
      }
      
      const currentScale = groupRef.current.scale.x;
      const scaleDiff = targetScale - currentScale;
      
      if (Math.abs(scaleDiff) > 0.01) {
        groupRef.current.scale.set(
          currentScale + scaleDiff * 0.1,
          currentScale + scaleDiff * 0.1,
          currentScale + scaleDiff * 0.1
        );
      } else {
        groupRef.current.scale.set(targetScale, targetScale, targetScale);
      }
    }
  });
  
  const handleClick = (e: any) => {
    e.stopPropagation(); // 🔒 Prevent click from reaching tiles below
    if (!tile.isActive || tile.isMatched || tile.isFlipped) {
      console.log(
        `Tile ${tile.id} not clickable - active: ${tile.isActive}, matched: ${tile.isMatched}, flipped: ${tile.isFlipped}`
      );
      return;
    }

    console.log(`Clicking tile ${tile.id}`);
    playHit();
    flipTile(tile.id);
  };
  
  const handlePointerOver = (e: any) => {
    e.stopPropagation(); // Prevent hover passing through
    if (tile.isActive && !tile.isMatched && !tile.isFlipped) {
      setHovered(true);
      document.body.style.cursor = "pointer";
    }
  };
  
  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "default";
  };
  
  const tileColor = tile.isActive ? (hovered ? "#f0f0f0" : "#ffffff") : "#cccccc";
  const edgeColor = "#d4a574";
  
  const eventBindings = tile.isActive
    ? {
        onClick: handleClick,
        onPointerOver: handlePointerOver,
        onPointerOut: handlePointerOut,
      }
    : {
        onClick: (e: any) => e.stopPropagation(),
        onPointerOver: (e: any) => e.stopPropagation(),
        onPointerOut: (e: any) => e.stopPropagation(),
      };

  return (
    <group
      ref={groupRef}
      position={tile.position}
      {...eventBindings}
    >

      <RoundedBox
        args={[1, 0.2, 1]}
        radius={0.05}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={tileColor}
          transparent={true}
          opacity={targetOpacity}
        />
      </RoundedBox>
      
      {/* MIDI number label - only show when flipped */}
      {tile.isFlipped && !tile.isMatched && (
        <Text
          position={[0, 0.11, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.8}
        >
          {tile.displayValue}
        </Text>
      )}
      
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.02, 0.25, 1.05]} />
        <meshStandardMaterial color={edgeColor} />
      </mesh>
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.02, 0.25, 1.05]} />
        <meshStandardMaterial color={edgeColor} />
      </mesh>
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[1.05, 0.25, 0.02]} />
        <meshStandardMaterial color={edgeColor} />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[1.05, 0.25, 0.02]} />
        <meshStandardMaterial color={edgeColor} />
      </mesh>
    </group>
  );
}
