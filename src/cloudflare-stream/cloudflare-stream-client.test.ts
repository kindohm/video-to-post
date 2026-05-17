import { afterEach, describe, expect, it, vi } from "vitest";
import { createCloudflareStreamClient } from "./cloudflare-stream-client.js";

describe("createCloudflareStreamClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("generates dashboard-style iframe embed html from video thumbnail details", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          result: { uid: "stream-123" },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          result: {
            thumbnail: "https://customer-code.cloudflarestream.com/stream-123/thumbnails/thumbnail.jpg?time=&height=600",
          },
        }),
      );

    vi.stubGlobal("fetch", fetch);

    await expect(
      createCloudflareStreamClient({ accountId: "account-123", apiToken: "token-123" }).uploadVideo({
        id: "upload-123",
        title: "Video",
        originalName: "video.mp4",
        mimeType: "video/mp4",
        createdTime: "2026-05-16T23:26:00.000Z",
        bytes: new ArrayBuffer(4),
      }),
    ).resolves.toEqual({
      uid: "stream-123",
      embedHtml: `<div style="position: relative; padding-top: 56.25%;">
  <iframe
    src="https://customer-code.cloudflarestream.com/stream-123/iframe?poster=https%3A%2F%2Fcustomer-code.cloudflarestream.com%2Fstream-123%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
    loading="lazy"
    style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>
</div>`,
    });
  });
});
