import { Router } from "express";
import * as ai from "../controllers/ai.controller";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";
import { aiLimiter } from "../middleware/rateLimit.middleware";

export const aiRouter = Router();

/**
 * Auth policy:
 *  - AI_REQUIRE_AUTH="0" → auth disabled (anonymous allowed), even in production.
 *  - AI_REQUIRE_AUTH="1" → auth required, even in development.
 *  - Otherwise → required in production, optional in development (default).
 */
const flag = process.env.AI_REQUIRE_AUTH;
const requireAuth = flag === "1" || (flag !== "0" && process.env.NODE_ENV === "production");
const aiAuth = requireAuth ? authMiddleware : optionalAuthMiddleware;

aiRouter.post("/chat", aiAuth, aiLimiter, ai.postChat);
