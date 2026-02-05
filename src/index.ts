import { WebSocketServer, WebSocket } from "ws"

const wss = new WebSocketServer({ port: 8080 })

interface Connections {
    [room: string]: WebSocket[]
}
interface User {
    socket: WebSocket[],
    room: string
}
let userCount = 0
// let allSockets: Record<string, WebSocket[]> = {}
let allSockets: Connections = {}

wss.on("connection", (socket) => {
    userCount = userCount + 1
    console.log("client connected" + userCount)

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString())

        if (parsedMessage.type === "join") {
            const room = parsedMessage.room
            const sockets = allSockets[room] || []
            if (sockets.includes(socket)) {
                socket.send("You are already in the room")
                return
            }
            sockets.push(socket)
            allSockets[room] = sockets
        }

        if (parsedMessage.type === "chat") {
            const room = parsedMessage.room
            const sockets = allSockets[room] || []
            sockets.forEach((s) => {
                if (s !== socket) {
                    s.send(parsedMessage.payload.message)
                }
            })
        }
    })

    socket.on("disconnect", () => {
        
        
    })
})