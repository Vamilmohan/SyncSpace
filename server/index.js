require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('./config/passport');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use(passport.initialize());
app.use('/api/documents', documentRoutes);
app.use('/api/tasks', taskRoutes);
// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workspaces', require('./routes/workspaceRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/columns', require('./routes/columnRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/documents', require('./routes/documentRoutes')); // Add this
app.use('/api/invitations', require('./routes/invitationRoutes')); // Add this line
app.use('/api/notifications', require('./routes/notificationRoutes')); // Add this line
app.get('/', (req, res) => {
  res.send('SyncSpace server is running!');
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('New client connected');

  // Logic for document editing
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`Client ${socket.id} joined document ${documentId}`);
  });

  socket.on('send-changes', (delta, documentId) => {
    // Broadcast the changes to all other clients in the same document room
    socket.to(documentId).emit('receive-changes', delta);
  });

  
  // ** NEW PART: Logic for help chat **
  socket.on('send-help-message', (message) => {
    // In a real app, you might save this to a database
    // and only send it to support agents.
    // For now, we will broadcast it to everyone except the sender.
    socket.broadcast.emit('receive-help-message', message);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));