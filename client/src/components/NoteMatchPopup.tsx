import { useEffect } from "react";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { Music } from "lucide-react";

export function NoteMatchPopup() {
  const matchedNote = useMemoryGame((state) => state.matchedNote);
  const clearMatchedNote = useMemoryGame((state) => state.clearMatchedNote);
  
  useEffect(() => {
    if (matchedNote) {
      const timer = setTimeout(() => {
        clearMatchedNote();
      }, 2000); // Show for 2 seconds
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedNote]);
  
  if (!matchedNote) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-6 rounded-2xl shadow-2xl transform animate-pulse scale-110">
        <div className="flex flex-col items-center gap-3">
          <Music className="w-12 h-12" />
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">
              {matchedNote.note}
            </div>
            <div className="text-sm opacity-90">
              MIDI {matchedNote.midi} • {matchedNote.frequency.toFixed(1)} Hz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

