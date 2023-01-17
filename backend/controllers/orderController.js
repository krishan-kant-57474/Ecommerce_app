const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
	const {
		shippingInfo,
		orderItem,
		paymentInfo,
		itemPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (
		!shippingInfo ||
		!orderItem ||
		!paymentInfo ||
		!itemPrice ||
		!taxPrice ||
		!shippingPrice ||
		!totalPrice
	) {
		console.log(
			"sorry  from the new order side",
			shippingInfo,
			orderItem,
			paymentInfo,
			itemPrice,
			taxPrice,
			shippingPrice,
			totalPrice
		);
	}
	console.log("new order-1", req.body);

	const order = await Order.create({
		shippingInfo,
		orderItem,
		paymentInfo,
		itemPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt: Date.now(),
		user: req.user._id,
	});

	console.log("new order-2", order);

	res.status(201).json({
		success: true,
		order,
	});
});

//get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	);
	console.log(order);

	if (!order) {
		return next(new ErrorHander("Order not Found with this Id", 404));
	}
	res.status(201).json({
		success: true,
		order,
	});
});

//get logged in user Order
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
	const orders = await Order.find({ user: req.user._id });
	console.log(orders);
	res.status(201).json({
		success: true,
		orders,
	});
});

//get all Order --admin
exports.getAllOrder = catchAsyncErrors(async (req, res, next) => {
	console.log("getAllorder");
	const orders = await Order.find();
	let totalAmount = 0;

	orders.forEach((order) => {
		totalAmount += order.totalPrice;
	});

	console.log(orders);
	res.status(201).json({
		success: true,
		totalAmount,
		orders,
	});
});

//update Order Status --admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
	console.log("updateorder");
	const order = await Order.findById(req.params.id);
	if (!order) {
		return next(new ErrorHander("Order not Found with this Id", 404));
	}
	if (order.orderStatus === "Delivered") {
		return next(new ErrorHander("You have already deliverd this order", 400));
	}
	if (req.body.status === "Shipped") {
		order.orderItem.forEach(async (order) => {
			await updateStock(order.product, order.quantity);
		});
	}

	order.orderStatus = req.body.status;

	if (req.body.status == "Deliverd") {
		order.deliveredAt = Date.now();
	}
	await order.save({ validateBeforeSave: false });

	console.log(order);
	res.status(201).json({
		success: true,
	});
});

async function updateStock(id, quantity) {
	const product = await Product.findById(id);
	product.stock -= quantity;
	await product.save({ validateBeforeSave: false });
}

//delete Order --admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
	console.log("deleteorder");
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new ErrorHander("Order not Found with this Id", 404));
	}
	await order.remove();

	res.status(201).json({
		success: true,
	});
});
