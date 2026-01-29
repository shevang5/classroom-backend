import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db/index.js"; // your drizzle instance
import * as schema from "../db/schema/auth.js";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:8000",
    trustedOrigins: [process.env.FRONTEND_URL!, "http://localhost:8000"],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        disableCSRFCheck: process.env.NODE_ENV !== "production",
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "student",
                input: true, // Allow role to be set during registration
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true, // Allow imageCldPubId to be set during registration
            },
        },
    },
});