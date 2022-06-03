const httpStatus = require('http-status');
const {
    Post,
    Comment,
    Reply,
    PostUsers
} = require('../models');
// const Reply = require('../models/reply.model');
const ApiError = require('../utils/ApiError');

/**
 * Create an organization
 * @param {Object} orgBody
 * @returns {Promise<Post>}
 */
/* const createUser = async (orgBody) => {
    if (await PostUsers.isEmailTaken(orgBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists with this email');
    }
    return PostUsers.create({ ...orgBody, name: orgBody.company });
}; */

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (postBody) => {
    // if (await Post.isEmailTaken(postBody.email)) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Post already exists with this email');
    // }
    return Post.create(postBody);
};

/**
 * Query for posts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPosts = async (filter, options) => {
    const posts = await Post.paginate(filter, options);
    return posts;
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
    return Post.findById(id);
};

/**
 * Get post by email
 * @param {string} email
 * @returns {Promise<Post>}
 */

/* const getPostByEmail = async (email) => {
    return Post.findOne({
        email
    });
}; */

/**
 * Update post by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Post>}
 */
const updatePostById = async (postId, updateBody) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    }
    // if (updateBody.email && (await Post.isEmailTaken(updateBody.email, postId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Post already exists with this email');
    // }

    Object.assign(post, updateBody);
    await post.save();
    return post;
};

/**
 * Like post by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Post>}
 */
const likePostById = async (postId, updateBody) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    }
    // if (updateBody.email && (await Post.isEmailTaken(updateBody.email, postId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Post already exists with this email');
    // }

    const likes = post.likes.includes(updateBody.userId) ? post.likes.filter(user => JSON.stringify(user) !== JSON.stringify(updateBody.userId)) : [...post.likes, updateBody.userId];
    Object.assign(post, { likes });
    await post.save();
    return post;
};

/**
 * Like comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const likeCommentById = async (commentId, updateBody) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Comment not found');
    }
    // if (updateBody.email && (await Comment.isEmailTaken(updateBody.email, commentId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Comment already exists with this email');
    // }

    const likes = comment.likes.includes(updateBody.userId) ? comment.likes.filter(user => JSON.stringify(user) !== JSON.stringify(updateBody.userId)) : [...comment.likes, updateBody.userId];
    Object.assign(comment, { likes });
    await comment.save();
    return comment;
};

/**
 * Like comment by id
 * @param {ObjectId} replyId
 * @param {Object} updateBody
 * @returns {Promise<Reply>}
 */
const likeReplyById = async (replyId, updateBody) => {
    const reply = await Reply.findById(replyId);
    if (!reply) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Reply not found');
    }
    // if (updateBody.email && (await Reply.isEmailTaken(updateBody.email, replyId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Reply already exists with this email');
    // }

    const likes = reply.likes.includes(updateBody.userId) ? reply.likes.filter(user => JSON.stringify(user) !== JSON.stringify(updateBody.userId)) : [...reply.likes, updateBody.userId];
    Object.assign(reply, { likes });
    await reply.save();
    return reply;
};

const commentOnPostById = async (postId, updateBody) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    }
    // if (updateBody.email && (await Post.isEmailTaken(updateBody.email, postId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Post already exists with this email');
    // }
    const comment = await Comment.create(updateBody)
    const comments = [...post.comments, comment._id];

    Object.assign(post, { comments });
    await post.save();
    return comment;
};

const replyToComment = async ({ commentId }, updateBody) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Comment not found');
    }
    // if (updateBody.email && (await Post.isEmailTaken(updateBody.email, postId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Post already exists with this email');
    // }
    const reply = await Reply.create(updateBody)
    await Comment.findOneAndUpdate({ "_id": commentId }, { $push: { "replies": reply._id } })
    console.log(comment);
    const new_comment = await Comment.findById(commentId);

    return reply;
};

/**
 * Update organization by id
 * @param {ObjectId} orgId
 * @param {Object} updateBody
 * @returns {Promise<Organization>}
 */

/* const updateOrgById = async (orgId, updateBody) => {
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
}; */

/**
 * Delete post by id
 * @param {ObjectId} postId
 * @returns {Promise<Post>}
 */
const deletePostById = async (postId) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    }
    await post.delete();
    return post;
};

module.exports = {
    createPost,
    queryPosts,
    getPostById,
    updatePostById,
    likePostById,
    likeCommentById,
    likeReplyById,
    commentOnPostById,
    replyToComment,
    deletePostById,
};
