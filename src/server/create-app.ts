import express from "express";
import { mkdir, readFile, unlink } from "node:fs/promises";
import { extname } from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import type { AppConfig } from "../config/app-config.js";
import type { ProcessUploadedVideoDeps } from "../pipeline/process-uploaded-video.js";
import { processUploadedVideo } from "../pipeline/process-uploaded-video.js";
import { uploadPage } from "./upload-page.js";

const tokenFromRequest = (request: express.Request) => request.header("x-upload-secret") ?? request.query.token;

const titleFromUpload = (title: unknown, filename: string) => {
  if (typeof title === "string" && title.trim()) {
    return title.trim();
  }

  return filename.replace(extname(filename), "").trim() || "Video";
};

export const createApp = (config: Pick<AppConfig, "uploadSecret" | "uploadTempDir">, deps: ProcessUploadedVideoDeps) => {
  const app = express();
  const upload = multer({ dest: config.uploadTempDir });
  app.use(express.json());

  app.get("/healthz", (_request, response) => {
    response.json({ ok: true });
  });

  app.get("/upload", (request, response) => {
    const token = tokenFromRequest(request);

    if (token !== config.uploadSecret) {
      response.status(401).send("Invalid upload token");
      return;
    }

    response.type("html").send(uploadPage(config.uploadSecret));
  });

  app.post("/upload", async (request, response, next) => {
    try {
      const token = tokenFromRequest(request);

      if (token !== config.uploadSecret) {
        response.status(401).json({ error: "Invalid upload token" });
        return;
      }

      await mkdir(config.uploadTempDir, { recursive: true });

      upload.single("video")(request, response, async (error) => {
        if (error) {
          next(error);
          return;
        }

        try {
          if (!request.file) {
            response.status(400).json({ error: "Missing video file field: video" });
            return;
          }

          if (!request.file.mimetype.startsWith("video/")) {
            await unlink(request.file.path);
            response.status(400).json({ error: "Uploaded file must be a video" });
            return;
          }

          const bytes = await readFile(request.file.path);
          await unlink(request.file.path);

          response.json(
            await processUploadedVideo(
              {
                id: crypto.randomUUID(),
                title: titleFromUpload(request.body.title, request.file.originalname),
                originalName: request.file.originalname,
                mimeType: request.file.mimetype,
                createdTime: new Date().toISOString(),
                bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
              },
              deps,
            ),
          );
        } catch (innerError) {
          next(innerError);
        }
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    response.status(500).json({ error: message });
  });

  return app;
};
