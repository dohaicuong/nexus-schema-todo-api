import { connectionPlugin, makeSchema } from '@nexus/schema'
import { join } from 'path'

import * as typeDefs from './types'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'

export const schema = makeSchema({
  types: typeDefs,
  plugins: [nexusSchemaPrisma(), connectionPlugin()],
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  typegenAutoConfig: {
    contextType: 'ContextModule.Context',
    sources: [
      {
        source: require.resolve(join(__dirname, 'apollo', 'context')),
        alias: 'ContextModule',
      },
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
