const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    const token = socket.id

    socket.on("mouseMove", (json) => {
        socket.broadcast.emit("mouseMove", {token: token, coordinates: json})
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit('userDisconnect', token)
    })
});

io.listen(3000);