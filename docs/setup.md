# Setup

This app receives an MP4 upload from Android, uploads it to Cloudflare Stream, writes `posts/<YYYY-MM-DD>-<video-title>/index.md` in your blog repo, commits, and pushes.

## Local prerequisites

- Node.js `24.13.0`
- Git SSH access to your blog repo from local machine and droplet
- Public HTTPS URL for the deployed app: `https://your-domain.example`

## `.env`

Fill values in `.env`.

```dotenv
PORT=3000
PUBLIC_BASE_URL=https://your-domain.example
UPLOAD_SECRET=make-a-long-random-string
UPLOAD_TEMP_DIR=./data/uploads

CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

BLOG_REPO_URL=git@github.com:your-user/your-blog.git
BLOG_REPO_DIR=./blog-repo
BLOG_AUTHOR_NAME=Video Bot
BLOG_AUTHOR_EMAIL=video-bot@example.com
```

## Upload secret

Set `UPLOAD_SECRET` to a long random string. The mobile upload page is:

```text
https://your-domain.example/upload?token=<UPLOAD_SECRET>
```

Android HTTP Shortcuts can also `POST` multipart form data to same URL. Use field name `video` for file and optional field `title` for post title.

## Android upload

Simplest path:

1. Open `https://your-domain.example/upload?token=<UPLOAD_SECRET>` on Android.
2. Add it to home screen.
3. Tap page, choose MP4, add title, upload.

Share-menu path with [HTTP Shortcuts](https://http-shortcuts.rmy.ch/):

1. Install HTTP Shortcuts from Play Store or F-Droid.
2. Create shortcut.
3. Method: `POST`.
4. URL: `https://your-domain.example/upload?token=<UPLOAD_SECRET>`.
5. Body type: multipart/form-data.
6. Add file parameter named `video`.
7. Add optional text parameter named `title`.
8. Enable Android share integration for the shortcut.

Then record video, tap Share, choose shortcut, send.

## Cloudflare keys

1. Go to [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Select account.
3. Copy account ID from account home page URL/sidebar into `CLOUDFLARE_ACCOUNT_ID`.
4. Go to **My Profile > API Tokens**.
5. Create token with Stream edit/write permission for target account.
6. Copy token into `CLOUDFLARE_API_TOKEN`.

The app uploads to Cloudflare Stream and asks Cloudflare for embed HTML.

## Blog repo keys

Set:

```dotenv
BLOG_REPO_URL=git@github.com:your-user/your-blog.git
BLOG_REPO_DIR=./blog-repo
```

Make sure machine running app has SSH key that can clone, pull, and push that repo.

## References

- [Cloudflare Stream upload](https://developers.cloudflare.com/stream/uploading-videos/)
- [Cloudflare Stream embed API](https://developers.cloudflare.com/api/resources/stream/subresources/embed/)

## Verification

Project rule: do not manually start app for behavior verification. Use:

```bash
npm test
npm run build
```
