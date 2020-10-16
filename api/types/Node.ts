import { extendType, idArg, interfaceType } from '@nexus/schema'
import { fromGlobalId, toGlobalId } from 'graphql-relay'

export const Node = interfaceType({
  name: 'Node',
  definition: (t) => {
    t.id('id', {
      description: 'Relay Node Id',
      nullable: false,
      // @ts-ignore
      resolve: ({ id }, __, ___, { parentType }) => {
        return toGlobalId(parentType.name, id)
      },
    })

    t.resolveType((node) => {
      // @ts-ignore
      return node.type
    })
  },
})

export const NodeQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('node', {
      type: 'Node',
      args: { id: idArg({ required: true }) },
      resolve: async (_, args, { db }) => {
        const { id, type, prismaObject } = decodeGlobalId(args.id)
        // @ts-ignore
        const node = await db[prismaObject].findOne({ where: { id } })
        return {
          ...node,
          type,
        }
      },
    })
  },
})

export const NodesQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('nodes', {
      type: 'Node',
      list: true,
      args: {
        ids: idArg({ list: [true], required: true }),
      },
      // @ts-ignore
      resolve: (_, args, { db }) => {
        return args.ids.map(async (globalId) => {
          const { id, type, prismaObject } = decodeGlobalId(globalId)
          // @ts-ignore
          const node = await db[prismaObject].findOne({ where: { id } })
          return {
            ...node,
            type,
          }
        })
      },
    })
  },
})

/*
 * HELPERS
 */
export const decodeGlobalId = (
  globalId: string,
): { id: string; type: string; prismaObject: string } => {
  const { type, id } = fromGlobalId(globalId)
  const prismaObject = type.charAt(0).toLowerCase() + type.slice(1)
  return { id, type, prismaObject }
}
