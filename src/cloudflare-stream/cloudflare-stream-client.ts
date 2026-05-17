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

type CloudflareVideoDetailsResponse = {
  success: boolean;
  errors?: { message: string }[];
  result?: {
    thumbnail?: string;
  };
};

const cloudflareJson = async <T>(response: Response): Promise<T> => {
  const body = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(`Cloudflare API request failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
};

const cloudflareError = (errors?: { message: string }[]) => errors?.map((error) => error.message).join("; ") ?? "unknown error";

const createIframeEmbedHtml = (input: { uid: string; thumbnailUrl: string }) => {
  const thumbnail = new URL(input.thumbnailUrl);
  const iframeUrl = new URL(`${thumbnail.origin}/${input.uid}/iframe`);
  iframeUrl.searchParams.set("poster", input.thumbnailUrl);

  return `<div style="position: relative; padding-top: 56.25%;">
  <iframe
    src="${iframeUrl.toString()}"
    loading="lazy"
    style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>
</div>`;
};

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

    const details = await cloudflareJson<CloudflareVideoDetailsResponse>(
      await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/stream/${uid}`, {
        headers: { authorization: `Bearer ${config.apiToken}` },
      }),
    );

    if (!details.success || !details.result?.thumbnail) {
      throw new Error(`Cloudflare Stream video details lookup failed: ${cloudflareError(details.errors)}`);
    }

    return { uid, embedHtml: createIframeEmbedHtml({ uid, thumbnailUrl: details.result.thumbnail }) };
  },
});
