# Travels

A travel blog built with [Quartz v5](https://quartz.jzhao.xyz) and hosted on GitHub Pages at https://vendoob.github.io/travels.

## Layout

```
content/
  index.md                       home page
  trips/
    index.md                     all trips
    2026-east-africa/
      index.md                   trip overview
      images/                    processed photos for this trip
      kenya/ safari/ zanzibar/   optional region folders, each with an index.md
  templates/trip-post.md         copy this to start a post (not published)
```

Tags are for themes across trips (`food`, `wildlife`, `logistics`, country names). Keep post filenames unique across the whole site, because links use shortest-path resolution.

## Writing a post

1. Copy `content/templates/trip-post.md` into the right folder and rename it.
2. Remove `draft: true` when it's ready.
3. Commit and push to `main`; GitHub Actions builds and deploys.

## Photos

Never commit originals. Put them somewhere outside the repo (or in an `originals/` folder, which is git-ignored) and run:

```bash
npm run photos -- ~/originals/safari content/trips/2026-east-africa/images
```

This resizes to 1600 px and strips all metadata, including GPS. `npm run check:photos` verifies the repo, and the same check runs on every commit and every deploy.

## Local preview

```bash
npm ci
npx quartz plugin install
npx quartz build --serve   # http://localhost:8080
```
