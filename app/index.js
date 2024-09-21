import express from "express";

//Utils
import logger from './utils/logger.js';
import { Response } from "./utils/response.js";
import dotenv from "dotenv";
dotenv.config();

//Router
import routes from "./routes/index.js";

// Express application and response helper
const app = express();
app.use(Response.init);

const PORT = process.env.PORT || 3001;

// Route to expose metrics
app.get("/metrics", async (req, res) => {
	Response.json(await register.metrics());
});

app.use("/api", routes);

// Running express server
app.listen(PORT, () => logger.info(`server running on port ${PORT}`));

