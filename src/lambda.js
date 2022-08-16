const serverless = require("aws-serverless-express");

const app = require("./app");

const server = serverless.createServer(app);

//===>> REST API

exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverless.proxy(server, event, context);
};
