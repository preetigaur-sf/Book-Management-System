"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/auth', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: process.env.AUTH_SERVICE,
    changeOrigin: true,
}));
app.use('/books', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: process.env.BOOK_SERVICE,
    changeOrigin: true,
}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
