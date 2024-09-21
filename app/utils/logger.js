import winston from "winston";
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import DailyRotateFile from "winston-daily-rotate-file";

// Helper to get the file name and line number of the log call
const getCallerInfo = () => {
    const obj = {};
    Error.captureStackTrace(obj, getCallerInfo);  
    const stack = obj.stack.split("\n")[2]; 
    const match = stack.match(/\((.*):(\d+):(\d+)\)/); //get File and Line
    if (match) {
        const filePath = match[1];
        const lineNumber = match[2];
        const fileName = basename(filePath);
        return `${fileName}:${lineNumber}`;
    }
    return "Location not found";
};

// Format message to include file, line and log
const customFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
    const callerInfo = getCallerInfo();
    return `${timestamp} [${level.toUpperCase()}] (${callerInfo}) - ${message}`;
});

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);

// Define the log file path
const logFilePath = join(currentDir, 'logs', 'application-%DATE%.log');
// Configure the logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        customFormat
    ),
    transports: [
        // Daily file
        new DailyRotateFile({
            filename: logFilePath,
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d", 
        }),
    ],
});

export default logger;
