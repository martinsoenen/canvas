const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    const token = socket.id
    console.log("✅ " + token)

    socket.on("mouseMove", (json) => {
        socket.broadcast.emit("mouseMove", {token: token, pseudo: json.pseudo, coordinates: json.coordinates})
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit('userDisconnect', token)
        console.log("❌ " + token)
    })
});

io.listen(3000);