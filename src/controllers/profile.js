const userModel = require('../models/user');
const showApi = require('../helpers/showResponse');
// const { getDefaultFlags } = require('mysql/lib/ConnectionConfig');
const upload = require('../helpers/upload').single('image');
const validation = require('../helpers/validation');
const auth = require('../helpers/auth');

const {
  APP_URL
} = process.env;

const getProfile = async (request, response) => {
  const {
    id
  } = request.user;
  console.log(id);
  const result = await userModel.getUserProfile(id);
  if (result.length > 0) {
    return showApi.showResponse(response, 'Detail Profile', result[0]);
  } else {
    return showApi.showResponse(response, 'Detail Profile not found!', null, 404);
  }
};

const updateProfile = (request, response) => {
  upload(request, response, async (errorUpload) => {
    auth.verifyUser(request, response, async () => {
      const {
        id
      } = request.params;
      if (id) {
        if (!isNaN(id)) {
          const dataUser = await userModel.getUserProfile(id);
          if (dataUser.length > 0) {
            const {
              display_name: displayName,
              first_name: firstName,
              last_name: lastName,
              gender,
              birthdate,
              phone,
              email,
              password,
              address
            } = request.body;

            const data = {
              displayName,
              firstName,
              lastName,
              gender,
              birthdate,
              phone,
              email,
              password,
              address
            };

            let errValidation = await validation.validationUser(data);

            if (request.file) {
              const photoTemp = request.file.path;
              data.image = photoTemp.replace('\\', '/');
            }
            if (errorUpload) {
              errValidation = {
                ...errValidation,
                photo: errorUpload.message
              };
            }

            if (errValidation == null) {
              const dataAuth = {
                email,
                password
              };
              const dataProfile = {
                displayName,
                firstName,
                lastName,
                gender,
                birthdate,
                phone,
                address
              };

              try {
                const updateUser = await userModel.updateDataUser(dataAuth, id);
                if (updateUser.affectedRows > 0) {
                  const updateUserProfile = await userModel.updateDataUserProfile(dataProfile, id);
                  if (updateUserProfile.affectedRows > 0) {
                    const result = await userModel.getUserProfile(id);
                    result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                    return showApi.showResponse(response, 'Data user updated successfully!', result[0]);
                  } else {
                    return showApi.showResponse(response, 'Data user failed to update!', null, null, 500);
                  }
                } else {
                  return showApi.showResponse(response, 'Data user failed to update!', null, null, 500);
                }
              } catch (err) {
                return showApi.showResponse(response, err.message, null, null, 500);
              }
            } else {
              return showApi.showResponse(response, 'Data profile not valid!', null, errValidation, 400);
            }
          } else {
            return showApi.showResponse(response, 'Data profile not found', null, null, 400);
          }
        } else {
          return showApi.showResponse(response, 'Id must be a number', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
      }
    });
  });
};

const updatePatchProfile = (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async(error) => {
    const {
      id
    } = request.params;
    if (id) {
      if (!isNaN(id)) {
        const dataUser = await userModel.getUserProfile(id);
        if (dataUser.length > 0) {
          const dataAuth = {};
          const dataProfile = {};

          const filled = ['email', 'address', 'phone', 'display_name', 'first_name', 'last_name',
            'birth_date', 'gender', 'password'
          ];

          filled.forEach((value) => {
            if (request.body[value]) {
              if (value === 'email' || value === 'password') {
                dataAuth[value] = request.body[value];
              } else {
                if (request.file) {
                  const photoTemp = request.file.path;
                  dataProfile.image = photoTemp.replace('\\', '/');
                }
                dataProfile[value] = request.body[value];
              }
            }
          });

          try {
            const updateUser = await userModel.updateDataUser(dataAuth, id);
            if (updateUser.affectedRows > 0) {
              const updateUserProfile = await userModel.updateDataUserProfile(dataProfile, id);
              if (updateUserProfile.affectedRows > 0) {
                const result = await userModel.getUserProfile(id);
                result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                return showApi.showResponse(response, 'Data user updated successfully!', result[0]);
              } else {
                return showApi.showResponse(response, 'Data user failed to update!', null, null, 500);
              }
            } else {
              return showApi.showResponse(response, 'Data user failed to update!', null, null, 500);
            }
          } catch (err) {
            return showApi.showResponse(response, err.message, null, null, 500);
          }
        } else {
          return showApi.showResponse(response, 'Data profile not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
  });
};

module.exports = {
  getProfile,
  updateProfile,
  updatePatchProfile
};
