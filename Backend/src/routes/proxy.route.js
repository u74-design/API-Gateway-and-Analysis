import express from "express";
import { handleProxyRequest } from "../controllers/proxy.controller.js";

const router = express.Router();

router.get('/:proxyId', handleProxyRequest);

export default router;