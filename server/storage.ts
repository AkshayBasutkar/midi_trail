import { users, type User, type InsertUser, leaderboard, type LeaderboardEntry, type InsertLeaderboard } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Leaderboard methods
  addLeaderboardEntry(entry: InsertLeaderboard): Promise<LeaderboardEntry>;
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  currentId: number;
  leaderboardId: number;

  constructor() {
    this.users = new Map();
    this.leaderboardEntries = new Map();
    this.currentId = 1;
    this.leaderboardId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addLeaderboardEntry(entry: InsertLeaderboard): Promise<LeaderboardEntry> {
    try {
      const id = this.leaderboardId++;
      // Create entry matching Drizzle's expected structure
      const leaderboardEntry: LeaderboardEntry = {
        id: id,
        teamId: String(entry.teamId),
        timeTaken: Number(entry.timeTaken),
        moves: Number(entry.moves),
        score: Number(entry.score),
        createdAt: new Date() as any, // Drizzle timestamp type
      };
      
      this.leaderboardEntries.set(id, leaderboardEntry);
      console.log("Stored leaderboard entry:", leaderboardEntry);
      return leaderboardEntry;
    } catch (error) {
      console.error("Error in addLeaderboardEntry:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      throw error;
    }
  }

  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboardEntries.values())
      .sort((a, b) => a.score - b.score) // Lower score is better
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
