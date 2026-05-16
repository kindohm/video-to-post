export const uploadPage = (token: string) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Video Upload</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #16130f;
      --paper: #f7f0df;
      --accent: #0f766e;
      --line: #2a241933;
      --danger: #9f1239;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100svh;
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
      color: var(--ink);
      background:
        linear-gradient(135deg, #f7f0df 0%, #fff9ec 52%, #dce8df 100%);
      display: grid;
      place-items: center;
      padding: 20px;
    }

    main {
      width: min(100%, 520px);
      border: 1px solid var(--line);
      background: #fffaf0cc;
      backdrop-filter: blur(14px);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 24px 70px #2a241924;
    }

    h1 {
      margin: 0 0 18px;
      font-size: clamp(2rem, 11vw, 4.8rem);
      line-height: .84;
      letter-spacing: 0;
      max-width: 8ch;
    }

    label {
      display: block;
      font-size: .82rem;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin: 18px 0 8px;
    }

    input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 13px 12px;
      background: #fffdf8;
      color: var(--ink);
      font: inherit;
    }

    input[type="file"] {
      padding: 10px;
    }

    button {
      width: 100%;
      margin-top: 22px;
      border: 0;
      border-radius: 6px;
      padding: 15px 18px;
      background: var(--accent);
      color: white;
      font: 700 1rem ui-sans-serif, system-ui, sans-serif;
    }

    p {
      margin: 14px 0 0;
      color: #514a3d;
      font: .95rem ui-sans-serif, system-ui, sans-serif;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <main>
    <h1>Send video.</h1>
    <form method="post" action="/upload?token=${encodeURIComponent(token)}" enctype="multipart/form-data">
      <label for="title">Title</label>
      <input id="title" name="title" autocomplete="off" placeholder="Morning bench demo" />
      <label for="video">MP4</label>
      <input id="video" name="video" type="file" accept="video/mp4,video/*" required />
      <button type="submit">Upload</button>
    </form>
    <p>Android Share can post same endpoint with multipart field <strong>video</strong>.</p>
  </main>
</body>
</html>`;
