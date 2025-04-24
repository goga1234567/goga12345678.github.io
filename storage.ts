import { 
  users, 
  characters, 
  accusations, 
  trials, 
  votes, 
  type User, 
  type InsertUser, 
  type Character, 
  type InsertCharacter, 
  type Accusation, 
  type InsertAccusation, 
  type Trial, 
  type InsertTrial, 
  type Vote, 
  type InsertVote
} from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserKarma(id: number, karmaChange: number): Promise<User | undefined>;
  
  // Character methods
  getCharacter(id: number): Promise<Character | undefined>;
  getCharacters(): Promise<Character[]>;
  getCharactersByUser(userId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacterKarma(id: number, karmaChange: number): Promise<Character | undefined>;
  
  // Accusation methods
  getAccusation(id: number): Promise<Accusation | undefined>;
  getRandomAccusation(): Promise<Accusation | undefined>;
  getAccusations(): Promise<Accusation[]>;
  createAccusation(accusation: InsertAccusation): Promise<Accusation>;
  
  // Trial methods
  getTrial(id: number): Promise<Trial | undefined>;
  getActiveTrials(): Promise<Trial[]>;
  getTrialsByCharacter(characterId: number): Promise<Trial[]>;
  getTrialsByUser(userId: number): Promise<Trial[]>;
  createTrial(trial: InsertTrial): Promise<Trial>;
  updateTrialKarma(id: number, isInnocent: boolean, karmaChange: number): Promise<Trial | undefined>;
  endTrial(id: number): Promise<Trial | undefined>;
  
  // Vote methods
  getVote(id: number): Promise<Vote | undefined>;
  getVoteByUserAndTrial(userId: number, trialId: number): Promise<Vote | undefined>;
  getVotesByTrial(trialId: number): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  
  // Leaderboard methods
  getTopDefenders(limit: number): Promise<Character[]>;
  getHallOfPlain(limit: number): Promise<Character[]>;
  
  // Session storage
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private characters: Map<number, Character>;
  private accusations: Map<number, Accusation>;
  private trials: Map<number, Trial>;
  private votes: Map<number, Vote>;
  
  private userId: number;
  private characterId: number;
  private accusationId: number;
  private trialId: number;
  private voteId: number;
  
  public sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.accusations = new Map();
    this.trials = new Map();
    this.votes = new Map();
    
    this.userId = 1;
    this.characterId = 1;
    this.accusationId = 1;
    this.trialId = 1;
    this.voteId = 1;
    
    // Create memory store for sessions
    const MemStore = MemoryStore(session);
    this.sessionStore = new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.initializeData();
  }
  
  // Initialize some sample data
  private initializeData() {
    // Add sample accusations
    const sampleAccusations = [
      "stealing all the Death Star's toilet paper during the galactic pandemic of 3077",
      "secretly replacing all lightsabers with glow sticks at the Jedi Academy party",
      "using the Infinity Stones to make all pizza toppings pineapple",
      "hacking into Hogwarts' Wi-Fi to download pirated movies",
      "selling fake Time Turner watches on Galactic eBay",
      "intentionally provided vague directions to Mordor to extend his book deal and increase merchandise sales",
      "allegedly used his shield as a dinner plate and consumed 47 pizzas without sharing with the Avengers",
      "teaching younglings to say 'wazzup' instead of 'may the force be with you'"
    ];
    
    sampleAccusations.forEach(content => {
      this.createAccusation({
        content,
        isCustom: false,
        createdBy: null
      });
    });
    
    // Add sample characters with text avatars
    const sampleCharacters = [
      {
        name: "Darth Vader",
        type: "VILLAIN",
        description: "Formerly known as Anakin Skywalker, now breathing heavily in court and using The Force to object.",
        textAvatar: "(-_-)"
      },
      {
        name: "Wonder Woman",
        type: "HERO",
        description: "Amazon princess with a lasso of truth that makes courtroom testimony painfully honest.",
        textAvatar: "⌒(✿❦✿)⌒"
      },
      {
        name: "Sherlock Holmes",
        type: "DETECTIVE",
        description: "Master detective who can deduce your life story but can't deduce why he's being sued.",
        textAvatar: "(⌐■_■)🔍"
      },
      {
        name: "Captain America",
        type: "HERO",
        description: "Super soldier with a shield that doubles as dinner plate for pizza parties.",
        textAvatar: "[◎]ᕦ(ò_óˇ)ᕤ"
      },
      {
        name: "Gandalf",
        type: "WIZARD",
        description: "Grey wizard with questionable GPS skills and a tendency to arrive precisely when he means to.",
        textAvatar: "≧❂≦✧*"
      }
    ];
    
    sampleCharacters.forEach(character => {
      this.createCharacter({
        ...character,
        userId: null
      });
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { 
      ...user, 
      id, 
      karma: 0, 
      textAvatar: "(⌐□_□)",
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUserKarma(id: number, karmaChange: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      karma: user.karma + karmaChange
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }
  
  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }
  
  async getCharactersByUser(userId: number): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(
      character => character.userId === userId
    );
  }
  
  async createCharacter(character: InsertCharacter): Promise<Character> {
    const id = this.characterId++;
    const newCharacter: Character = {
      ...character,
      id,
      karma: 0,
      userId: character.userId || null,
      createdAt: new Date()
    };
    this.characters.set(id, newCharacter);
    return newCharacter;
  }
  
  async updateCharacterKarma(id: number, karmaChange: number): Promise<Character | undefined> {
    const character = await this.getCharacter(id);
    if (!character) return undefined;
    
    const updatedCharacter = {
      ...character,
      karma: character.karma + karmaChange
    };
    
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }
  
  // Accusation methods
  async getAccusation(id: number): Promise<Accusation | undefined> {
    return this.accusations.get(id);
  }
  
  async getRandomAccusation(): Promise<Accusation | undefined> {
    const accusations = Array.from(this.accusations.values());
    if (accusations.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * accusations.length);
    return accusations[randomIndex];
  }
  
  async getAccusations(): Promise<Accusation[]> {
    return Array.from(this.accusations.values());
  }
  
  async createAccusation(accusation: InsertAccusation): Promise<Accusation> {
    const id = this.accusationId++;
    const newAccusation: Accusation = {
      ...accusation,
      id,
      isCustom: accusation.isCustom || false,
      createdBy: accusation.createdBy || null,
      createdAt: new Date()
    };
    this.accusations.set(id, newAccusation);
    return newAccusation;
  }
  
  // Trial methods
  async getTrial(id: number): Promise<Trial | undefined> {
    return this.trials.get(id);
  }
  
  async getActiveTrials(): Promise<Trial[]> {
    return Array.from(this.trials.values()).filter(
      trial => trial.isActive
    );
  }
  
  async getTrialsByCharacter(characterId: number): Promise<Trial[]> {
    return Array.from(this.trials.values()).filter(
      trial => trial.characterId === characterId
    );
  }
  
  async getTrialsByUser(userId: number): Promise<Trial[]> {
    return Array.from(this.trials.values()).filter(
      trial => trial.userId === userId
    );
  }
  
  async createTrial(trial: InsertTrial): Promise<Trial> {
    const id = this.trialId++;
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 3); // Trial ends in 3 days
    
    const newTrial: Trial = {
      ...trial,
      id,
      karmaInnocent: 0,
      karmaGuilty: 0,
      isActive: true,
      userId: trial.userId || null,
      endTime,
      createdAt: new Date()
    };
    this.trials.set(id, newTrial);
    return newTrial;
  }
  
  async updateTrialKarma(id: number, isInnocent: boolean, karmaChange: number): Promise<Trial | undefined> {
    const trial = await this.getTrial(id);
    if (!trial) return undefined;
    
    const updatedTrial = {
      ...trial,
      karmaInnocent: isInnocent ? trial.karmaInnocent + karmaChange : trial.karmaInnocent,
      karmaGuilty: !isInnocent ? trial.karmaGuilty + karmaChange : trial.karmaGuilty
    };
    
    this.trials.set(id, updatedTrial);
    return updatedTrial;
  }
  
  async endTrial(id: number): Promise<Trial | undefined> {
    const trial = await this.getTrial(id);
    if (!trial) return undefined;
    
    const updatedTrial = {
      ...trial,
      isActive: false
    };
    
    this.trials.set(id, updatedTrial);
    return updatedTrial;
  }
  
  // Vote methods
  async getVote(id: number): Promise<Vote | undefined> {
    return this.votes.get(id);
  }
  
  async getVoteByUserAndTrial(userId: number, trialId: number): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.userId === userId && vote.trialId === trialId
    );
  }
  
  async getVotesByTrial(trialId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      vote => vote.trialId === trialId
    );
  }
  
  async createVote(vote: InsertVote): Promise<Vote> {
    const id = this.voteId++;
    const newVote: Vote = {
      ...vote,
      id,
      createdAt: new Date()
    };
    this.votes.set(id, newVote);
    
    // Update trial karma
    await this.updateTrialKarma(vote.trialId, vote.isInnocent, 1);
    
    // Update character karma
    const trial = await this.getTrial(vote.trialId);
    if (trial) {
      const karmaChange = vote.isInnocent ? 1 : -1;
      await this.updateCharacterKarma(trial.characterId, karmaChange);
    }
    
    return newVote;
  }
  
  // Leaderboard methods
  async getTopDefenders(limit: number): Promise<Character[]> {
    return Array.from(this.characters.values())
      .sort((a, b) => b.karma - a.karma)
      .slice(0, limit);
  }
  
  async getHallOfPlain(limit: number): Promise<Character[]> {
    return Array.from(this.characters.values())
      .sort((a, b) => Math.abs(a.karma) - Math.abs(b.karma))
      .slice(0, limit);
  }
}

// Import DatabaseStorage
import { DatabaseStorage } from "./database-storage";

// Create DatabaseStorage instance instead of MemStorage
export const storage = new DatabaseStorage();
