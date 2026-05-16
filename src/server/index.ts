import { createBlogRepository } from "../blog/blog-repository.js";
import { createCloudflareStreamClient } from "../cloudflare-stream/cloudflare-stream-client.js";
import { loadAppConfig } from "../config/app-config.js";
import { createApp } from "./create-app.js";

const config = loadAppConfig();

const app = createApp(config, {
  stream: createCloudflareStreamClient({
    accountId: config.cloudflareAccountId,
    apiToken: config.cloudflareApiToken,
  }),
  blog: createBlogRepository({
    repoUrl: config.blogRepoUrl,
    repoDir: config.blogRepoDir,
    authorName: config.blogAuthorName,
    authorEmail: config.blogAuthorEmail,
  }),
  authorName: config.blogAuthorName,
});

app.listen(config.port, () => {
  console.log(`video-to-post listening on ${config.port}`);
});
