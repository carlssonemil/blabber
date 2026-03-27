# Blabber
## Anonymous real-time chat application

Built with [Node](https://nodejs.org/en/), [Express](https://expressjs.com/), [Socket.io](https://socket.io/) & [Vue](https://vuejs.org/). Front-end hosted on [Vercel](https://vercel.com/) and API hosted on [Render](https://render.com/) (required for persistent WebSocket connections).

> **Privacy note:** Blabber itself stores nothing — no logs, no message history, no user data. However, the API is hosted on Render, a US-based provider that may log network traffic (IP addresses, connection metadata) at the infrastructure level. See the [Privacy Policy](https://blabber.emca.app/privacy) for details.

## Features

- Real-time messaging
- Completely anonymous
- Attach and download files
- Video & audio embedding
- Image embedding
- Send invitation to current room

## Build setup

```bash
# Install dependencies
$ npm install

# Compiles and hot-reloads for development
$ npm run dev

# Compiles and minifies for production
$ npm run build
```

## License

Code released under the [MIT License](https://github.com/carlssonemil/blabber/blob/master/LICENSE).