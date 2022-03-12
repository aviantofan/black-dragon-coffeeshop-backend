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
/* eslint-disable no-unused-vars */
// const userModel = require('../models/user')
// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');
const {
  APP_SECRET
} = process.env;

exports.login = async (req, res) => {
  const dataLogin = {
    email: req.body.email,
    password: req.body.password
  };
  const errValidation = await validation.validationLogin(dataLogin);
  if (errValidation == null) {
    const dataUser = await userModel.getDataUerByEmail(dataLogin.email);
    if (dataUser.length > 0) {
      const {
        password: hashPassword
      } = dataUser[0];
      const checkPassword = await bcrypt.compare(dataLogin.password, hashPassword);
      if (checkPassword) {
        if (parseInt(dataUser[0].confirm) === 1) {
          const data = {
            id: dataUser[0].id
          };
          const token = jwt.sign(data.id, APP_SECRET);
          return showApi.showResponse(res, 'Login Success!', {
            token
          });
        } else {
          return showApi.showResponse(res, 'User not authorized', null, null, 404);
        }
      } else {
        return showApi.showResponse(res, 'Wrong email and password!', null, null, 400);
      }
    } else {
      return showApi.showResponse(res, 'Wrong email and password!', null, null, 400);
    }
  } else {
    return showApi.showResponse(res, 'Data login not valid!', null, errValidation, 400);
  }
};

const register = async (req, res) => {
  const {
    email,
    password,
    phone
  } = req.body;
  const data = {
    email,
    password,
    phone
  };
  const errValidation = await validation.validationRegister(data);
  if (errValidation == null) {
    const salt = await bcrypt.genSalt(8);
    const hashPassword = await bcrypt.hash(data.password, salt);
    data.password = hashPassword;
    try {
      const resultDataUser = await userModel.insertDataUser(data);
      if (resultDataUser.affectedRows > 0) {
        const resultDataRegister = await userModel.insertDataUserProfile(data);
        if (resultDataRegister.affectedRows > 0) {
          return showApi.showResponse(res, 'Registration Success!');
        }

        // let randomCode = Math.round(Math.random() * (9999999 - 100000) - 100000);
        // if (randomCode < 0) {
        //     randomCode = (randomCode * -1);
        // }
        // const reset = await emailVerificationModel.insertEmailVerification(resultRegister.insertId, randomCode);
        // if (reset.affectedRows >= 1) {
        //     await mail.sendMail({
        //         from: APP_EMAIL,
        //         to: email,
        //         subject: 'Email Verification',
        //         text: String(randomCode),
        //         html: `This is your email verification code : <b>${randomCode}</b>`
        //     });
        //     dataJson = {...dataJson, message: "Email Verification has been sent to your email!" };
        //     return showApi.showSuccess(dataJson);
        // } else {
        //     dataJson = {...dataJson, message: "Email Verification failed to send." };
        //     return showApi.showSuccess(dataJson);
        // }
      } else {
        return showApi.showResponse(res, 'Registration failed!', null, null, 500);
      }
    } catch (error) {
      return showApi.showResponse(res, 'Registration failed!', null, error.message, 500);
    }
  } else {
    return showApi.showResponse(res, 'Data not valid.', errValidation, 400);
  }
};

