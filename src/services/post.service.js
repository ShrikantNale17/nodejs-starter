const httpStatus = require('http-status');
const {
    Post,
    PostUsers
} = require('../models');
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

const commentOnPostById = async (postId, updateBody) => {
    const post = await getPostById(postId);
    if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    }
    // if (updateBody.email && (await Post.isEmailTaken(updateBody.email, postId))) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Post already exists with this email');
    // }

    const comments = [...post.comments, updateBody];

    Object.assign(post, { comments });
    await post.save();
    return post;
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
    commentOnPostById,
    deletePostById,
};
