import { useState } from "react";
import { useMemoryGame, type Difficulty } from "@/lib/stores/useMemoryGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function StartScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const initGame = useMemoryGame((state) => state.initGame);
  const startPlaying = useMemoryGame((state) => state.startPlaying);
  
  const handleStartGame = () => {
    console.log("Starting game with difficulty:", selectedDifficulty);
    initGame(selectedDifficulty);
    startPlaying();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 z-50">
      <Card className="w-full max-w-md mx-4 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🌸 Memory Tiles 🌸
          </CardTitle>
          <p className="text-gray-600 mt-2">Match the flowers layer by layer!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">
              Select Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={selectedDifficulty === "easy" ? "default" : "outline"}
                onClick={() => setSelectedDifficulty("easy")}
                className="h-16"
              >
                <div className="text-center">
                  <div className="font-bold">Easy</div>
                  <div className="text-xs opacity-75">2 Layers</div>
                </div>
              </Button>
              <Button
                variant={selectedDifficulty === "medium" ? "default" : "outline"}
                onClick={() => setSelectedDifficulty("medium")}
                className="h-16"
              >
                <div className="text-center">
                  <div className="font-bold">Medium</div>
                  <div className="text-xs opacity-75">3 Layers</div>
                </div>
              </Button>
              <Button
                variant={selectedDifficulty === "hard" ? "default" : "outline"}
                onClick={() => setSelectedDifficulty("hard")}
                className="h-16"
              >
                <div className="text-center">
                  <div className="font-bold">Hard</div>
                  <div className="text-xs opacity-75">4 Layers</div>
                </div>
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleStartGame}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            Start Game
          </Button>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>How to play:</strong> Click tiles to flip them and reveal flowers. 
              Match pairs to clear tiles. Complete all layers to win!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
