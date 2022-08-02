require('dotenv').config()
const express = require('express')

const cors = require('cors')

const http = require('http')
const { Server } = require('socket.io')

// Get Routes
const router = require('./src/routes')

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})
require('./src/socket')(io)

const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())


app.use('/api/v1/', router )
app.use('/uploads', express.static('uploads'))

app.get("/", (req, res) => {
    res.status(200).send("Hello World")
})

app.get("/api/v1/", (req, res) => {
    res.status(200).send("API Run")
})

server.listen(port, () => console.log(`Server run on port ${port}`))