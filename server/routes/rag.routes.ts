import { Router } from "express";
import * as rag from "../controllers/rag.controller";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";
import { aiLimiter } from "../middleware/rateLimit.middleware";

export const ragRouter = Router();

// Same policy as /api/ai (RAG is part of the same plan-generation flow):
//  - AI_REQUIRE_AUTH="0" → anonymous allowed even in prod.
//  - AI_REQUIRE_AUTH="1" → required even in dev.
//  - Otherwise → required in prod, optional in dev (default).
const flag = process.env.AI_REQUIRE_AUTH;
const requireAuth = flag === "1" || (flag !== "0" && process.env.NODE_ENV === "production");
const ragAuth = requireAuth ? authMiddleware : optionalAuthMiddleware;

ragRouter.post("/retrieve", ragAuth, aiLimiter, rag.postRetrieve);
