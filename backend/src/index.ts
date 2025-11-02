import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes/index.ts'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(cors({ origin: '*' }))
app.use(express.json())

// Routes
app.use('/', routes)

app.listen(port, _ => console.log(`Server running on http://localhost:${port}`))
