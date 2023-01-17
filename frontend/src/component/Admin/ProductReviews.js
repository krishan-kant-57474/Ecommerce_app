import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
	clearErrors,
	getAllReview,
	deleteReviews,
} from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import DeleteIcon from "@material-ui/icons/Delete";
import StarIcon from "@material-ui/icons/Star";
import SideBar from "./SideBar";
import { Fragment } from "react";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import { useEffect } from "react";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import { useState } from "react";

const ProductReviews = ({ history }) => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { error, reviews, loading } = useSelector(
		(state) => state.productReviews
	);

	const { error: deleteError, isDeleted } = useSelector(
		(state) => state.review
	);

	const [productId, setProductId] = useState("");

	const deleteReviewHandler = (reviewId) => {
		console.log(reviewId, productId);
		dispatch(deleteReviews(reviewId, productId));
	};

	const productReviewSubmitHandler = (e) => {
		e.preventDefault();
		dispatch(getAllReview(productId));
	};

	useEffect(() => {
		if (productId.length === 24) {
			dispatch(getAllReview(productId));
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}
		if (deleteError) {
			alert.error(deleteError);
			dispatch(clearErrors());
		}
		if (isDeleted) {
			alert.success("Review Delete Successfully");
			history.push("/admin/reviews");
			dispatch({ type: DELETE_REVIEW_RESET });
		}
		// dispatch(getAdminProduct());
	}, [dispatch, alert, error, deleteError, history, isDeleted, productId]);

	const columns = [
		{ field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
		{
			field: "user",
			headerName: "User",
			minWidth: 200,
			flex: 0.6,
		},
		{
			field: "comment",
			headerName: "Comment",
			minWidth: 350,
			flex: 1,
		},
		{
			field: "rating",
			headerName: "Rating",
			type: "number",
			minWidth: 180,
			flex: 0.4,
			cellClassName: (params) => {
				return params.getValue(params.id, "rating") >= 3
					? "greenColor"
					: "redColor";
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			type: "number",
			minWidth: 150,
			flex: 0.3,
			sortable: false,
			renderCell: (params) => {
				return (
					<Fragment>
						<Button
							onClick={() =>
								deleteReviewHandler(params.getValue(params.id, "id"))
							}
						>
							<DeleteIcon />
						</Button>
					</Fragment>
				);
			},
		},
	];

	const rows = [];

	reviews &&
		reviews.forEach((item) => {
			rows.push({
				id: item._id,
				rating: item.rating,
				comment: item.comment,
				user: item.name,
			});
		});

	console.log(reviews, "🙌");

	return (
		<Fragment>
			<MetaData title={`ALL RVIEWS - Admin`} />
			<div className="dashboard">
				<SideBar />
				<div className="productReviewsContainer">
					<form
						className="productReviewsForm"
						onSubmit={productReviewSubmitHandler}
					>
						<h1 className="productReviewsFormHeading">All REVIEWS</h1>
						<div>
							<StarIcon />
							<input
								type="text"
								placeholder="Product Id"
								required
								value={productId}
								onChange={(e) => setProductId(e.target.value)}
							/>
						</div>

						<Button
							id="createProductBtn"
							type="submit"
							disabled={
								loading ? true : false || productId === "" ? true : false
							}
						>
							Search
						</Button>
					</form>

					{reviews && reviews.length > 0 ? (
						<DataGrid
							rows={rows}
							columns={columns}
							pageSize={10}
							disableSelectionOnClick
							className="productListTable"
							autoHeight
						/>
					) : (
						<h1 className="productReviewsFormHeading">No Reviews Found</h1>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default ProductReviews;
