import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertCharacterSchema,
  insertAccusationSchema,
  insertTrialSchema,
  insertVoteSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  const httpServer = createServer(app);

  // Character routes
  app.get("/api/characters", async (req: Request, res: Response) => {
    const characters = await storage.getCharacters();
    res.json(characters);
  });

  app.get("/api/characters/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid character ID" });
    }

    const character = await storage.getCharacter(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.json(character);
  });

  app.post("/api/characters", async (req: Request, res: Response) => {
    const parseResult = insertCharacterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid character data", errors: parseResult.error.errors });
    }

    const character = await storage.createCharacter(parseResult.data);
    res.status(201).json(character);
  });

  // Accusation routes
  app.get("/api/accusations", async (req: Request, res: Response) => {
    const accusations = await storage.getAccusations();
    res.json(accusations);
  });

  app.get("/api/accusations/random", async (req: Request, res: Response) => {
    const accusation = await storage.getRandomAccusation();
    if (!accusation) {
      return res.status(404).json({ message: "No accusations found" });
    }
    res.json(accusation);
  });

  app.post("/api/accusations", async (req: Request, res: Response) => {
    const parseResult = insertAccusationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid accusation data", errors: parseResult.error.errors });
    }

    const accusation = await storage.createAccusation(parseResult.data);
    res.status(201).json(accusation);
  });

  // Trial routes
  app.get("/api/trials", async (req: Request, res: Response) => {
    const trials = await storage.getActiveTrials();
    
    // For each trial, fetch the related character and accusation
    const trialData = await Promise.all(trials.map(async (trial) => {
      const character = await storage.getCharacter(trial.characterId);
      const accusation = await storage.getAccusation(trial.accusationId);
      
      return {
        ...trial,
        character,
        accusation
      };
    }));
    
    res.json(trialData);
  });

  app.get("/api/trials/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid trial ID" });
    }

    const trial = await storage.getTrial(id);
    if (!trial) {
      return res.status(404).json({ message: "Trial not found" });
    }

    const character = await storage.getCharacter(trial.characterId);
    const accusation = await storage.getAccusation(trial.accusationId);
    const votes = await storage.getVotesByTrial(trial.id);

    res.json({
      ...trial,
      character,
      accusation,
      votes
    });
  });

  app.post("/api/trials", async (req: Request, res: Response) => {
    const parseResult = insertTrialSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid trial data", errors: parseResult.error.errors });
    }

    const trial = await storage.createTrial(parseResult.data);
    res.status(201).json(trial);
  });

  // Vote routes
  app.post("/api/votes", async (req: Request, res: Response) => {
    const parseResult = insertVoteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid vote data", errors: parseResult.error.errors });
    }

    // Check if user already voted on this trial
    const existingVote = await storage.getVoteByUserAndTrial(
      parseResult.data.userId,
      parseResult.data.trialId
    );

    if (existingVote) {
      return res.status(400).json({ message: "User already voted on this trial" });
    }

    const vote = await storage.createVote(parseResult.data);
    res.status(201).json(vote);
  });

  // Leaderboard routes
  app.get("/api/leaderboard/top", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topDefenders = await storage.getTopDefenders(limit);
    res.json(topDefenders);
  });

  app.get("/api/leaderboard/plain", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const hallOfPlain = await storage.getHallOfPlain(limit);
    res.json(hallOfPlain);
  });

  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    const parseResult = insertUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid user data", errors: parseResult.error.errors });
    }

    const existingUser = await storage.getUserByUsername(parseResult.data.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await storage.createUser(parseResult.data);
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  });

  return httpServer;
}
