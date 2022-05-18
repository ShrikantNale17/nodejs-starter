const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService
} = require('../services');

const register = catchAsync(async (req, res) => {
  // const org = await userService.createOrg(req.body);
  let user;
  try {
    user = await userService.createUser({
      // _org: org._id,
      ...req.body
    });
  } catch (e) {
    // await org.remove();
    throw e;
  }
  user = await user.populate("firstname email");
  const {
    token,
    expires
  } = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    user,
    token,
    expires
  });
});

const login = catchAsync(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const {
    token,
    expires
  } = await tokenService.generateAuthTokens(user);
  res.send({
    user,
    token,
    expires
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const resetPasswordUrl = await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  console.log(resetPasswordUrl);
  // res.writeHead(200, {
  //   Location: `${resetPasswordUrl}`
  // }).end();
  // res.redirect(resetPasswordUrl + "")
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  const verificationEmailUrl = await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  console.log(verificationEmailUrl);
  // res.writeHead(301, {
  //   Location: `${verificationEmailUrl}`
  // }).end();
  // res.redirect(verificationEmailUrl + "")
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const self = catchAsync(async (req, res) => {
  res.send(req.user);
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  self
};