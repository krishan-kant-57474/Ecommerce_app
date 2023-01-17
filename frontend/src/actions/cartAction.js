import {
	ADD_TO_CART,
	REMOVE_CART_ITEM,
	SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
	console.log("h2");
	const { data } = await axios.get(`/api/v1/product/${id}`);
	console.log("h3");

	dispatch({
		type: ADD_TO_CART,
		payload: {
			product: data.product._id,
			name: data.product.name,
			price: data.product.price,
			image: data.product.images[0].url,
			stock: data.product.stock,
			quantity,
		},
	});

	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

//Remove from Cart

export const removeItemsFromCart = (id) => async (dispatch, getState) => {
	console.log(id, "--");
	dispatch({
		type: REMOVE_CART_ITEM,
		payload: id,
	});

	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

//SAVE SHIPPING INFO
export const saveShippinginfo = (data) => async (dispatch, getState) => {
	dispatch({
		type: SAVE_SHIPPING_INFO,
		payload: data,
	});

	localStorage.setItem("shippingInfo", JSON.stringify(data));
};
