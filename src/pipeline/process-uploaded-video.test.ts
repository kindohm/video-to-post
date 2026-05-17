import { describe, expect, it, vi } from "vitest";
import { processUploadedVideo } from "./process-uploaded-video.js";

describe("processUploadedVideo", () => {
  it("uploads video, publishes post, and returns useful ids", async () => {
    const stream = {
      uploadVideo: vi.fn(async () => ({ uid: "stream-123", embedHtml: "<iframe></iframe>" })),
    };
    const blog = {
      publishPost: vi.fn(async () => undefined),
    };

    await expect(
      processUploadedVideo(
        {
          id: "upload-123",
          title: "Pocket Field Note",
          originalName: "VID_20260516.mp4",
          mimeType: "video/mp4",
          createdTime: "2026-05-16T15:00:00.000Z",
          bytes: new ArrayBuffer(4),
        },
        { stream, blog, authorName: "Video Bot" },
      ),
    ).resolves.toEqual({
      status: "processed",
      uploadId: "upload-123",
      postPath: "posts/2026-05-16-pocket-field-note/index.md",
      streamUid: "stream-123",
    });

    expect(stream.uploadVideo).toHaveBeenCalledWith(expect.objectContaining({ id: "upload-123" }));
    expect(blog.publishPost).toHaveBeenCalledWith(expect.objectContaining({ path: "posts/2026-05-16-pocket-field-note/index.md" }));
  });
});
