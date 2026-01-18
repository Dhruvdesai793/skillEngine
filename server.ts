import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        path: "/api/socket/io",
        addTrailingSlash: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        // console.log("Client connected", socket.id);

        socket.on("join_room", (room) => {
            socket.join(room);
            // console.log(`[Socket] ${socket.id} joined ${room}`);

            // Optional: Notify room of new user
            // socket.to(room).emit("system_message", { text: "A user joined the mainframe." });
        });

        socket.on("leave_room", (room) => {
            socket.leave(room);
            // console.log(`[Socket] ${socket.id} left ${room}`);
        });

        socket.on("send_message", (data) => {
            io.to(data.room).emit("receive_message", data);
        });

        socket.on("typing", (room) => {
            socket.to(room).emit("typing", socket.id);
        });

        socket.on("stop_typing", (room) => {
            socket.to(room).emit("stop_typing", socket.id);
        });

        socket.on("disconnect", () => {
            // console.log("Client disconnected", socket.id);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});