import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce
    .number()
    .min(1, { message: "PORT must be between 1 and 65535" })
    .max(65535)
    .default(4323),
  HOST: z.string().nonempty().default("localhost"),
  DATABASE_URL: z
    .string()
    .nonempty({ message: "DATABASE_URL cannot be empty" }),

  JWT_SECRET: z
    .string()
    .min(32, { message: "JWT_SECRET must be at least 32 characters" }),

  ALLOWED_ORIGINS: z
    .string()
    .default("")
    .transform((origins) =>
      origins
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .pipe(
      z.array(z.string().url({ message: "Each origin must be a valid URL" }))
    ),
});

export type Env = z.infer<typeof EnvSchema>;

const result = EnvSchema.safeParse(Bun.env);
if (!result.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

const env: Env = result.data;
export default env!;
