import { createTestContext } from './__helpers'
const ctx = createTestContext()

const mockContent = 'Fuck around today'

describe('TodoItem', () => {
  let createdItemId = null

  test('Mutation - todoItemCreate', async () => {
    const createdTodoItemMutation = await ctx.client.request(
      `
        mutation CreateTodoItem($content: String!) {
          todoItemCreate(input: { content: $content }) {
            todoItem {
              id
              content
              isDone
            }
          }
        }
      `,
      { content: mockContent }
    )
    
    const createdItem = createdTodoItemMutation?.todoItemCreate?.todoItem
    expect(createdItem).toHaveProperty('id')
    expect(createdItem.content).toBe(mockContent)
    expect(createdItem.isDone).toBe(false)

    createdItemId = createdItem.id
  })

  test('Query - node', async () => {
    const itemNodeQuery = await ctx.client.request(
      `
        query NodeQuery($id: ID!) {
          node(id: $id) {
            id
            ... on TodoItem {
              content
              isDone
            }
          }
        }
      `,
      { id: createdItemId }
    )
    expect(itemNodeQuery.node.id).toBe(createdItemId)
    expect(itemNodeQuery.node.content).toBe(mockContent)
    expect(itemNodeQuery.node.isDone).toBe(false)
  })

  test('Query - todos', async () => {
    const todoConnectionQuery = await ctx.client.request(`
      query TodoConnectionQuery {
        todos(first: 10) {
          edges {
            node {
              id
              content
              isDone
            }
          }
        }
      }
    `)
    expect(todoConnectionQuery.todos.edges).toHaveLength(1)
  })

  test('Mutation - todoItemDone', async () => {
    const doneMutation = await ctx.client.request(
      `
        mutation DoneMutation($id: ID!) {
          todoItemDone(input: { id: $id }) {
            todoItem {
              id
              content
              isDone
            }
          }
        }
      `,
      { id: createdItemId }
    )
    const doneItem = doneMutation.todoItemDone.todoItem
    expect(doneItem.id).toBe(createdItemId)
    expect(doneItem.isDone).toBe(true)
  })

  test('Mutation - todoItemUndone', async () => {
    const undoneMutation = await ctx.client.request(
      `
        mutation DoneMutation($id: ID!) {
          todoItemUndone(input: { id: $id }) {
            todoItem {
              id
              content
              isDone
            }
          }
        }
      `,
      { id: createdItemId }
    )
    const undoneItem = undoneMutation.todoItemUndone.todoItem
    expect(undoneItem.id).toBe(createdItemId)
    expect(undoneItem.isDone).toBe(false)
  })

  test('Mutation - todoItemDelete', async () => {
    const deleteItemMutation = await ctx.client.request(
      `
        mutation DeleteTodoItem($id: ID!) {
          todoItemDelete(input: { id: $id }) {
            deletedItemId
          }
        }
      `,
      { id: createdItemId }
    )
    expect(deleteItemMutation.todoItemDelete.deletedItemId).toBe(createdItemId)
  })

})
