import { describe, expect, it } from "vitest";
import { createBlogPost } from "./blog-post.js";

describe("createBlogPost", () => {
  it("creates expected dated post path and njk body", () => {
    const post = createBlogPost({
      video: {
        id: "upload-123",
        title: "My Great Video",
        originalName: "My Great Video.mp4",
        mimeType: "video/mp4",
        createdTime: "2026-05-16T14:30:00.000Z",
        bytes: new ArrayBuffer(4),
      },
      streamVideo: {
        uid: "stream-123",
        embedHtml: "<iframe src=\"https://iframe.videodelivery.net/stream-123\"></iframe>",
      },
      authorName: "Video Bot",
    });

    expect(post.path).toBe("posts/2026-05-16/my-great-video/index.njk");
    expect(post.body).toContain('title: "My Great Video"');
    expect(post.body).toContain('sourceUploadId: "upload-123"');
    expect(post.body).toContain('cloudflareStreamUid: "stream-123"');
    expect(post.body).toContain("<iframe");
  });
});
