import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
	const visitInstagram = () => {
		window.location = "https://www.instagram.com/krish_sharma1259";
	};
	return (
		<div className="aboutSection">
			<div></div>
			<div className="aboutSectionGradient"></div>
			<div className="aboutSectionContainer">
				<Typography component="h1">About Us</Typography>

				<div>
					<div>
						<Avatar
							style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
							src="https://res.cloudinary.com/dltzp2gwx/image/upload/v1662634371/avatars/tfe9qbbspgugyq663vuu.jpg"
							alt="Founder"
						/>
						<Typography>Krishan kant</Typography>
						<Button onClick={visitInstagram} color="primary">
							Visit Instagram
						</Button>
						<span>
							This is a sample wesbite made by @krishankant. Only with the
							purpose to learn MERN Stack
						</span>
					</div>
					<div className="aboutSectionContainer2">
						<Typography component="h2">Our Brands</Typography>
						<a
							href="https://www.linkedin.com/in/krishan-kant-15679021a/"
							target="blank"
						>
							<YouTubeIcon className="youtubeSvgIcon" />
						</a>

						<a href="https://www.instagram.com/krish_sharma1259" target="blank">
							<InstagramIcon className="instagramSvgIcon" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
