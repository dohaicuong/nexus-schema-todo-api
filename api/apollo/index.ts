import { ApolloServer } from 'apollo-server'
import { loggingPlugin } from './plugins/logging'

import { schema } from '../schema'
import { createContext } from './context'

export const server = new ApolloServer({
  schema,
  context: createContext,
  plugins: [
    loggingPlugin({
      ignoreIntrospectionquery: true,
    }),
  ],
})