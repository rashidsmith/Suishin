import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { testTypes } from "./routes/types-test";
import { getSchemaInfo } from "./routes/schema-info";
import { setupDatabase } from "./routes/db-setup";
import iboRoutes from "./routes/iboRoutes";
import cardRoutes from "./routes/cardRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import performanceMetricRoutes from "./routes/performanceMetricRoutes";
import observableBehaviorRoutes from "./routes/observableBehaviorRoutes";
import personaRoutes from "./routes/personaRoutes";
import aiRoutes from "./routes/aiRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Add types test endpoint
  app.get("/api/types-test", testTypes);
  
  // Add schema info endpoint
  app.get("/api/schema-info", getSchemaInfo);

  // Add database setup endpoint
  app.post("/api/setup-database", setupDatabase);

  // Add IBO routes
  app.use("/api/ibos", iboRoutes);

  // Add Card routes
  app.use("/api/cards", cardRoutes);

  // Add Session routes
  app.use("/api/sessions", sessionRoutes);

  // Add Performance Metric routes
  app.use("/api/performance-metrics", performanceMetricRoutes);

  // Add Observable Behavior routes
  app.use("/api/observable-behaviors", observableBehaviorRoutes);

  // Add Persona routes
  app.use("/api/personas", personaRoutes);

  // Add AI routes
  app.use("/api/ai", aiRoutes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
