import { afterEach, describe, expect, it, vi } from "vitest";
import { createCloudflareStreamClient } from "./cloudflare-stream-client.js";

describe("createCloudflareStreamClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads Cloudflare embed response as html instead of json", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          result: { uid: "stream-123" },
        }),
      )
      .mockResolvedValueOnce(new Response('<stream src="stream-123"></stream>', { status: 200 }));

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
      embedHtml: '<stream src="stream-123"></stream>',
    });
  });
});
