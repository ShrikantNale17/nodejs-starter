const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const upload = require('../middlewares/imageUploader')
const {
    postService
} = require('../services');

const createPost = catchAsync(async (req, res) => {
    console.log(req.body);
    const post = await (await postService.createPost({
        createdBy: req.user._id,
        caption: req.body.caption,
        image: req.files.map(({ filename, path }) => ({ filename, path }))
    })).populate([{
        path: "createdBy likes",
        select: "_id firstname lastname image email"
    }, {
        path: "comments",
        populate: [{
            path: 'commentedBy likes',
            select: '_id firstname lastname image email'
        }, {
            path: 'replies',
            populate: {
                path: 'repliedBy likes',
                select: '_id firstname lastname image email'
            }
        }]
    }]);
    res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await postService.queryPosts(filter, {
        ...options,
        populate: [{
            path: "createdBy likes",
            select: "_id firstname lastname image email"
        }, {
            path: "comments",
            populate: [{
                path: 'commentedBy likes',
                select: '_id firstname lastname image email'
            }, {
                path: 'replies',
                populate: {
                    path: 'repliedBy likes',
                    select: '_id firstname lastname image email'
                }
            }]
        }]
    });
    res.send(result);
});

const getPost = catchAsync(async (req, res) => {
    const post = await (await postService.getPostById(req.params.postId))
        .populate([{
            path: "createdBy likes",
            select: "_id firstname lastname image email"
        }, {
            path: "comments",
            populate: [{
                path: 'commentedBy likes',
                select: '_id firstname lastname image email'
            }, {
                path: 'replies',
                populate: {
                    path: 'repliedBy likes',
                    select: '_id firstname lastname image email'
                }
            }]
        }]);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
    const post = await (await postService.updatePostById(req.params.postId, req.body))
        .populate("createdBy", "_id firstname lastname image email");
    res.send(post);
});

const likePost = catchAsync(async (req, res) => {
    const post = await (await postService.likePostById(req.params.postId, { userId: req.user._id }))
        .populate([{
            path: "createdBy likes",
            select: "_id firstname lastname image email"
        }, {
            path: "comments",
            populate: [{
                path: 'commentedBy likes',
                select: '_id firstname lastname image email'
            }, {
                path: 'replies',
                populate: {
                    path: 'repliedBy likes',
                    select: '_id firstname lastname image email'
                }
            }]
        }]);
    res.send(post);
});

const likeComment = catchAsync(async (req, res) => {
    const comment = await (await postService.likeCommentById(req.params.commentId, { userId: req.user._id }))
        .populate([{
            path: 'commentedBy likes',
            select: '_id firstname lastname image email'
        }, {
            path: 'replies',
            populate: {
                path: 'repliedBy likes',
                select: '_id firstname lastname image email'
            }
        }]);
    res.send(comment);
});

const likeReply = catchAsync(async (req, res) => {
    const reply = await (await postService.likeReplyById(req.params.replyId, { userId: req.user._id }))
        .populate([{
            path: 'repliedBy likes',
            select: '_id firstname lastname image email'
        }]);
    res.send(reply);
});

const commentOnPost = catchAsync(async (req, res) => {
    const comment = await (await postService.commentOnPostById(req.params.postId, { commentedBy: req.user._id, ...req.body }))
        .populate([{
            path: 'commentedBy likes',
            select: '_id firstname lastname image email'
        }, {
            path: 'replies',
            populate: {
                path: 'repliedBy likes',
                select: '_id firstname lastname image email'
            }
        }]);
    res.send(comment);
});

const replyToComment = catchAsync(async (req, res) => {
    const reply = await (await postService.replyToComment({ ...req.params }, { repliedBy: req.user._id, ...req.body }))
        .populate([{
            path: 'repliedBy likes',
            select: '_id firstname lastname image email'
        }]);
    res.send(reply);
});

const updateOrg = catchAsync(async (req, res) => {
    const org = await postService.updateOrgById(req.params.orgId, req.body);
    res.send(org);
});

const deletePost = catchAsync(async (req, res) => {
    await postService.deletePostById(req.params.postId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    likePost,
    likeComment,
    likeReply,
    commentOnPost,
    replyToComment,
    deletePost,
    updateOrg,
};
