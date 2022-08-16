const express = require("express");
const cors = require("cors");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  release: `notifications@${process.env.npm_package_version}`,
  autoSessionTracking: false,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.disable("x-powered-by");

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use("/api/v1", require("./routes"));

app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
});

module.exports = app;
