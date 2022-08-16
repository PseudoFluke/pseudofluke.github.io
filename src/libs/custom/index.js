const { generateError } = require("../../utils/error");
const { messages } = require("../../utils/messages");

exports.doSomething = () => {
  try {
    //do something
  } catch (error) {
    generateError({ error, messages: messages.custom.failed });
  }
};
