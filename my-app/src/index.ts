import { Hono } from 'hono'
import { serve } from '@hono/node-server' 
import answerRoute from './routes/answer/answer.route'
import authRoute from './routes/auth/auth.route'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api', answerRoute)
app.route('/api', authRoute)
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined
serve({
  fetch: app.fetch,
  port: port
})

console.log('✅ Server is running on http://localhost:3000')
