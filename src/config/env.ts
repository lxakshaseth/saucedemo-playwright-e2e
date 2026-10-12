import { z } from 'zod';

const envSchema = z.object({
  PASSWORD: z.string().min(1, 'PASSWORD is required'),
  DASHBOARD_URL: z.string().min(1, 'DASHBOARD_URL is required'),
  TOKEN_EP: z.string().min(1, 'TOKEN_EP is required'),
  DASHBOARD_PICTURE_URL: z.string().min(1, 'DASHBOARD_PICTURE_URL is required'),
  ABOUT_URL: z.string().url('ABOUT_URL must be a valid URL'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `Environment validation failed:\n${formattedErrors}\n\n` +
        'See .env.example for reference.'
    );
  }

  return result.data;
}

let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

export const env = {
  get PASSWORD() {
    return getEnv().PASSWORD;
  },
  get DASHBOARD_URL() {
    return getEnv().DASHBOARD_URL;
  },
  get TOKEN_EP() {
    return getEnv().TOKEN_EP;
  },
  get DASHBOARD_PICTURE_URL() {
    return getEnv().DASHBOARD_PICTURE_URL;
  },
  get ABOUT_URL() {
    return getEnv().ABOUT_URL;
  },
};