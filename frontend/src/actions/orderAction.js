import {
	CREATE_ORDER_REQUEST,
	CREATE_ORDER_SUCCESS,
	CREATE_ORDER_FAIL,
	MY_ORDERS_REQUEST,
	MY_ORDERS_SUCCESS,
	MY_ORDERS_FAIL,
	ALL_ORDERS_REQUEST,
	ALL_ORDERS_SUCCESS,
	ALL_ORDERS_FAIL,
	DELETE_ORDER_REQUEST,
	DELETE_ORDER_SUCCESS,
	DELETE_ORDER_FAIL,
	UPDATE_ORDER_REQUEST,
	UPDATE_ORDER_SUCCESS,
	UPDATE_ORDER_FAIL,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_DETAILS_FAIL,
	CLEAR_ERRORS,
} from "../constants/orderConstants";

import axios from "axios";

//Create order
export const createOrder = (order) => async (dispatch) => {
	console.log("action-order1");
	try {
		dispatch({ type: CREATE_ORDER_REQUEST });
		console.log("action-order2");

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		console.log("action-order3");

		const { data } = await axios.post("/api/v1/order/new", order, config);
		console.log("action-order4");

		dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
		console.log("action-order5");
	} catch (error) {
		console.log("action-order6", error.response.data.message);

		dispatch({
			type: CREATE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//myorders
export const myOrders = () => async (dispatch) => {
	console.log("action-1");
	try {
		dispatch({ type: MY_ORDERS_REQUEST });

		console.log("action-2");

		const { data } = await axios.get("/api/v1/orders/me");
		console.log("action-3");

		dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
	} catch (error) {
		console.log("action-4", error.response.data.message);

		dispatch({
			type: MY_ORDERS_FAIL,
			payload: error.response.data.message,
		});
	}
};

//get all orders(admin)
export const getAllOrders = () => async (dispatch) => {
	try {
		dispatch({ type: ALL_ORDERS_REQUEST });

		const { data } = await axios.get("/api/v1/admin/orders");

		dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
	} catch (error) {
		dispatch({
			type: ALL_ORDERS_FAIL,
			payload: error.response.data.message,
		});
	}
};

//update order(admin)
export const updateOrder = (id, order) => async (dispatch) => {
	try {
		dispatch({ type: UPDATE_ORDER_REQUEST });

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.put(
			`/api/v1/admin/order/${id}`,
			order,
			config
		);

		dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
	} catch (error) {
		dispatch({
			type: UPDATE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//delete order(admin)
export const deleteOrder = (id) => async (dispatch) => {
	try {
		dispatch({ type: DELETE_ORDER_REQUEST });

		const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
		console.log(data, "--😎");

		dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
	} catch (error) {
		console.log(error, "😎");
		dispatch({
			type: DELETE_ORDER_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Get Orders

export const getOrderDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: ORDER_DETAILS_REQUEST });

		console.log("action-2");

		const { data } = await axios.get(`/api/v1/order/${id}`);

		dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
	} catch (error) {
		console.log("action-4", error.response.data.message);

		dispatch({
			type: ORDER_DETAILS_FAIL,
			payload: error.response.data.message,
		});
	}
};

//Clear Errors
export const clearErrors = () => async (dispatch) => {
	dispatch({ type: CLEAR_ERRORS });
};
