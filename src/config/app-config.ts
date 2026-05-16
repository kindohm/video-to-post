import dotenv from "dotenv";

export type AppConfig = {
  port: number;
  publicBaseUrl: string;
  uploadSecret: string;
  uploadTempDir: string;
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  blogRepoUrl: string;
  blogRepoDir: string;
  blogAuthorName: string;
  blogAuthorEmail: string;
};

const required = (name: string, env: NodeJS.ProcessEnv) => {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const loadAppConfig = (env = process.env): AppConfig => {
  dotenv.config({ path: env.ENV_FILE ?? ".env", quiet: true });

  return {
    port: Number(env.PORT ?? 3000),
    publicBaseUrl: required("PUBLIC_BASE_URL", env),
    uploadSecret: required("UPLOAD_SECRET", env),
    uploadTempDir: env.UPLOAD_TEMP_DIR ?? "./data/uploads",
    cloudflareAccountId: required("CLOUDFLARE_ACCOUNT_ID", env),
    cloudflareApiToken: required("CLOUDFLARE_API_TOKEN", env),
    blogRepoUrl: required("BLOG_REPO_URL", env),
    blogRepoDir: required("BLOG_REPO_DIR", env),
    blogAuthorName: env.BLOG_AUTHOR_NAME ?? "Video Bot",
    blogAuthorEmail: env.BLOG_AUTHOR_EMAIL ?? "video-bot@example.com",
  };
};
