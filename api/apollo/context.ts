import { PrismaClient } from '@prisma/client'
import winston, { Logger } from 'winston'

const db = new PrismaClient()

const colorizer = winston.format.colorize({
  colors: {
    level: 'yellow',
    time: 'cyan',
    operation: 'blue',
    data: 'green',
    error: 'red'
  }
})
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'todo-service' },
  format: winston.format.combine(
    winston.format.printf(info => {
      const elapsedTime = info.endTime - info.startTime

      const logLevel = colorizer.colorize('level', info.level.toUpperCase())
      const time = colorizer.colorize('time', `[${new Date(info.startTime).toISOString()}] (${elapsedTime}ms)`)
      const operation = colorizer.colorize('operation', info.operation)
      const data = colorizer.colorize('data', info.data ? `\nDATA: ${JSON.stringify(info.data, null, 2)}` : '')
      const error = colorizer.colorize('error', info.errors ? `\nERROR: ${JSON.stringify(info.errors, null, 2)}` : '')

      return `${logLevel} ${time} - ${operation} ${data} ${error}`
    })
  ),
  transports: [
    new winston.transports.Console()
  ],
})

export type Context = {
  db: PrismaClient,
  logger: Logger
}

export const createContext = () => {
  return {
    db,
    logger,
  }
}
