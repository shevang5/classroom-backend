

import express from "express";
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(securityMiddleware);

app.use(cors({
    origin: true, // Allow any origin for debugging
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use("/api/subjects", subjectsRouter);

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
