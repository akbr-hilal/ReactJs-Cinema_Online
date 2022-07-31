require('dotenv').config()
const express = require('express')

const cors = require('cors')

const http = require('http')
const { Server } = require('socket.io')

// Get Routes
const router = require('./src/routes')

const app = express()

const port = process.env.PORT

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

app.listen(port, () => console.log(`Server run on port ${port}`))