const validator = require('validator');
const bcrypt = require('bcrypt');
const {
  showResponse
} = require('../helpers/showResponse');
const userModel = require('../models/userModel');
const authModel = require('../models/authModel');
const otpCodeModel = require('../models/otpCodeModel');

const {
  ENVIRONMENT
} = process.env;

exports.signup = async (req, res) => {
  try {
    const {
      email,
      password,
      phone
    } = req.body;

    if (!validator.isEmail(email)) {
      return showResponse(res, 400, {
        message: 'Email is not valid'
      });
    }

    const passwordRules = {
      minLength: 6
    };
    if (!validator.isStrongPassword(password, passwordRules)) {
      return showResponse(res, 400, {
        message: 'Password must be at least 6 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol'
      });
    }

    if (!validator.isMobilePhone(phone, 'id-ID')) {
      return showResponse(res, 400, {
        message: 'Phone number is not valid'
      });
    }

    const registeredPhone = await userModel.getUserByPhone(phone);

    if (registeredPhone[0].row > 0) {
      return showResponse(res, 400, {
        message: 'Phone number is already registered'
      });
    }

    const registeredEmail = await authModel.getUserByEmail(email);

    if (registeredEmail.length > 0) {
      return showResponse(res, 400, {
        message: 'Email is already registered'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // provide data as an object with the following data like email, password, role, confirm
    // example: { email: 'example@mail.com', password: '123456', role: 'user', confirm: '0' }
    const inputedData = {
      email,
      password: hashedPassword,
      role: 'user',
      confirm: '0'
    };

    const result = await authModel.insert(inputedData);

    if (result.affectedRows > 0) {
      const userAuthId = result.insertId;

      const inputPhone = await userModel.insert({
        phone,
        auth_user_id: userAuthId
      });

      if (inputPhone.affectedRows < 0) {
        return showResponse(res, 500, {
          message: 'Failed to register phone number'
        });
      }

      // send otp code
      const sendOtpCode = await sendCode(res, 'verify', userAuthId);

      if (sendOtpCode) {
        return showResponse(res, 200, {
          message: 'Successfully registered, please check your email to verify your account'
        });
      }
    }

    console.log(result);

    return showResponse(res, 'Signup Success');
  } catch (error) {
    console.error(error);
    return showResponse(res, 'Unexpected error', null, error, 500);
  }
};

const sendCode = async (res, type, userId) => {
  try {
    // check if user already have a code
    const otpCode = await otpCodeModel.getByUserId(userId);

    if (otpCode.length > 0) {
      // if user recently sent a code
      const oldCode = new Date(otpCode[0].created_at);
      // console.log(oldCode);
      const now = new Date();
      const divider = ENVIRONMENT === 'development' ? 1000 : (60 * 1000);

      const diff = Math.round((now - oldCode) / divider);

      if (diff < 5) {
        showResponse(res, 400, {
          message: 'You have recently sent a code'
        });
        return false;
      } else {
        const deleteOtpCode = await otpCodeModel.delete(otpCode[0].id);

        if (deleteOtpCode.affectedRows < 1) {
          // console.log('deleteOtpCode', deleteOtpCode);
          showResponse(res, 400, {
            message: 'Failed to send code'
          });
          return false;
        }
      }
    };

    // generate otp code
    const newOtpCode = Math.abs(Math.floor(Math.random() * (999999 - 100000) + 100000));

    // data must be an object with the following data like type, code, auth_user_id
    const insertNewOtpCode = await otpCodeModel.insert({
      type,
      code: newOtpCode,
      auth_user_id: userId
    });

    if (insertNewOtpCode.affectedRows > 0) {
      return true;
    }
  } catch (error) {
    console.error(error);
    return showResponse(res, 'Unexpected error', null, error, 500);
  }
};

const resetPassword = async (res, data) => {
  try {
    const {
      userId,
      code,
      password,
      confirmPassword
    } = data;

    const passwordRules = {
      min: 6,
      max: 12
    };

    if (!password) {
      return showResponse(res, 400, {
        message: 'You must provide a password if you want to reset your password'
      });
    }

    if (!validator.isLength(password, passwordRules)) {
      return showResponse(res, 400, {
        message: 'Password must be at least 6 characters long'
      });
    }

    if (password !== confirmPassword) {
      return showResponse(res, 400, {
        message: 'Password and confirm password does not match'
      });
    }

    const isCodeExist = await otpCodeModel.getByData({
      code,
      type: 'reset',
      authUserId: userId
    });

    if (isCodeExist.length < 1) {
      return showResponse(res, 400, {
        message: 'Code is not valid'
      });
    }

    if (Number(isCodeExist[0].expired)) {
      return showResponse(res, 400, {
        message: 'Code is expired'
      });
    }

    const setCodeExpired = await otpCodeModel.updateExpired(isCodeExist[0].id);

    if (setCodeExpired.affectedRows < 1) {
      return showResponse(res, 400, {
        message: 'Failed to reset password' // failed to update expired
      });
    }

    // generate new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // update password
    const updatePassword = await authModel.update(userId, {
      password: hashedPassword
    });

    if (updatePassword.affectedRows < 1) {
      return showResponse(res, 400, {
        message: 'Failed to reset password'
      });
    }

    return showResponse(res, 'Successfully reset password');
  } catch (error) {
    console.error(error);
    return showResponse(res, 'Unexpected error', null, error, 500);
  }
};

const verifyAccount = async (res, data) => {
  try {
    const {
      userId,
      code
    } = data;

    const isCodeExist = await otpCodeModel.getByData({
      code,
      type: 'verify',
      authUserId: userId
    }, true);

    if (isCodeExist.length < 1) {
      return showResponse(res, 400, {
        message: 'Code is not valid'
      });
    }

    if (Number(isCodeExist[0].expired)) {
      return showResponse(res, 400, {
        message: 'Code is expired'
      });
    }

    const setCodeExpired = await otpCodeModel.updateExpired(isCodeExist[0].id);

    if (setCodeExpired.affectedRows < 1) {
      return showResponse(res, 400, {
        message: 'Failed to verify account'
      });
    }

    const updateConfirm = await authModel.update(userId, {
      confirm: '1'
    });

    console.log();

    if (updateConfirm.affectedRows < 1) {
      return showResponse(res, 400, {
        message: 'Failed to verify account'
      });
    }

    return showResponse(res, 'Successfully verified account');
  } catch (error) {
    console.error(error);
    return showResponse(res, 'Unexpected error', null, error, 500);
  }
};

exports.verifyReset = async (req, res) => {
  try {
    const {
      email,
      code,
      password,
      confirmPassword
    } = req.body;

    const data = {
      email,
      code,
      password,
      confirmPassword
    };

    if (!validator.isEmail(email)) {
      return showResponse(res, 400, {
        message: 'Email is not valid'
      });
    }

    // if email is not registered
    const registeredEmail = await authModel.getUserByEmail(email);

    if (registeredEmail.length < 1) {
      return showResponse(res, 400, {
        message: 'Email is not registered'
      });
    }

    const user = registeredEmail[0];
    console.log(user);

    // reset password
    if (Number(user.confirm) && data.code) {
      return resetPassword(res, {
        userId: user.id,
        code,
        password,
        confirmPassword
      });
    }

    // sent code to reset password
    if (Number(user.confirm) && !data.code) {
      const sendedCode = await sendCode(res, 'reset', user.id);
      console.log(sendedCode);
      if (sendedCode) {
        return showResponse(res, 200, {
          message: 'Code to reset password has been sent to your email'
        });
      }
    }

    // verify user account
    if (!Number(user.confirm) && data.code) {
      return verifyAccount(res, {
        userId: user.id,
        code
      });
    }

    // sent code to verify user account
    if (!Number(user.confirm) && !data.code) {
      const sendedCode = await sendCode(res, 'verify', user.id);
      if (sendedCode) {
        return showResponse(res, 200, {
          message: 'Code to verify account has been sent to your email'
        });
      }
    }
  } catch (error) {
    console.error(error);
    return showResponse(res, 'Unexpected error', null, error, 500);
  }
};
