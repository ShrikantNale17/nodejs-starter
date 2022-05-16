const mongoose = require('mongoose');
const validator = require('validator');
const {
  paginate,
  softDelete,
  private
} = require('./plugins');

const orgSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  }
}, {
  timestamps: true,
});

orgSchema.plugin(softDelete);
orgSchema.plugin(private);
orgSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The org's email
 * @param {ObjectId} [excludeOrgId] - The id of the org to be excluded
 * @returns {Promise<boolean>}
 */
orgSchema.statics.isEmailTaken = async function (email, excludeOrgId) {
  const org = await this.findOne({
    email,
    _id: {
      $ne: excludeOrgId
    }
  });
  return !!org;
};

/**
 * @typedef Organization
 */
const Organization = mongoose.model('organizations', orgSchema, "organizations");

module.exports = Organization;
