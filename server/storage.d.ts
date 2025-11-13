import { type User, type InsertUser } from "@shared/schema";
export interface IStorage {
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
}
export declare class MemStorage implements IStorage {
    private users;
    currentId: number;
    constructor();
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(insertUser: InsertUser): Promise<User>;
}
export declare const storage: MemStorage;
//# sourceMappingURL=storage.d.ts.map