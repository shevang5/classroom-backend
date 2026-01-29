<<<<<<< main
import express from 'express';

=======
import AgentAPI from "apminsight";
AgentAPI.config();

import express from "express";
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
>>>>>>> local
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
