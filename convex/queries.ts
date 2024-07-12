import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const totalUsersCount = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.length;
  },
});

export const userByTelegramId = query({
  args: {
    tgUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
      .first();
  },
});

export const topTenUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const totalUsers = users.length;
    const topTenUsers = users.sort((a, b) => b.points - a.points).slice(0, 10);
    return { topTenUsers, totalUsers };
  },
});

export const invitees = query({
  args: {
    tgUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const invitees = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("refId"), args.tgUserId))
      .collect();
    return invitees;
  },
});

export const userExists = query({
  args: {
    tgUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
      .first();
    return !!user;
  },
});

export const newUser = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    tgUserId: v.string(),
    refId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
      .unique();

    if (user !== null) {
      if (
        user.firstName !== args.firstName ||
        user.lastName !== args.lastName
      ) {
        await ctx.db.patch(user._id, {
          firstName: args.firstName,
          lastName: args.lastName,
        });
      }
      return { id: user._id, existingUser: true };
    }

    const id = await ctx.db.insert("users", {
      firstName: args.firstName,
      lastName: args.lastName,
      tgUserId: args.tgUserId,
      refId: args.refId || "",
      points: 0,
      level: "Bronze", 
    });

    return { id, existingUser: false };
  },
});

export const updateUserPoints = mutation({
  args: {
    tgUserId: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tgUserId"), args.tgUserId))
      .unique();

    if (user === null) {
      throw new Error("User not found");
    }

    await ctx.db.table("users").update(user._id, {
      points: args.points,
    });
  },
});
    const levels = [
      { name: "Bronze", minPoints: 0 },
      { name: "Silver", minPoints: 5000 },
      { name: "Gold", minPoints: 25000 },
      { name: "Platinum", minPoints: 100000 },
      { name: "Diamond", minPoints: 1000000 },
      { name: "Epic", minPoints: 2000000 },
      { name: "Legendary", minPoints: 10000000 },
      { name: "Master", minPoints: 50000000 },
      { name: "GrandMaster", minPoints: 100000000 },
      { name: "Lord", minPoints: 1000000000 }
    ];

    const newLevel = levels.find(level => args.points >= level.minPoints)?.name;

    if (user.points < args.points) {
      await ctx.db.patch(user._id, { points: args.points, level: newLevel });
    }
  },
});