import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  // allow overriding the port via environment (useful for CI, repros, or when
  // the default port 5000 is already in use)
  const port = Number(process.env.PORT) || 5000;

  // reusePort can be unsupported on some platforms (Windows) and cause
  // an ENOTSUP error when trying to listen. Only set it when the
  // platform supports it (non-win32).
  const listenOptions: { port: number; host: string; reusePort?: boolean } = {
    port,
    host: "0.0.0.0",
  };

  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  // Attach an error handler so we can provide a clear message when the
  // address is already in use or other listen errors occur.
  server.on("error", (err: any) => {
    if (err && err.code === "EADDRINUSE") {
      log(`port ${port} is already in use. Either stop the process using it or set PORT to a different port before starting.`);
      process.exit(1);
    }

    // rethrow unknown errors so the process still fails loudly
    throw err;
  });

  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();
