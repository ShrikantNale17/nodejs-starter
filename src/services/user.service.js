const httpStatus = require('http-status');
const {
  User,
  Organization
} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an organization
 * @param {Object} orgBody
 * @returns {Promise<User>}
 */
const createOrg = async (orgBody) => {
  if (await Organization.isEmailTaken(orgBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization already exists with this email');
  }
  return Organization.create({ ...orgBody, name: orgBody.company });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists with this email');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({
    email
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists with this email');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update organization by id
 * @param {ObjectId} orgId
 * @param {Object} updateBody
 * @returns {Promise<Organization>}
 */
const updateOrgById = async (orgId, updateBody) => {
  const org = await Organization.findById(orgId);
  if (!org) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization not found');
  }
  if (updateBody.email && (await Organization.isEmailTaken(updateBody.email, orgId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization already exists with this email');
  }
  Object.assign(org, updateBody);
  await org.save();
  return org;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  await user.delete();
  return user;
};

module.exports = {
  createUser,
  createOrg,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateOrgById,
  deleteUserById,
};
