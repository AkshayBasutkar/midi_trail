import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { MIDI_NOTE_MAPPING, type MidiNote } from "@/midiNoteMapping";

type TileAssignment = {
  midiNumber: number;
  displayValue: number;
};

const EASY_REQUIRED_MAPPINGS = [
  { displayValue: 5, note: "B4" },
  { displayValue: 2, note: "A4" },
  { displayValue: 10, note: "G4" },
  { displayValue: 15, note: "D5" },
  { displayValue: 6, note: "A#4" },
  { displayValue: 8, note: "F#4" },
] as const;

const NOTE_NAME_TO_MIDI = MIDI_NOTE_MAPPING.reduce<Record<string, number>>(
  (acc, entry) => {
    acc[entry.note] = entry.midi;
    return acc;
  },
  {}
);

export type GamePhase = "menu" | "playing" | "ended";
export type Difficulty = "easy" | "medium" | "hard";

export interface Tile {
  id: string;
  layerIndex: number;
  position: [number, number, number];
  midiNumber: number;
  displayValue: number;
  isFlipped: boolean;
  isMatched: boolean;
  isActive: boolean;
}

export interface Layer {
  index: number;
  gridSize: number;
  tiles: Tile[];
  isActive: boolean;
  isCleared: boolean;
}

interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  layers: Layer[];
  currentLayerIndex: number;
  flippedTiles: string[];
  moves: number;
  startTime: number | null;
  elapsedTime: number;
  isBusy: boolean;
  teamId: string | null;
  discoveredNotes: MidiNote[];
  matchedNote: MidiNote | null; // For popup display
  
  setTeamId: (teamId: string) => void;
  initGame: (difficulty: Difficulty) => void;
  flipTile: (tileId: string) => void;
  checkMatch: () => void;
  resetFlippedTiles: () => void;
  clearLayer: (layerIndex: number) => void;
  updateTimer: (time: number) => void;
  endGame: () => void;
  resetGame: () => void;
  startPlaying: () => void;
  clearMatchedNote: () => void;
}

const getDifficultyConfig = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return { layers: [{ size: 4 }, { size: 2 }] };
    case "medium":
      return { layers: [{ size: 6 }, { size: 4 }, { size: 2 }] };
    case "hard":
      return { layers: [{ size: 6 }, { size: 6 }, { size: 4 }, { size: 2 }] };
  }
};

const generateTilesForLayer = (
  layerIndex: number,
  gridSize: number,
  providedAssignments?: TileAssignment[]
): Tile[] => {
  const tiles: Tile[] = [];
  const totalTiles = gridSize * gridSize;
  let assignments: TileAssignment[] = [];

  if (providedAssignments) {
    if (providedAssignments.length !== totalTiles) {
      console.warn(
        `Provided assignments length ${providedAssignments.length} does not match total tiles ${totalTiles}`
      );
    }
    assignments = providedAssignments.slice(0, totalTiles);
    if (assignments.length < totalTiles && providedAssignments.length > 0) {
      for (let i = assignments.length; i < totalTiles; i++) {
        const fallback =
          providedAssignments[i % providedAssignments.length];
        assignments.push({ ...fallback });
      }
    }
  } else {
    const pairCount = totalTiles / 2;
    const availableNotes = [...MIDI_NOTE_MAPPING];
    const generatedAssignments: TileAssignment[] = [];
  
    for (let i = 0; i < pairCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableNotes.length);
      const selectedNote = availableNotes.splice(randomIndex, 1)[0];
      const assignment: TileAssignment = {
        midiNumber: selectedNote.midi,
        displayValue: selectedNote.midi,
      };
      generatedAssignments.push({ ...assignment }, { ...assignment });
    }
  
    // Shuffle the generated assignments
    for (let i = generatedAssignments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generatedAssignments[i], generatedAssignments[j]] = [
        generatedAssignments[j],
        generatedAssignments[i],
      ];
    }

    assignments = generatedAssignments;
  }
  
  let tileIndex = 0;
  const offset = (gridSize - 1) / 2;
  const layerHeight = layerIndex * 0.3;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = (col - offset) * 1.2;
      const z = (row - offset) * 1.2;
      const y = layerHeight;
      
      tiles.push({
        id: `layer${layerIndex}-tile${tileIndex}`,
        layerIndex,
        position: [x, y, z],
        midiNumber: assignments[tileIndex]?.midiNumber ?? 0,
        displayValue: assignments[tileIndex]?.displayValue ?? 0,
        isFlipped: false,
        isMatched: false,
        isActive: false,
      });
      tileIndex++;
    }
  }
  
  return tiles;
};

