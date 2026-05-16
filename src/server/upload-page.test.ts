import { describe, expect, it } from "vitest";
import { uploadPage } from "./upload-page.js";

describe("uploadPage", () => {
  it("renders mobile upload form pointed at tokenized upload endpoint", () => {
    const html = uploadPage("sekret value");

    expect(html).toContain("Send video.");
    expect(html).toContain('method="post"');
    expect(html).toContain('enctype="multipart/form-data"');
    expect(html).toContain('name="title"');
    expect(html).toContain('name="video"');
    expect(html).toContain("/upload?token=sekret%20value");
  });
});
