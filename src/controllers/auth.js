const validator = require('validator');
const bcrypt = require('bcrypt');
const {
  showResponse
} = require('../helpers/showResponse');
const userModel = require('../models/userModel');
const authModel = require('../models/authModel');

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

    console.log(result);

    return showResponse(res, 'Signup Success');
  } catch (error) {
    console.error(error);
    return showResponse(res, 'Unexpected error', null, error, 500);
  }
};
