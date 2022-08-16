exports.validate = (schema) => async (req, res, next) => {
  try {
    const submitData = { ...req.body };
    await schema.validateAsync(submitData);
    next();
  } catch (err) {
    console.log("error: ", err);
    if (err.details && err.details[0] && err.details[0].message)
      return res
        .status(400)
        .send({ success: false, data: null, message: err.details[0].message });
    return err;
  }
};
