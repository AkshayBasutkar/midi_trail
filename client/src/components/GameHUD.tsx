import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Timer, Move, Layers } from "lucide-react";

export function GameHUD() {
  const moves = useMemoryGame((state) => state.moves);
  const elapsedTime = useMemoryGame((state) => state.elapsedTime);
  const currentLayerIndex = useMemoryGame((state) => state.currentLayerIndex);
  const layers = useMemoryGame((state) => state.layers);
  const resetGame = useMemoryGame((state) => state.resetGame);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const totalLayers = layers.length;
  const currentLayer = currentLayerIndex + 1;
  
  return (
    <div className="fixed top-4 left-4 right-4 z-10 pointer-events-none">
      <div className="max-w-6xl mx-auto flex justify-between items-start gap-4">
        <Card className="bg-white/90 backdrop-blur shadow-lg pointer-events-auto">
          <div className="p-4 flex gap-6">
            <div className="flex items-center gap-2">
              <Move className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-xs text-gray-600 font-medium">Moves</div>
                <div className="text-2xl font-bold text-gray-900">{moves}</div>
              </div>
            </div>
            
            <div className="w-px bg-gray-300" />
            
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs text-gray-600 font-medium">Time</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
            
            <div className="w-px bg-gray-300" />
            
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-xs text-gray-600 font-medium">Layer</div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentLayer} / {totalLayers}
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Button
          onClick={resetGame}
          variant="destructive"
          className="pointer-events-auto shadow-lg"
        >
          Restart
        </Button>
      </div>
    </div>
  );
}
