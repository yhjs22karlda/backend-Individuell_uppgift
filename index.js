import express from 'express'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yaml'
import { router as notesRouter } from './routes/notes.route.js'
import { router as userRouter } from './routes/user.route.js'

const app = express()
const PORT = 3000

const swaggerDocument = fs.readFileSync("./docs/swaggerDoc.yml", "utf8")

app.use('/api/docs', swaggerUi.serve)
app.get('/api/docs', swaggerUi.setup(yaml.parse(swaggerDocument)))

app.use(express.json())

// logga alla requests
app.use((req,res,next) => {
    console.log("Request: " + req.method + " " + req.path); next()
})

app.use("/api/notes", notesRouter)
app.use("/api/user", userRouter)

app.use((err, req, res, next) => {
    res.status(err.statusCode).json({status: false, msg: "Unexpexted error: " + err.type})
})

app.listen(PORT, () => {
    console.log('Listening to port ' + PORT)
})
