import express from 'express'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yaml'
import { router as notesRouter } from './routes/notes.route.js'
import { router as userRouter } from './routes/user.route.js'
//---- __filename och __dirname finns inte om man använder moduler ----------
import {fileURLToPath} from 'url'
import {dirname} from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
//-----------------------------------------------------------------------------

const app = express()
const PORT = 3000

const swaggerDocument = fs.readFileSync("./docs/swaggerDoc.yml", "utf8")

app.use('/api/docs', swaggerUi.serve)
app.get('/api/docs', swaggerUi.setup(yaml.parse(swaggerDocument)))

app.use(express.json())

// logga alla requests
app.use((req,res,next) => { console.log("Request: " + req.method + " " + req.path); next() })

app.use(express.static(__dirname + "/front"))

app.use("/api/notes", notesRouter)
app.use("/api/user", userRouter)

// skicka felaktiga url:er till startsidan
app.use((req, res) => {
    res.redirect('/')
})

app.use((err, req, res, next) => {
    res.status(err.statusCode).json({status: false, msg: "Unexpexted error: " + err.type})
})

app.listen(PORT, () => {
    console.log('Listening to port ' + PORT)
})
