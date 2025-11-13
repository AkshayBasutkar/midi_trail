import { z } from "zod";
export declare const users: any;
export declare const insertUserSchema: any;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
//# sourceMappingURL=schema.d.ts.map