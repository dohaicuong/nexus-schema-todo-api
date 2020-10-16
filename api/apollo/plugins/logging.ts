export type LogginPluginOptions = {
  ignoreIntrospectionquery?: boolean
}

export const loggingPlugin = ({
  ignoreIntrospectionquery = false,
}: LogginPluginOptions = {}) => ({
  requestDidStart: ({ request, context: { logger } }: any) => {
    const startTime = new Date()
    const operation = request.operationName
    const query = request.query

    if (ignoreIntrospectionquery && operation === 'IntrospectionQuery') return

    return {
      willSendResponse: ({ response: { data, errors } }: any) => {
        const endTime = new Date()

        logger.info('', {
          startTime,
          endTime,

          operation,
          data,

          query,
          errors,
        })
      },
    }
  },
})
