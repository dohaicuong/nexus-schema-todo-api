import { arg, extendType, inputObjectType, objectType } from '@nexus/schema'
import { connectionFromPromisedArray, fromGlobalId } from 'graphql-relay'

export const TodoItem = objectType({
  name: 'TodoItem',
  definition: (t) => {
    // t.model.id()
    t.implements('Node')
    t.model.content()
    t.model.isDone()
  },
})

export const TodoItemQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.connectionField('todos', {
      type: 'TodoItem',
      resolve: (_root, args, ctx) => {
        return connectionFromPromisedArray(
          ctx.db.todoItem.findMany(),
          args,
        ) as any
      },
    })
  },
})

export const TodoItemCreateInput = inputObjectType({
  name: 'TodoItemCreateInput',
  definition: (t) => {
    t.string('content', { required: true })
  },
})
export const TodoItemCreatePayload = objectType({
  name: 'TodoItemCreatePayload',
  definition: (t) => {
    t.field('todoItem', { type: 'TodoItem' })
  },
})
export const TodoItemCreateMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('todoItemCreate', {
      type: 'TodoItemCreatePayload',
      nullable: false,
      args: {
        input: arg({
          type: 'TodoItemCreateInput',
          required: true,
        }),
      },
      resolve: async (_root, { input }, { db }) => {
        const newItem = await db.todoItem.create({
          data: {
            content: input.content,
          },
        })

        return {
          todoItem: newItem,
        }
      },
    })
  },
})

export const TodoItemDeleteInput = inputObjectType({
  name: 'TodoItemDeleteInput',
  definition: (t) => {
    t.id('id', { required: true })
  },
})
export const TodoItemDeletePayload = objectType({
  name: 'TodoItemDeletePayload',
  definition: (t) => {
    t.id('deletedItemId')
    t.field('todoItem', { type: 'TodoItem' })
  },
})
export const TodoItemDeleteMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('todoItemDelete', {
      type: 'TodoItemDeletePayload',
      nullable: false,
      args: {
        input: arg({
          type: 'TodoItemDeleteInput',
          required: true,
        }),
      },
      resolve: async (_root, { input }, { db }) => {
        const { id } = fromGlobalId(input.id)
        const deletedItem = await db.todoItem.delete({ where: { id } })

        return {
          deletedItemId: input.id,
          todoItem: deletedItem,
        }
      },
    })
  },
})

export const TodoItemDoneInput = inputObjectType({
  name: 'TodoItemDoneInput',
  definition: (t) => {
    t.id('id', { required: true })
  },
})
export const TodoItemDonePayload = objectType({
  name: 'TodoItemDonePayload',
  definition: (t) => {
    t.field('todoItem', { type: 'TodoItem' })
  },
})
export const TodoItemDoneMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('todoItemDone', {
      type: 'TodoItemDonePayload',
      nullable: false,
      args: {
        input: arg({
          type: 'TodoItemDoneInput',
          required: true,
        }),
      },
      resolve: async (_root, { input }, { db }) => {
        const { id } = fromGlobalId(input.id)

        const updatedItem = db.todoItem.update({
          where: { id },
          data: {
            isDone: true,
          },
        })

        return {
          todoItem: updatedItem,
        }
      },
    })
  },
})

export const TodoItemUndoneInput = inputObjectType({
  name: 'TodoItemUndoneInput',
  definition: (t) => {
    t.id('id', { required: true })
  },
})
export const TodoItemUndonePayload = objectType({
  name: 'TodoItemUndonePayload',
  definition: (t) => {
    t.field('todoItem', { type: 'TodoItem' })
  },
})
export const TodoItemUndoneMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('todoItemUndone', {
      type: 'TodoItemUndonePayload',
      nullable: false,
      args: {
        input: arg({
          type: 'TodoItemUndoneInput',
          required: true,
        }),
      },
      resolve: async (_root, { input }, { db }) => {
        const { id } = fromGlobalId(input.id)

        const updatedItem = db.todoItem.update({
          where: { id },
          data: {
            isDone: false,
          },
        })

        return {
          todoItem: updatedItem,
        }
      },
    })
  },
})
