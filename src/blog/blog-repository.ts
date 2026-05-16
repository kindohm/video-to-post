import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { BlogPost } from "./blog-post.js";

export type BlogRepositoryConfig = {
  repoUrl: string;
  repoDir: string;
  authorName: string;
  authorEmail: string;
};

export type RunGit = (args: string[], options?: { cwd?: string }) => Promise<void>;

export type BlogRepository = {
  publishPost: (post: BlogPost) => Promise<void>;
};

const execFileAsync = promisify(execFile);

export const runGitCommand: RunGit = async (args, options) => {
  await execFileAsync("git", args, options);
};

export const createBlogRepository = (config: BlogRepositoryConfig, runGit: RunGit = runGitCommand): BlogRepository => ({
  publishPost: async (post) => {
    await mkdir(dirname(config.repoDir), { recursive: true });

    try {
      await runGit(["-C", config.repoDir, "status", "--short"]);
      await runGit(["pull", "--ff-only"], { cwd: config.repoDir });
    } catch {
      await runGit(["clone", config.repoUrl, config.repoDir]);
    }

    await runGit(["config", "user.name", config.authorName], { cwd: config.repoDir });
    await runGit(["config", "user.email", config.authorEmail], { cwd: config.repoDir });

    const fullPath = join(config.repoDir, post.path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, post.body, "utf8");

    await runGit(["add", post.path], { cwd: config.repoDir });
    await runGit(["commit", "-m", `Add video post: ${post.title}`], { cwd: config.repoDir });
    await runGit(["push"], { cwd: config.repoDir });
  },
});
