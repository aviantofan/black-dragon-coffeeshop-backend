/* eslint-disable no-unused-vars */
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const showApi = require('../helpers/showResponse')
const validation = require('../helpers/validation')
const { APP_SECRET } = process.env

const login = async(req, res) => {
    const dataLogin = { email: req.body.email, password: req.body.password }
    const errValidation = await validation.validationLogin(dataLogin)
    if (errValidation == null) {
        const dataUser = await userModel.getDataUerByEmail(dataLogin.email)
        if (dataUser.length > 0) {
            const { password: hashPassword } = dataUser[0]
            const checkPassword = await bcrypt.compare(dataLogin.password, hashPassword)
            if (checkPassword) {
                if (dataUser[0].confirm == 1) {
                    const data = { id: dataUser[0].id }
                    const token = jwt.sign(data.id, APP_SECRET)
                    return showApi.showResponse(res, 'Login Success!', { token })
                } else {
                    return showApi.showResponse(res, 'User not authorized', null, null, 404)
                }
            } else {
                return showApi.showResponse(res, 'Wrong email and password!', null, null, 400)
            }
        } else {
            return showApi.showResponse(res, 'Wrong email and password!', null, null, 400)
        }
    } else {
        return showApi.showResponse(res, 'Data login not valid!', null, errValidation, 400)
    }
}

const register = async(req, res) => {
    const { email, password, phone } = req.body
    const data = { email, password, phone }
    const errValidation = await validation.validationRegister(data)
    if (errValidation == null) {
        const salt = await bcrypt.genSalt(8)
        const hashPassword = await bcrypt.hash(data.password, salt)
        data.password = hashPassword
        try {
            const resultDataUser = await userModel.insertDataUser(data)
            if (resultDataUser.affectedRows > 0) {
                const resultDataRegister = await userModel.insertDataUserProfile(data)
                if (resultDataRegister.affectedRows > 0) {
                    return showApi.showResponse(res, 'Registration Success!')
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
                return showApi.showResponse(res, 'Registration failed!', null, null, 500)
            }
        } catch (error) {
            return showApi.showResponse(res, 'Registration failed!', null, error.message, 500)
        }
    } else {
        return showApi.showResponse(res, 'Data not valid.', errValidation, 400)
    }
}

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

module.exports = { login, register }