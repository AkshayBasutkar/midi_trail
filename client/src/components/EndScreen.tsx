import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Layers } from "lucide-react";

export function EndScreen() {
  const difficulty = useMemoryGame((state) => state.difficulty);
  const layers = useMemoryGame((state) => state.layers);
  const discoveredNotes = useMemoryGame((state) => state.discoveredNotes);
  const resetGame = useMemoryGame((state) => state.resetGame);
  
  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "easy": return "Easy";
      case "medium": return "Medium";
      case "hard": return "Hard";
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 z-50">
      <Card className="w-full max-w-md mx-4 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Trophy className="w-20 h-20 text-yellow-500" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Congratulations!
          </CardTitle>
          <p className="text-gray-600 mt-2">You matched all the MIDI notes!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
            <h3 className="text-center font-semibold text-gray-700 mb-4">
              Game Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Layers Cleared</span>
                </div>
                <span className="font-bold text-gray-900">{layers.length}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Notes Discovered</span>
                </div>
                <span className="font-bold text-gray-900">{discoveredNotes.length}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={resetGame}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
