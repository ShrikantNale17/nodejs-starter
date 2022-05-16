const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { private, paginate, softDelete } = require('./plugins');
// const { roles } = require('../config/roles');

const commentSchema = mongoose.Schema(
    {
        comments: {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
            // default: []
        },
        // _org: {
        //   type: mongoose.Types.ObjectId,
        //   ref: "organizations"
        // },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

commentSchema.plugin(softDelete);
commentSchema.plugin(private);
commentSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The comment's email
 * @param {ObjectId} [excludeUserId] - The id of the comment to be excluded
 * @returns {Promise<boolean>}
 */
// commentSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//     const comment = await this.findOne({ email, _id: { $ne: excludeUserId } });
//     return !!comment;
// };

/**
 * Check if password matches the comment's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
// commentSchema.methods.isPasswordMatch = async function (password) {
//     const comment = this;
//     return bcrypt.compare(password, comment.password);
// };

// commentSchema.pre('save', async function (next) {
//     const comment = this;
//     if (comment.isModified('password')) {
//         comment.password = await bcrypt.hash(comment.password, 8);
//     }
//     next();
// });

/**
 * @typedef Comment
 */
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
