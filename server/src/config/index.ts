import { z } from "zod";

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string().default("travel-journal"),
  PORT: z.int().default(8000),
  AUTH_BASE_URL: z.string().default("http://localhost:3000"),
  CLIENT_BASE_URL: z.string().default("http://localhost:5173"),
  ACCESS_JWT_SECRET: z
    .string({
      error:
        "ACCESS_JWT_SECRET is required and must be at least 64 characters long",
    })
    .min(64),
  SALT_ROUNDS: z.coerce.number().int().default(12),
  ACCESS_TOKEN_TTL: z.coerce.number().int().default(60 * 15), // 15 minutes
  REFRESH_TOKEN_TTL: z.coerce.number().int().default(60 * 60 * 24 * 7), // 7 days
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    z.prettifyError(parsedEnv.error),
  );
  process.exit(1);
}

export const {
  ACCESS_JWT_SECRET,
  DB_NAME,
  MONGO_URI,
  PORT,
  CLIENT_BASE_URL,
  AUTH_BASE_URL,
  SALT_ROUNDS,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
} = parsedEnv.data;
