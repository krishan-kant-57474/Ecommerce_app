import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
	const { loading, isAuthenticated, user } = useSelector((state) => state.user);

	console.log(user, isAdmin, "🤢");
	return (
		<Fragment>
			{loading === false && (
				<Route
					{...rest}
					render={(props) => {
						if (isAuthenticated === false) {
							return <Redirect to="/login" />;
						}
						if (isAdmin === true && user.role !== "admin") {
							console.log("🤢");
							return <Redirect to="/login" />;
						}
						return <Component {...props} />;
					}}
				/>
			)}
		</Fragment>
	);
};

export default ProtectedRoute;
