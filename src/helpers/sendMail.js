const {
  mail
} = require('../config/mail');
const {
  APP_EMAIL
} = process.env;

exports.sendMail = async ({
  to,
  code,
  reset = true
}) => {
  try {
    const info = await mail.sendMail({
      from: APP_EMAIL,
      to,
      subject: `${reset ? 'Password reset' : 'Verify Account'} | Black Dragon Coffeshop`,
      text: `${code}`,
      html: `<p>Your code for ${reset ? 'reset password' : 'verify account'} is: ${code}</p>`
    });
    console.log('Message sent: %s', info.messageId);

    return info;
  } catch (error) {
    console.error(error);
    return false;
  }
};
