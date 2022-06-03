const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { private, paginate, softDelete } = require('./plugins');
// const { roles } = require('../config/roles');

const replySchema = mongoose.Schema(
    {
        reply: {
            type: String,
            required: true
        },
        repliedBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
    }
);

replySchema.plugin(softDelete);
replySchema.plugin(private);
replySchema.plugin(paginate);

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
 * @typedef Reply
 */
const Reply = mongoose.model('Replies', replySchema);

module.exports = Reply;
