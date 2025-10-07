require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoroutes');

const app = express();
const PORT = process.env.PORT || 3000;

// connect to DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Mount API routes BEFORE static files ---
app.use('/api/users', userRoutes);
app.use('/api/todo', todoRoutes);

// Serve frontend (static)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
