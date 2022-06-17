const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
	userService
} = require('../services');

const createUser = catchAsync(async (req, res) => {
	const user = await userService.createUser({
		// _org: req.user._org,
		...req.body
	});
	res.status(httpStatus.CREATED).send(user);
});

const changePassword = catchAsync(async (req, res) => {
	const result = await userService.changePassword(req.user._id, req.body);
	res.status(httpStatus.OK).send({ message: 'Successfully Updated' });
})

const getUsers = catchAsync(async (req, res) => {
	const filter = pick(req.query, ['name', 'role']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await userService.queryUsers(filter, {
		...options,
		// populate: [{
		//   path: "_org",
		//   select: "_id name email"
		// }]
	});
	res.send(result);
});

const getUser = catchAsync(async (req, res) => {
	const user = await (await userService.getUserById(req.params.userId)).populate({ path: 'savedPosts', populate: [{ path: "likes createdBy comments.commentedBy comments.replies.repliedBy", select: "_id firstname lastname email image" }, { path: "comments.comment comments.replies.reply" }] })
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	res.send(user);
});

const getSavedPosts = catchAsync(async (req, res) => {
	const user = await (await userService.getSavedPosts(req.params.userId)).populate([
		{
			path: 'savedPosts',
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
		}
	])
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
	const user = await userService.updateUserById(req.params.userId, req.body)
	// .populate("_id firstname email");
	res.send(user);
});

const updateUserProfilePic = catchAsync(async (req, res) => {
	const user = await userService.updateUserById(req.params.userId, { image: req.file ? req.file.filename : '' })
	// .populate("_id firstname email");
	res.send(user);
});

const updateUserSavedPosts = catchAsync(async (req, res) => {
	const user = await (await userService.updateUserSavedPostsById(req.params.userId, req.params.postId))
		.populate([{
			path: 'savedPosts',
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
		}])
	// .populate("_id firstname email");
	res.send(user.savedPosts);
});

const updateOrg = catchAsync(async (req, res) => {
	const org = await userService.updateOrgById(req.params.orgId, req.body);
	res.send(org);
});

const deleteUser = catchAsync(async (req, res) => {
	await userService.deleteUserById(req.params.userId);
	res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
	createUser,
	getUsers,
	getUser,
	changePassword,
	getSavedPosts,
	updateUser,
	updateUserProfilePic,
	updateUserSavedPosts,
	deleteUser,
	updateOrg,
};
