import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippinginfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import PinDropIcon from "@material-ui/icons/PinDrop";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import CheckoutSteps from "../Cart/CheckoutSteps.js";

const Shipping = ({ history }) => {
	const dispatch = useDispatch();
	const alert = useAlert();

	const { shippinginfo } = useSelector((state) => state.cart);
	const [address, setAddress] = useState(shippinginfo?.address);
	const [city, setCity] = useState(shippinginfo?.city);
	const [country, setCountry] = useState(shippinginfo?.country);
	const [state, setState] = useState(shippinginfo?.state);
	const [pinCode, setPinCode] = useState(shippinginfo?.pinCode);
	const [phoneNo, setPhoneNo] = useState(shippinginfo?.phoneNo);

	const shippingSubmit = (e) => {
		e.preventDefault();

		if (phoneNo.length < 10 || phoneNo.length > 10) {
			alert.error("Phone Number should be 10 digits Long");
			return;
		}
		dispatch(
			saveShippinginfo({ address, city, state, country, pinCode, phoneNo })
		);
		history.push("/order/confirm");
	};
	return (
		<Fragment>
			<MetaData title="Shipping Details" />
			<CheckoutSteps activeStep={0} />
			<div className="shippingContainer">
				<div className="shippingBox">
					<h2 className="shippingHeading">Shipping Details</h2>
					<form
						className="shippingForm"
						encType="multipart/form-data"
						onSubmit={shippingSubmit}
					>
						<div>
							<HomeIcon />
							<input
								type="text"
								autoComplete="off"
								placeholder="Address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>

						<div>
							<LocationCityIcon />
							<input
								type="text"
								autoComplete="off"
								placeholder="City"
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>
						<div>
							<PinDropIcon />
							<input
								type="number"
								autoComplete="off"
								placeholder="Pin Code"
								value={pinCode}
								onChange={(e) => setPinCode(e.target.value)}
							/>
						</div>
						<div>
							<PhoneIcon />
							<input
								type="number"
								autoComplete="off"
								placeholder="Phone Number"
								value={phoneNo}
								onChange={(e) => setPhoneNo(e.target.value)}
							/>
						</div>
						<div>
							<PublicIcon />
							<select
								required
								value={country}
								onChange={(e) => setCountry(e.target.value)}
							>
								<option value="">Country</option>
								{Country &&
									Country.getAllCountries().map((item) => (
										<option key={item.isoCode} value={item.isoCode}>
											{item.name}
										</option>
									))}
							</select>
						</div>

						{country && (
							<div>
								<TransferWithinAStationIcon />
								<select
									required
									value={state}
									onChange={(e) => setState(e.target.value)}
								>
									<option value="">State</option>
									{State &&
										State.getStatesOfCountry(country).map((item) => (
											<option key={item.isoCode} value={item.isoCode}>
												{item.name}
											</option>
										))}
								</select>
							</div>
						)}

						<input
							type="submit"
							value="Continue"
							className="shippingBtn"
							disabled={state ? false : true}
						/>
					</form>
				</div>
			</div>
		</Fragment>
	);
};

export default Shipping;
