import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { prisma } from './lib/db.js';
import routes from './routes/index.js';
import rateLimit from 'express-rate-limit';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use('/api', limiter);


// Health check route
app.get('/', (req, res) => {
    res.send('API is running!');
});


// API routes
app.use('/api', routes);


// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});


const PORT = process.env.PORT || 8080;

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
