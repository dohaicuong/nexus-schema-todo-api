import { server } from './apollo'

server
  .listen({ port: 4000 })
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
