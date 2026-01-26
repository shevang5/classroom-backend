import express from 'express';

const app = express();
const port = 8000;

// JSON Middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Classroom API!',
        status: 'Server is running smoothly'
    });
});

// Start the server
app.listen(port, () => {
    console.log(`\n🚀 Server is running at http://localhost:${port}`);
    console.log(`📡 Listening for requests...\n`);
});
