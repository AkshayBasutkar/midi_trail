import { useEffect, useRef } from "react";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";

export function GameSounds() {
  const layers = useMemoryGame((state) => state.layers);
  const { playSuccess } = useAudio();
  const prevLayersRef = useRef(layers);
  
  useEffect(() => {
    const prevLayers = prevLayersRef.current;
    
    for (let i = 0; i < layers.length; i++) {
      const currentLayer = layers[i];
      const prevLayer = prevLayers[i];
      
      if (!prevLayer) continue;
      
      const prevMatchedCount = prevLayer.tiles.filter(t => t.isMatched).length;
      const currentMatchedCount = currentLayer.tiles.filter(t => t.isMatched).length;
      
      if (currentMatchedCount > prevMatchedCount && currentMatchedCount % 2 === 0) {
        console.log("Match detected! Playing success sound");
        playSuccess();
      }
      
      if (!prevLayer.isCleared && currentLayer.isCleared) {
        console.log("Layer cleared! Playing success sound");
        setTimeout(() => playSuccess(), 200);
      }
    }
    
    prevLayersRef.current = layers;
  }, [layers, playSuccess]);
  
  return null;
}
