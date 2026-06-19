import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());

app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE!,
    changeOrigin: true,
  }),
);

app.use(
  "/books",
  createProxyMiddleware({
    target: process.env.BOOK_SERVICE!,
    changeOrigin: true,
  }),
);

app.use(
  "/authors",
  createProxyMiddleware({
    target: process.env.BOOK_SERVICE!,
    changeOrigin: true,
  }),
);

app.use(
  "/categories",
  createProxyMiddleware({
    target: process.env.BOOK_SERVICE!,
    changeOrigin: true,
  }),
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
