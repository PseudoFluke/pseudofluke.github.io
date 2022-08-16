const { messages } = require("../../utils/messages");
const { doSomething } = require("../../libs/custom");

exports.customController = async (res) => {
  //=> these are the data we get in controller args

  const { body, query, headers, params } = res;

  doSomething();

  return {
    status: 200,
    success: true,
    message: messages.custom.success,
  };
};
