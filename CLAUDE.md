# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Start Vite dev server (port 5173) + Express API (port 5000) concurrently
npm run build   # Build Vue frontend for production
npm run lint    # Run ESLint
```

No test suite exists in this project.

## Architecture

Blabber is an anonymous real-time chat app with a Vue 3 SPA frontend and a Node.js/Express + Socket.io backend. There is no database — all state is in-memory and ephemeral.

**Frontend** (`src/`): Vue 3 SPA using Vue Router and Pinia. Socket.io client is initialized in `src/plugins/socket.js` and connected to the backend. User session (username, room) is stored in Pinia and persisted to `localStorage` under the key `'blabber'`. Routes are lazy-loaded.

**Backend** (`api/`): Express server with Socket.io. `api/index.js` handles all socket events (`join`, `message`, `typing`, `leave`, `disconnect`) and a `POST /upload` route that proxies file uploads to uguu.se. State is an in-memory users array. Messages flow through `formatMessage()` → URL detection → async oEmbed fetch → broadcast to room.

**Message types**: `message`, `attachment`, `notice`, `oembed` — all rendered in `src/components/Messages.vue`.

**SCSS**: Global variables and mixins (`src/scss/abstracts/`) are auto-prepended to every component via `vite.config.mjs`. Use `@include mobile` for responsive breakpoints.

## Deployment

- Frontend: Vercel (static SPA) at `blabber.emca.app` — set `VITE_API_URL` env var to the Render API URL
- API: Render (required for persistent WebSocket support) — entry point is `api/index.js`, configured via `render.yaml`
- Socket.io endpoint is controlled by `VITE_API_URL` env var (falls back to `localhost:5000` in dev)
- Node.js version is pinned to 22 via `.node-version`
