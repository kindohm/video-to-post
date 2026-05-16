import type { UploadedVideo } from "../upload/uploaded-video.js";

export type CloudflareStreamConfig = {
  accountId: string;
  apiToken: string;
};

export type StreamVideo = {
  uid: string;
  embedHtml: string;
};

export type CloudflareStreamClient = {
  uploadVideo: (video: UploadedVideo) => Promise<StreamVideo>;
};

type CloudflareUploadResponse = {
  success: boolean;
  errors?: { message: string }[];
  result?: {
    uid?: string;
  };
};

type CloudflareEmbedResponse = {
  success: boolean;
  errors?: { message: string }[];
  result?: string;
};

const cloudflareJson = async <T>(response: Response): Promise<T> => {
  const body = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(`Cloudflare API request failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
};

const cloudflareError = (errors?: { message: string }[]) => errors?.map((error) => error.message).join("; ") ?? "unknown error";

export const createCloudflareStreamClient = (config: CloudflareStreamConfig): CloudflareStreamClient => ({
  uploadVideo: async (video) => {
    const form = new FormData();
    form.append("file", new Blob([video.bytes], { type: video.mimeType }), video.originalName);

    const upload = await cloudflareJson<CloudflareUploadResponse>(
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/stream`, {
        method: "POST",
        headers: { authorization: `Bearer ${config.apiToken}` },
        body: form,
      }),
    );

    const uid = upload.result?.uid;

    if (!upload.success || !uid) {
      throw new Error(`Cloudflare Stream upload failed: ${cloudflareError(upload.errors)}`);
    }

    const embed = await cloudflareJson<CloudflareEmbedResponse>(
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/stream/${uid}/embed`, {
        headers: { authorization: `Bearer ${config.apiToken}` },
      }),
    );

    if (!embed.success || !embed.result) {
      throw new Error(`Cloudflare Stream embed lookup failed: ${cloudflareError(embed.errors)}`);
    }

    return { uid, embedHtml: embed.result };
  },
});
