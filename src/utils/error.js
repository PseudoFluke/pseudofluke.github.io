exports.generateError = ({
  error = false,
  status = 409,
  message = "Server issue",
}) => {
  const errorStack = error
    ? JSON.stringify(error, Object.getOwnPropertyNames(error))
    : JSON.stringify({});

  if (process.env.NODE_ENV == "development") {
    console.log("GOT_AN_ERROR ===>> ", JSON.parse(errorStack));
  }

  if (error?.status) status = error.status;

  throw Error(
    JSON.stringify({
      error: errorStack,
      status: status,
      message: message,
    })
  );
};

//===>> handle error method

exports.handleError = (
  res,
  errorCode = 500,
  errorMessage = "Ops, Something went wrong"
) => {
  return res.status(errorCode).send({
    success: false,
    data: null,
    message: errorMessage,
  });
};
