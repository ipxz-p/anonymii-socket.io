const io = require("socket.io")(8800, {
    cors: {
        origin: '*',
    },
});

let activeUsers = [];

io.on("connection", (socket) => {
    // add new User
    socket.on("new-user-add", (newUserEmail) => {
        // if user is not added previously
        if (!activeUsers.some((user) => user.email === newUserEmail)) {
            activeUsers.push({ email: newUserEmail, socketId: socket.id });
            console.log("New User Connected", activeUsers);
        }
        // send all active users to new user
        io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
    });

    // send message to a specific user
    socket.on("send-message", (chatId) => {
        activeUsers.forEach((user) => {
            io.to(user.socketId).emit("recieve-message", chatId);
        });
    });
});
