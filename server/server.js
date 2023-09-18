const express = require("express")
const socket = require("socket.io")
const app = express()

const server = app.listen(8000, () => {
    console.log(`server is running on http://localhost:8000`);
})

const io = socket(server, {
    cors: {
        origin: "*"  //who can access
    }
})

// made parmanent connection & handle WebSocket connections, events, and messaging.  --socketClient have client details
io.on("connection", (socketClient) => {
    console.log(socketClient.id)
    //to get data from the client of id
    socketClient.on("MESSAGE", (args) => {
        console.log(args)
        //to send data to client of id
        socketClient.emit("MESSAGE", "server is sending back data")
    })

    //to prevent some users to get the data
    socketClient.on("EXCLUSIVE_BROADCAST", (args) => {
        console.log(args)
        //write logic to prevent client ids to get the below boadcast message
        socketClient.broadcast.emit("EXCLUSIVE_BROADCAST", "server is sending Exclusive broadcast data")
    })

    socketClient.on("BROADCAST", (clientdataBroadcast) => {
        console.log(clientdataBroadcast);
        io.emit("SENDBROADCAST", "player 1 has won the match")
    })

    socketClient.on("JoinRoom", (clientRoom) => {
        console.log(clientRoom)
        //first join the room
        socketClient.join(clientRoom)

        io.to(clientRoom).emit("ROOM_MESSAGES", `${socketClient} have joined the ${clientRoom}`)

        socketClient.on("sendroommessage", clientdata=>{
            io.to(clientRoom).emit("sendroommessage",clientdata)
        })
    })

})

app.get("/", (req, res) => {
    res.send("home page")
})