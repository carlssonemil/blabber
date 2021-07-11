# Blabber
## Anonymous real-time chat application

Built with [Node](https://nodejs.org/en/), [Express](https://expressjs.com/), [Socket.io](https://socket.io/) & [Vue](https://vuejs.org/). Front-end hosted on [Vercel](https://vercel.com/) and API hosted on [Heroku](https://www.heroku.com/)*. 

###### (* since [Vercel does not currently support WebSocket connections through their Serverless Functions](https://vercel.com/support/articles/do-vercel-serverless-functions-support-websocket-connections))

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
$ npm run serve

# Compiles and minifies for production
$ npm run build
```

## License

Code released under the [MIT License](https://github.com/carlssonemil/blabber/blob/master/LICENSE).