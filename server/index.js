import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Toilet Status Server is Running 🚽');
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this prototype
        methods: ["GET", "POST"]
    }
});

// Store active "sitting" users
// We use a Set to store socket IDs of users who are "sitting"
const sittingUsers = new Set();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send current count to new user
    socket.emit('updateCount', sittingUsers.size);

    socket.on('sitDown', () => {
        sittingUsers.add(socket.id);
        io.emit('updateCount', sittingUsers.size);
        console.log(`User ${socket.id} sat down. Total: ${sittingUsers.size}`);
    });

    socket.on('standUp', () => {
        sittingUsers.delete(socket.id);
        io.emit('updateCount', sittingUsers.size);
        console.log(`User ${socket.id} stood up. Total: ${sittingUsers.size}`);
    });

    socket.on('disconnect', () => {
        if (sittingUsers.has(socket.id)) {
            sittingUsers.delete(socket.id);
            io.emit('updateCount', sittingUsers.size);
            console.log(`User ${socket.id} disconnected and stood up. Total: ${sittingUsers.size}`);
        } else {
            console.log('User disconnected:', socket.id);
        }
    });
});

const PORT = process.env.PORT || 3000;
httpServer.on('error', (e) => {
    console.error('Server error:', e);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
