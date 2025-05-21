import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce
    .number()
    .min(1, { message: "PORT must be between 1 and 65535" })
    .max(65535)
    .default(4323),
  HOST: z.string().nonempty().default("localhost"),
  JOB_APP_API_URL: z
    .string()
    .url({ message: "JOB_APP_API_URL must be a valid URL" })
    .nonempty({ message: "JOB_APP_API_URL cannot be empty" }),
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
