import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working", timestamp: new Date().toISOString() });
  });

  // Leaderboard is now stored in local storage on the client side
  // Removed server-side leaderboard routes

  const httpServer = createServer(app);

  return httpServer;
}
