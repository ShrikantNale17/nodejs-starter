const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createPost = {
    body: Joi.object().keys({
        // email: Joi.string().required().email(),
        // password: Joi.string().required().custom(password),
        caption: Joi.string().required(),
        image: Joi.string(),
        // role: Joi.string().required().valid('user', 'admin'),
    }),
};

const getPosts = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getPost = {
    params: Joi.object().keys({
        postId: Joi.string().custom(objectId),
    }),
};

const updatePost = {
    params: Joi.object().keys({
        postId: Joi.required().custom(objectId),
    }),
    // body: Joi.object()
    //     .keys({
    //         email: Joi.string().email(),
    //         password: Joi.string().custom(password),
    //         name: Joi.string(),
    //     })
    //     .min(1),
};

const commentOnPost = {
    params: Joi.object().keys({
        postId: Joi.required().custom(objectId),
    }),

    body: Joi.object().keys({
        comment: Joi.string().required()
    })
}

const replyToComment = {
    params: Joi.object().keys({
        commentId: Joi.required().custom(objectId),
    }),

    body: Joi.object().keys({
        reply: Joi.string().required()
    })
}

const updateOrg = {
    params: Joi.object().keys({
        orgId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            name: Joi.string(),
        })
        .min(1),
};

const deletePost = {
    params: Joi.object().keys({
        postId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    commentOnPost,
    replyToComment,
    updateOrg,
    deletePost,
};
