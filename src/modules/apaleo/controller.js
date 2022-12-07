const { messages } = require("../../utils/messages");
const { doSomething } = require("../../libs/custom");

exports.customController = async (res) => {
  //=> these are the data we get in controller args
  console.log("Endpoint hit!");

  return {
    status: 200,
    success: true,
    message: messages.custom.success,
  };
};
