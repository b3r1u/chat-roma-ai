const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const app = express()

const server = http.createServer(app)

const io = socketIo(server)

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/chat.html")
})

// aqui vai o socket.io

server.listen(3000)