import type { StreamVideo } from "../cloudflare-stream/cloudflare-stream-client.js";
import type { UploadedVideo } from "../upload/uploaded-video.js";

export type BlogPost = {
  path: string;
  title: string;
  body: string;
};

const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "video";
};

const datePath = (isoDate: string) => isoDate.slice(0, 10);

export const createBlogPost = (input: { video: UploadedVideo; streamVideo: StreamVideo; authorName: string }): BlogPost => {
  const title = input.video.title.trim() || input.video.originalName.replace(/\.mp4$/i, "").trim();
  const date = datePath(input.video.createdTime);
  const slug = slugify(title);

  return {
    path: `posts/${date}/${slug}/index.njk`,
    title,
    body: `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
sourceUploadId: "${input.video.id}"
sourceVideoFileName: "${input.video.originalName.replace(/"/g, '\\"')}"
cloudflareStreamUid: "${input.streamVideo.uid}"
author: "${input.authorName.replace(/"/g, '\\"')}"
---

${input.streamVideo.embedHtml}
`,
  };
};
