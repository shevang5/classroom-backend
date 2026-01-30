import type { ArcjetNodeRequest } from "@arcjet/node";
import type { NextFunction, Request, Response } from "express";

import aj from "../config/arcjet.js";

const securityMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // If NODE_ENV is TEST, skip security middleware
    if (process.env.NODE_ENV === "test") {
        return next();
    }

    try {
        const client = aj; // Use base Arcjet instance without additional rate limit rules

        const arcjetRequest: ArcjetNodeRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: {
                remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0",
            },
        };

        const decision = await client.protect(arcjetRequest);

        if (decision.isDenied() && decision.reason.isBot()) {
            return res.status(403).json({
                error: "Forbidden",
                message: "Automated requests are not allowed",
            });
        }

        if (decision.isDenied() && decision.reason.isShield()) {
            return res.status(403).json({
                error: "Forbidden",
                message: "Request blocked by security policy",
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Something went wrong with the security middleware.",
        });
    }
};

export default securityMiddleware;