import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import prisma from "./config/prisma";

const app = createApp();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`⚡ Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = async () => {
  console.log("Shutting down server gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
