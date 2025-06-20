import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { testTypes } from "./routes/types-test";
import { getSchemaInfo } from "./routes/schema-info";
import iboRoutes from "./routes/iboRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Add types test endpoint
  app.get("/api/types-test", testTypes);
  
  // Add schema info endpoint
  app.get("/api/schema-info", getSchemaInfo);

  // Add IBO routes
  app.use("/api/ibos", iboRoutes);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
