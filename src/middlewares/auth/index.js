const checkApiKey = (req, res, next) => {
  try {
    const { apikey } = req.headers;

    if (!apikey || apikey !== process.env.API_KEY) {
      res.status(401).send({
        success: false,
        message: "Not Authorized",
      });
    } else {
      return next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Not Authorized",
    });
  }
};

module.exports = {
  checkApiKey,
};