// const emailVerification = async(req, res) => {
//     const { email, code, password } = req.body;
//     const data = { email, code, password };
//     var errValidation = await validation.validationEmailVerification(data);
//     let dataJson = { response: res, message: '' };
//     if (errValidation == null) {
//         const user = await userModel.getDataUserEmailAsync(data.email, null);
//         const { password: hashPassword } = user[0];
//         const checkPassword = await argon.verify(hashPassword, password);
//         if (checkPassword) {
//             const getEmailVerification = await emailVerificationModel.getEmailVerificationByCode(code);
//             const updateUser = await userModel.updateDataUserAsync(getEmailVerification[0].user_id, { isVerified: 1 });
//             if (updateUser.affectedRows > 0) {
//                 const updateExpired = await emailVerificationModel.updateEmailVerification({ isExpired: 1 }, getEmailVerification[0].id);
//                 if (updateExpired.affectedRows > 0) {
//                     dataJson = {...dataJson, message: "Email has been verified!" };
//                     return showApi.showSuccess(dataJson);
//                 } else {
//                     dataJson = {...dataJson, message: "Email Verification failed to verify!", status: 500 };
//                     return showApi.showSuccess(dataJson);
//                 }
//             } else {
//                 dataJson = {...dataJson, message: "User failed to update!", status: 500 };
//                 return showApi.showSuccess(dataJson);
//             }
//         }
//     } else {
//         dataJson = {...dataJson, message: "Data not valid!", status: 400, error: errValidation };
//         return showApi.showError(dataJson);
//     }
// };

// const forgotPassword = async(req, res) => {
//     const { email, code, password, confirmPassword } = req.body;
//     const data = { email, code, password, confirmPassword };
//     var errValidation = await validation.validationForgotPassword(data);
//     let dataJson = { response: res, message: '' };
//     if (!data.code) {
//         if (errValidation == null) {
//             const getDataUser = await userModel.getDataUserEmailAsync(email);
//             let randomCode = Math.round(Math.random() * (999999 - 100000) - 100000);
//             if (randomCode < 0) {
//                 randomCode = (randomCode * -1);
//             }
//             const reset = await forgotPasswordModel.insertForgotPassword(getDataUser[0].id, randomCode);
//             if (reset.affectedRows >= 1) {
//                 await mail.sendMail({
//                     from: APP_EMAIL,
//                     to: email,
//                     subject: 'Reset Your Password | Backend Beginner',
//                     text: String(randomCode),
//                     html: `<b>${randomCode}</b>`
//                 });
//                 dataJson = {...dataJson, message: "Forgot Password has been sent to your email!" };
//                 return showApi.showSuccess(dataJson);
//             } else {
//                 dataJson = {...dataJson, message: "Unexpected Error.", status: 500 };
//                 return showApi.showError(dataJson);
//             }
//         } else {
//             dataJson = {...dataJson, message: "Data not valid.", status: 400, error: errValidation };
//             return showApi.showError(dataJson);
//         }
//     } else {
//         if (data.email) {
//             if (errValidation == null) {
//                 const resultDataForgotPassword = await forgotPasswordModel.getForgotPassword(data.code);
//                 const user = await userModel.getDataUserAsync(resultDataForgotPassword[0].user_id);
//                 if (data.password == data.confirmPassword) {
//                     const hashPassword = await argon.hash(data.password);
//                     data.password = hashPassword;
//                     const update = await userModel.updateDataUserAsync(user[0].id, { password: data.password });
//                     if (update.affectedRows > 0) {
//                         const updateForgotPassword = await forgotPasswordModel.updateForgotPassword({ isExpired: 1 }, resultDataForgotPassword[0].id);
//                         if (updateForgotPassword.affectedRows > 0) {
//                             dataJson = {...dataJson, message: "Password has been reset!" };
//                             return showApi.showSuccess(dataJson);
//                         } else {
//                             dataJson = {...dataJson, message: 'Unexpected Error Update data forgot password', status: 500 };
//                             return showApi.showError(dataJson);
//                         }
//                     } else {
//                         dataJson = {...dataJson, message: 'Unexpected Error Update Data User', status: 500 };
//                         return showApi.showError(dataJson);
//                     }
//                 } else {
//                     dataJson = {...dataJson, message: 'Confirm password not same as password', status: 500 };
//                     return showApi.showError(dataJson);
//                 }
//             } else {
//                 dataJson = {...dataJson, message: 'Data not valid!', status: 400, error: errValidation };
//                 return showApi.showError(dataJson);
//             }
//         }
//     }

// };

// module.exports = {
//   login,
//   register
// };