export const useMemoryGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    difficulty: "medium",
    layers: [],
    currentLayerIndex: 0,
    flippedTiles: [],
    moves: 0,
    startTime: null,
    elapsedTime: 0,
    isBusy: false,
    teamId: null,
    discoveredNotes: [],
    matchedNote: null,
    
    setTeamId: (teamId: string) => {
      set({ teamId });
    },

    initGame: (difficulty: Difficulty) => {
      console.log("Initializing game with difficulty:", difficulty);
      const config = getDifficultyConfig(difficulty);

      let assignmentPool: TileAssignment[] | null = null;

      if (difficulty === "easy") {
        const requiredPairs = EASY_REQUIRED_MAPPINGS.map(({ displayValue, note }) => {
          const midiNumber = NOTE_NAME_TO_MIDI[note];
          if (midiNumber === undefined) {
            throw new Error(`MIDI note "${note}" not found in mapping`);
          }
          return { displayValue, midiNumber };
        });

        const totalTiles = config.layers.reduce(
          (total, layerConfig) => total + layerConfig.size * layerConfig.size,
          0
        );
        const totalPairs = totalTiles / 2;

        if (requiredPairs.length > totalPairs) {
          console.warn(
            `More required note pairs (${requiredPairs.length}) than slots available (${totalPairs}) for easy difficulty`
          );
        }

        const assignments: TileAssignment[] = [];

        const pushPair = (pair: TileAssignment) => {
          assignments.push({ ...pair }, { ...pair });
        };

        requiredPairs.forEach(pushPair);

        const remainingPairs = Math.max(0, totalPairs - requiredPairs.length);
        for (let i = 0; i < remainingPairs; i++) {
          const randomIndex = Math.floor(Math.random() * requiredPairs.length);
          const randomPair = requiredPairs[randomIndex];
          pushPair(randomPair);
        }

        for (let i = assignments.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [assignments[i], assignments[j]] = [assignments[j], assignments[i]];
        }

        assignmentPool = assignments;
      }

      let assignmentIndex = 0;

      const layers: Layer[] = config.layers.map((layerConfig, index) => {
        const totalTilesForLayer = layerConfig.size * layerConfig.size;
        const layerAssignments = assignmentPool
          ? assignmentPool.slice(assignmentIndex, assignmentIndex + totalTilesForLayer)
          : undefined;
        assignmentIndex += totalTilesForLayer;

        return {
          index,
          gridSize: layerConfig.size,
          tiles: generateTilesForLayer(index, layerConfig.size, layerAssignments),
          isActive: false,
          isCleared: false,
        };
      });

      // ✅ Activate the topmost layer and its tiles
      const topIndex = layers.length - 1;
      if (topIndex >= 0) {
        layers[topIndex] = {
          ...layers[topIndex],
          isActive: true,
          tiles: layers[topIndex].tiles.map(t => ({ ...t, isActive: true })),
        };
      }

      set({
        difficulty,
        layers,
        currentLayerIndex: topIndex,
        flippedTiles: [],
        moves: 0,
        startTime: null,
        elapsedTime: 0,
        discoveredNotes: [],
        matchedNote: null,
      });
    },

    
    
    flipTile: (tileId: string) => {
      const state = get();

      // 1) Block if store is busy resolving a previous pair
      if (state.isBusy) {
        console.log("flipTile ignored: store isBusy");
        return;
      }

      // 2) Existing guards
      if (state.flippedTiles.length >= 2) return;
      if (state.flippedTiles.includes(tileId)) return;

      // 3) Start timer on first flip
      if (!state.startTime) {
        set({ startTime: Date.now() });
      }

      // 4) Flip the tile only if it's active and not matched
      const newLayers = state.layers.map(layer => ({
        ...layer,
        tiles: layer.tiles.map(tile => {
          if (tile.id === tileId && !tile.isMatched && tile.isActive) {
            return { ...tile, isFlipped: true };
          }
          return tile;
        }),
      }));

      const newFlippedTiles = [...state.flippedTiles, tileId];
      const newMoves = state.moves + 1;

      console.log(`Tile flipped: ${tileId}, Total flipped: ${newFlippedTiles.length}`);

      set({
        layers: newLayers,
        flippedTiles: newFlippedTiles,
        moves: newMoves,
      });

      // 5) If this is the second flipped tile, lock further clicks and schedule match check
      if (newFlippedTiles.length === 2) {
        set({ isBusy: true }); // <- block further flipTile calls until match resolution
        setTimeout(() => {
          get().checkMatch();
          // checkMatch should clear isBusy after it resolves (see instructions)
        }, 800);
      }
    },

    
    checkMatch: () => {
      const state = get();
      const [tile1Id, tile2Id] = state.flippedTiles;

      let tile1: Tile | undefined;
      let tile2: Tile | undefined;

      // find both tiles
      for (const layer of state.layers) {
        for (const tile of layer.tiles) {
          if (tile.id === tile1Id) tile1 = tile;
          if (tile.id === tile2Id) tile2 = tile;
        }
      }

      // safety check
      if (!tile1 || !tile2) {
        console.error("Tiles not found for match check");
        set({ flippedTiles: [], isBusy: false }); // <-- also clear isBusy here
        return;
      }

      const isMatch = tile1.midiNumber === tile2.midiNumber;
      console.log(`Match check: ${tile1.midiNumber} vs ${tile2.midiNumber} = ${isMatch}`);

      if (isMatch) {
        // Get the note information for the matched MIDI number
        const matchedNote = MIDI_NOTE_MAPPING.find(n => n.midi === tile1.midiNumber);
        
        // Add to discovered notes if not already there
        const newDiscoveredNotes = [...state.discoveredNotes];
        if (matchedNote && !newDiscoveredNotes.find(n => n.midi === matchedNote.midi)) {
          newDiscoveredNotes.push(matchedNote);
        }
        
        // mark both tiles as matched
        const newLayers = state.layers.map(layer => ({
          ...layer,
          tiles: layer.tiles.map(tile => {
            if (tile.id === tile1Id || tile.id === tile2Id) {
              return { ...tile, isMatched: true };
            }
            return tile;
          }),
        }));

        set({ 
          layers: newLayers, 
          flippedTiles: [],
          discoveredNotes: newDiscoveredNotes,
          matchedNote: matchedNote || null,
        });

        // delay to let player see the match, then check if layer is cleared
        setTimeout(() => {
          const currentLayer = get().layers[get().currentLayerIndex];
          const allMatched = currentLayer.tiles.every(tile => tile.isMatched);

          if (allMatched) {
            console.log(`Layer ${get().currentLayerIndex} cleared!`);
            get().clearLayer(get().currentLayerIndex);
          }

          // ✅ release busy after all animations/updates are done
          set({ isBusy: false });
        }, 500);
      } else {
        // tiles don't match -> flip them back after short delay
        setTimeout(() => {
          get().resetFlippedTiles();

          // ✅ release busy after flip-back animation completes
          set({ isBusy: false });
        }, 600);
      }
    },

    
    resetFlippedTiles: () => {
      const state = get();
      const newLayers = state.layers.map(layer => ({
        ...layer,
        tiles: layer.tiles.map(tile => {
          if (state.flippedTiles.includes(tile.id) && !tile.isMatched) {
            return { ...tile, isFlipped: false };
          }
          return tile;
        }),
      }));
      
      set({ layers: newLayers, flippedTiles: [] });
    },
    
    clearLayer: (layerIndex: number) => {
      const state = get();
      const nextLayerIndex = layerIndex - 1;
      const isLastLayer = nextLayerIndex < 0;
      
      const newLayers = state.layers.map((layer, index) => {
        if (index === layerIndex) {
          return {
            ...layer,
            isCleared: true,
            isActive: false,
            tiles: layer.tiles.map(tile => ({ ...tile, isActive: false })),
          };
        }
        if (index === nextLayerIndex && !isLastLayer) {
          return {
            ...layer,
            isActive: true,
            tiles: layer.tiles.map(tile => ({ ...tile, isActive: true })),
          };
        }
        return layer;
      });
      
      const clampedLayerIndex = isLastLayer
        ? layerIndex
        : nextLayerIndex;
      set({ layers: newLayers, currentLayerIndex: clampedLayerIndex });
      
      if (isLastLayer) {
        console.log("All layers cleared! Game won!");
        setTimeout(() => {
          get().endGame();
        }, 1000);
      }
    },
    
    updateTimer: (time: number) => {
      set({ elapsedTime: time });
    },
    
    endGame: () => {
      set({ phase: "ended" });
    },
    
    resetGame: () => {
      set({
        phase: "menu",
        layers: [],
        currentLayerIndex: 0,
        flippedTiles: [],
        moves: 0,
        startTime: null,
        elapsedTime: 0,
        discoveredNotes: [],
        matchedNote: null,
        teamId: null,
        isBusy: false,
      });
    },
    
    startPlaying: () => {
      set({ phase: "playing" });
    },
    
    clearMatchedNote: () => {
      set({ matchedNote: null });
    },
  }))
);
