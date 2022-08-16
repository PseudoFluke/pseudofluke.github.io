const phoneValidator = require("phone");
const User = require("../../models/user/services");
const Order = require("../../models/order/services");
const Hotel = require("../../models/hotel/services");
const { capitalize } = require("../../libs/whatsapp/utils");
const { OTP_EXPIRY, generateOtp } = require("../../models/user/constants");
const { EVENT } = require("../../models/schema/notificationTemplate/constants");
const { ACTIONS } = require("../../models/order/constants");
const { getUpdatedRating } = require("../../utils/general");
const {
  NOTIFICATION_TEMPLATES,
} = require("../../models/schema/notification/constants");
const { INTERNAL_NUMBERS } = require("../../utils/constants");

exports.getMessageType = async ({ text, notification }) => {
  if (
    notification &&
    (notification.eventType === EVENT.EVENT_TYPE.ORDER_COMPLETED ||
      notification.template === NOTIFICATION_TEMPLATES.ORDER_DELIVERED)
  ) {
    return this.MESSAGE_TYPE.ORDER_RATING;
  }
  if (text.toLowerCase().match(/\botp/)) {
    return this.MESSAGE_TYPE.GET_OTP;
  }
};

exports.getMessageText = ({ button, type, text }) => {
  if (type === "text") {
    return text;
  }
  if (type === "button") {
    const buttonText = JSON.parse(button);
    return buttonText.text;
  }
};

exports.getEnteredPhone = (message) => {
  const expression = /[1-9]{1}[0-9]{9}/g;
  const phone = message.match(expression);
  if (phone.length) {
    return phone[0];
  } else {
    return null;
  }
};

exports.getPhoneWithCountryCode = (mobile) => {
  const validatorRes = phoneValidator.phone(`+${mobile}`);

  const countryCode = validatorRes.isValid
    ? parseInt(validatorRes.countryCode.replace("+", ""))
    : 91;
  const phone = mobile.slice(countryCode.toString().length);

  return { phone, countryCode };
};

exports.getRating = (message) => {
  if (message === "Excellent") {
    return 5;
  }
  if (message === "Average") {
    return 2.5;
  }
  if (message === "Bad") {
    return 1;
  }
};

exports.MESSAGE_TYPE = {
  GET_OTP: 1,
  ORDER_RATING: 2,
};

exports.getOtpMessage = async ({ user, text, name, phone, countryCode }) => {
  const firstName = capitalize(name ? name.split(" ")[0] : "Guest");
  let otp = (user.otp && user.otp.value) || null;
  let replyMessage = "";
  let difference = null;
  const enteredPhone = this.getEnteredPhone(text);
  if (enteredPhone !== phone) {
    replyMessage = `Dear ${firstName},\nEntered Phone does not match with your Whatsapp Number.`;
  } else {
    if (otp) {
      const { expiry } = user.otp;

      const currentDate = new Date();
      difference = expiry - currentDate.getTime();
    }
    if (!difference || difference < 0) {
      otp = generateOtp();

      await User.update(
        { phone },
        {
          otp: { expiry: new Date().getTime() + OTP_EXPIRY, value: otp },
          countryCode,
        }
      );
    }
    replyMessage = `Dear ${firstName},\nYour OTP for phone ${phone} is *${otp}*. It is valid for next 5 minutes.\n\nPlease do not share this OTP`;
  }
  return replyMessage;
};

exports.getRatingMessage = async ({ messageText, notification }) => {
  const rating = this.getRating(messageText);
  const order = await Order.getById(notification.referenceId);
  if (order.rating) {
    return `You have already rated for this order`;
  }

  const hotel = await Hotel.getById(order.hotelId);
  await this.ratingsUpdate({
    orderId: order._id,
    rating,
    hotel,
    userId: order.userId,
  });

  return `Thank you for your valuable feedback.\n\nJust sit back and relax. Tap on the link below if you need any further assistance.\n\nhttps://hotel.quoality.com/${hotel.domain}`;
};

exports.ratingsUpdate = async ({ orderId, rating, hotel, review, userId }) => {
  const date = new Date();
  const updateQuery = review ? { rating, review } : { rating };
  const action = review ? ACTIONS.REVIEW : ACTIONS.RATING;

  const pushObject = {
    action,
    time: date.toISOString(),
    performedBy: userId,
  };

  await Order.update({ _id: orderId }, updateQuery, pushObject);

  let totalRatedUsers = hotel.totalRatedUsers || 0;
  totalRatedUsers += 1;
  let hotelRating = hotel.rating || 0;
  hotelRating = getUpdatedRating({
    existingRating: hotelRating,
    totalRatedUsers,
    newRating: rating,
  });

  await Hotel.update(
    { _id: hotel._id },
    { rating: hotelRating, totalRatedUsers }
  );
};

exports.getPermission = (user, hotel, message) =>
  !user ||
  !hotel ||
  (process.env.NODE_ENV === "production" &&
    hotel?.notification?.whatsapp &&
    message) ||
  ((process.env.NODE_ENV === "staging" ||
    process.env.NODE_ENV === "development") &&
    INTERNAL_NUMBERS.includes(user.phone) &&
    hotel?.notification?.whatsapp &&
    message);
