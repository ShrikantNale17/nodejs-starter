const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { private, paginate, softDelete } = require('./plugins');
// const { roles } = require('../config/roles');

const postSchema = mongoose.Schema(
    {
        caption: {
            type: String,
            required: true
        },
        likes: {
            type: Array,
            default: []
        },
        comments: [
            {
                comment: {
                    type: String
                },
                commentedBy: {
                    type: mongoose.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],

        // default: []

        // _org: {
        //   type: mongoose.Types.ObjectId,
        //   ref: "organizations"
        // },
        image: {
            type: Array,
            default: []
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

postSchema.plugin(softDelete);
postSchema.plugin(private);
postSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The post's email
 * @param {ObjectId} [excludeUserId] - The id of the post to be excluded
 * @returns {Promise<boolean>}
 */
// postSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//     const post = await this.findOne({ email, _id: { $ne: excludeUserId } });
//     return !!post;
// };

/**
 * Check if password matches the post's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
// postSchema.methods.isPasswordMatch = async function (password) {
//     const post = this;
//     return bcrypt.compare(password, post.password);
// };

// postSchema.pre('save', async function (next) {
//     const post = this;
//     if (post.isModified('password')) {
//         post.password = await bcrypt.hash(post.password, 8);
//     }
//     next();
// });

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
