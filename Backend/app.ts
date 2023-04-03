import express, { Application } from 'express'
import empAuthRoutes from './routes/employee/auth'
import testRoutes from './routes/test'

const createServer = (): express.Application => {
  const app: Application = express()

  // Body parsing Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(empAuthRoutes)
  app.use('/test', testRoutes)

  return app
}

export default createServer
