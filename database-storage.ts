import { 
  users, characters, accusations, trials, votes,
  type User, type Character, type Accusation, type Trial, type Vote,
  type InsertUser, type InsertCharacter, type InsertAccusation, type InsertTrial, type InsertVote
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      ...user,
      textAvatar: "(⌐□_□)"
    }).returning();
    return newUser;
  }

  async updateUserKarma(id: number, karmaChange: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const [updatedUser] = await db.update(users)
      .set({ karma: user.karma + karmaChange })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }

  async getCharacters(): Promise<Character[]> {
    return await db.select().from(characters);
  }

  async getCharactersByUser(userId: number): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.userId, userId));
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const [newCharacter] = await db.insert(characters).values(character).returning();
    return newCharacter;
  }

  async updateCharacterKarma(id: number, karmaChange: number): Promise<Character | undefined> {
    const character = await this.getCharacter(id);
    if (!character) return undefined;

    const [updatedCharacter] = await db.update(characters)
      .set({ karma: character.karma + karmaChange })
      .where(eq(characters.id, id))
      .returning();
    
    return updatedCharacter;
  }

  // Accusation methods
  async getAccusation(id: number): Promise<Accusation | undefined> {
    const [accusation] = await db.select().from(accusations).where(eq(accusations.id, id));
    return accusation;
  }

  async getRandomAccusation(): Promise<Accusation | undefined> {
    // Note: This is not truly random but works for our purposes
    // A more robust solution would use SQL's RANDOM() function
    const allAccusations = await db.select().from(accusations);
    if (allAccusations.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * allAccusations.length);
    return allAccusations[randomIndex];
  }

  async getAccusations(): Promise<Accusation[]> {
    return await db.select().from(accusations);
  }

  async createAccusation(accusation: InsertAccusation): Promise<Accusation> {
    const [newAccusation] = await db.insert(accusations).values({
      ...accusation,
      isCustom: accusation.isCustom || false,
      createdBy: accusation.createdBy || null
    }).returning();
    
    return newAccusation;
  }

  // Trial methods
  async getTrial(id: number): Promise<Trial | undefined> {
    const [trial] = await db.select().from(trials).where(eq(trials.id, id));
    return trial;
  }

  async getActiveTrials(): Promise<Trial[]> {
    return await db.select().from(trials).where(eq(trials.isActive, true));
  }

  async getTrialsByCharacter(characterId: number): Promise<Trial[]> {
    return await db.select().from(trials).where(eq(trials.characterId, characterId));
  }

  async getTrialsByUser(userId: number): Promise<Trial[]> {
    return await db.select().from(trials).where(eq(trials.userId, userId));
  }

  async createTrial(trial: InsertTrial): Promise<Trial> {
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 3); // Trial ends in 3 days
    
    const [newTrial] = await db.insert(trials).values({
      ...trial,
      userId: trial.userId || null,
      karmaInnocent: 0,
      karmaGuilty: 0,
      isActive: true,
      endTime
    }).returning();
    
    return newTrial;
  }

  async updateTrialKarma(id: number, isInnocent: boolean, karmaChange: number): Promise<Trial | undefined> {
    const trial = await this.getTrial(id);
    if (!trial) return undefined;

    const [updatedTrial] = await db.update(trials)
      .set(
        isInnocent
          ? { karmaInnocent: trial.karmaInnocent + karmaChange }
          : { karmaGuilty: trial.karmaGuilty + karmaChange }
      )
      .where(eq(trials.id, id))
      .returning();
    
    return updatedTrial;
  }

  async endTrial(id: number): Promise<Trial | undefined> {
    const [updatedTrial] = await db.update(trials)
      .set({ isActive: false })
      .where(eq(trials.id, id))
      .returning();
    
    return updatedTrial;
  }

  // Vote methods
  async getVote(id: number): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(eq(votes.id, id));
    return vote;
  }

  async getVoteByUserAndTrial(userId: number, trialId: number): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(
      and(
        eq(votes.userId, userId),
        eq(votes.trialId, trialId)
      )
    );
    return vote;
  }

  async getVotesByTrial(trialId: number): Promise<Vote[]> {
    return await db.select().from(votes).where(eq(votes.trialId, trialId));
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    const [newVote] = await db.insert(votes).values(vote).returning();
    
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
    return await db.select()
      .from(characters)
      .orderBy(desc(characters.karma))
      .limit(limit);
  }

  async getHallOfPlain(limit: number): Promise<Character[]> {
    return await db.select()
      .from(characters)
      .orderBy(asc(sql`ABS(${characters.karma})`))
      .limit(limit);
  }

  // Initialize seed data
  async initializeSeedData() {
    // Check if we already have data
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Database already seeded with data, skipping initialization");
      return;
    }

    console.log("Initializing database with seed data");

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
    
    for (const content of sampleAccusations) {
      await this.createAccusation({
        content,
        isCustom: false,
        createdBy: null
      });
    }
    
    // Add sample characters
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
    
    for (const character of sampleCharacters) {
      await this.createCharacter({
        ...character,
        userId: null
      });
    }
  }
}