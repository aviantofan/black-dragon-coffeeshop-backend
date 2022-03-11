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
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
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
      const now = new Date();
      const divider = ENVIRONMENT === 'development' ? 1000 : (60 * 1000);

      const diff = Math.round((now - oldCode) / divider);

      if (diff < 5) {
        return showResponse(res, 400, {
          message: 'You have recently sent a code'
        });
      }

      const deleteOtpCode = await otpCodeModel.delete(otpCode[0].id);

      if (deleteOtpCode.affectedRows > 0) {
        console.log('deleteOtpCode', deleteOtpCode);
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
