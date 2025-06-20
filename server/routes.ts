import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { testTypes } from "./routes/types-test";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Add types test endpoint
  app.get("/api/types-test", testTypes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
