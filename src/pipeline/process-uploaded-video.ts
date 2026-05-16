import type { BlogRepository } from "../blog/blog-repository.js";
import { createBlogPost } from "../blog/blog-post.js";
import type { CloudflareStreamClient } from "../cloudflare-stream/cloudflare-stream-client.js";
import type { UploadedVideo } from "../upload/uploaded-video.js";

export type ProcessUploadedVideoResult = {
  status: "processed";
  uploadId: string;
  postPath: string;
  streamUid: string;
};

export type ProcessUploadedVideoDeps = {
  stream: CloudflareStreamClient;
  blog: BlogRepository;
  authorName: string;
};

export const processUploadedVideo = async (video: UploadedVideo, deps: ProcessUploadedVideoDeps): Promise<ProcessUploadedVideoResult> => {
  const streamVideo = await deps.stream.uploadVideo(video);
  const post = createBlogPost({ video, streamVideo, authorName: deps.authorName });

  await deps.blog.publishPost(post);

  return { status: "processed", uploadId: video.id, postPath: post.path, streamUid: streamVideo.uid };
};
