const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: "avatars",
		// width: 300,
		crop: "scale",
	});

	console.log("T1");
	const { name, email, password } = req.body;
	console.log("T2");

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		},
	});
	sendToken(user, 201, res);
});

//Loing User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	console.log("T1");
	const { email, password } = req.body;

	//checking if user has given password and email both
	if (!email || !password) {
		return next(new ErrorHander("Please Enter Email & Password", 400));
	}

	const user = await User.findOne({ email }).select("+password");
	console.log(user);

	if (!user) {
		return next(new ErrorHander("Invalid email or password", 401));
	}
	// console.log(user);
	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched) {
		return next(new ErrorHander("Invalid email or password", 401));
	}

	sendToken(user, 200, res);
});

//Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	console.log("logout");

	res.status(200).json({
		success: true,
		message: "Logged Out",
	});
});

//Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	console.log(req.body.email);
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrorHander("User not found", 404));
	}
	//Get ResetPassword Token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	const resetPasswordUrl = `${req.protocol}://${req.get(
		"host"
	)}/password/reset/${resetToken}`;
	//for simple formate.
	const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it `;
	//for html formate.
	const html = `
  <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
  <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DreamKart.</h2>
  <p>Congratulations! You're almost set to start using NooB Geeks.
      Just click the button below to validate your email address.
  </p>
  <a href=${resetPasswordUrl} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Reset Your Password</a>
  <p>If the button doesn't work for any reason, you can also click on the link below:</p>
  <div>${resetPasswordUrl}</div>
  </div>
`;
	console.log("T2");
	try {
		await sendEmail({
			email: user.email,
			subject: `Password Reset`,
			message,
			html,
		});
		console.log("T5");

		res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorHander(error.message, 500));
	}
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	//creating token hash
	console.log(req.params.token, "1");
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	console.log(resetPasswordToken, "2");
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});
	if (!user) {
		return next(
			new ErrorHander(
				"Reset Password Token is invalid or has been expired",
				400
			)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHander("Password does not match", 400));
	}
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();
	sendToken(user, 201, res);
});

//Get User Detail

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	console.log("T1");
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
});

//Update User Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	console.log("updatePassword");
	const user = await User.findById(req.user.id).select("+password");
	// console.log(user);

	const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

	if (!isPasswordMatched) {
		return next(new ErrorHander("Old password is incorrent", 400));
	}

	if (req.body.newPassword !== req.body.confirmPassword) {
		return next(new ErrorHander("password does not match", 400));
	}
	user.password = req.body.newPassword;

	await user.save();

	sendToken(user, 200, res);
});

//Update User Profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
	console.log("updateProfile");

	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	};

	if (req.body.avatar !== "") {
		const user = await User.findById(req.user.id);
		const imagId = user.avatar.public_id;

		await cloudinary.v2.uploader.destroy(imagId);

		const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: "avatars",
			// width: 300,
			crop: "scale",
		});

		newUserData.avatar = {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		};
	}

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		// user,
	});
});

//Get all users (admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
	console.log("Get All users");
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

//Get single users(admin)

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(
			new ErrorHander(`User does not exist with Id:${req.params.id}`, 400)
		);
	}
	res.status(200).json({
		success: true,
		user,
	});
});

//Update User Role  --admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
	console.log("updateRole");

	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	};
	await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
	});
});

//Delete User --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHander(`User does not exist with Id:${req.params.id}`, 400)
		);
	}

	const imagId = user.avatar.public_id;

	await cloudinary.v2.uploader.destroy(imagId);

	await user.remove();
	res.status(200).json({
		success: true,
		message: "User Deleted Successfully",
	});
});
