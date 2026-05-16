This app is a node.js app, built in typescript, that
runs on a DigitalOcean droplet. It is called by an Android
shortcut that uploads a mp4 video, then uploads the video to Cloudflare's 
embedded streaming feature, then creates a blog
post in a personal git repository with the embed code. 

# Skills

- mike style
- caveman

# Important

Always use unit tests to verify system behavior.
Never run the application manually to verify anything.

# Architecture

Code base:

- nodejs
- nvm (use version 24.13.0)
- express
- typescript
- a unit test runner, such as Jest or Vite

3rd party:

- Cloudflare streaming video hosting/embed

Hosting:

- DigitalOcean Ubuntu droplet
- nginx

Deployment:

- github action
- copies files to host over ssh

# User workflow

- I record a mp4 video on my phone
- The Android app has a shortcut that allows me to share the mp4 file to this application over HTTP
- This application reads the mp4 video data
- This application sends the mp4 video data to Cloudflare for their embedded streaming feature
- This application reads the embed code for the Cloudflare video
- This application creates a new blog post in a different git repository, using the embed code as content


# Author remarks

Aside from knowing how to write a nodejs express app,
I do not know how to implement any of this. I am not
familiar with Google or Cloudflare APIs or SDKs.
