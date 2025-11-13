import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Music } from "lucide-react";

export function DiscoveredNotesPanel() {
  const discoveredNotes = useMemoryGame((state) => state.discoveredNotes);
  
  return (
    <Card className="fixed right-4 top-20 w-64 bg-white/90 backdrop-blur shadow-lg z-[60] max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-600" />
          Discovered Notes
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">
          {discoveredNotes.length} note{discoveredNotes.length !== 1 ? 's' : ''} found
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        {discoveredNotes.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes discovered yet</p>
            <p className="text-xs mt-1">Match pairs to reveal notes!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {discoveredNotes.map((note) => (
              <div
                key={note.midi}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-purple-700 text-lg">
                      {note.note}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      MIDI {note.midi}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {note.frequency.toFixed(1)} Hz
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

