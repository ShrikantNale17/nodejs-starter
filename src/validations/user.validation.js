const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    currentPass: Joi.string().required(),
    newPass: Joi.string().required(),
  })
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstname: Joi.string(),
      lastname: Joi.string(),
      username: Joi.string(),
      bio: Joi.string().default(''),
      gender: Joi.string().default(''),
      DOB: Joi.string(),
      mobile: Joi.string()
    })
    .min(1),
};

const updateUserSavedPosts = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
    postId: Joi.required().custom(objectId)
  }),
};

const updateUserProfilePic = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      image: Joi.string().default('')
    })
};

// const updateOrg = {
//   params: Joi.object().keys({
//     orgId: Joi.required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       email: Joi.string().email(),
//       name: Joi.string(),
//     })
//     .min(1),
// };

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  changePassword,
  updateUser,
  updateUserProfilePic,
  updateUserSavedPosts,
  // updateOrg,
  deleteUser,
};
