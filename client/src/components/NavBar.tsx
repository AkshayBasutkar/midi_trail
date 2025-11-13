import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { Button } from "./ui/button";
import { Home, Trophy, LogOut } from "lucide-react";

interface NavBarProps {
  currentPage: "home" | "leaderboard";
  onNavigate: (page: "home" | "leaderboard") => void;
}

export function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const teamId = useMemoryGame((state) => state.teamId);
  const resetGame = useMemoryGame((state) => state.resetGame);
  
  const handleLogout = () => {
    resetGame();
    onNavigate("home");
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MIDI Memory Match
            </h1>
            {teamId && (
              <span className="text-sm text-gray-600 px-3 py-1 bg-purple-50 rounded-full">
                Team: {teamId}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            
            <Button
              variant={currentPage === "leaderboard" ? "default" : "ghost"}
              onClick={() => onNavigate("leaderboard")}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
            
            {teamId && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

