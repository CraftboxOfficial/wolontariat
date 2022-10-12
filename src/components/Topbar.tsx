import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const Topbar: Component = () => {


	return (
		<>
			<TopbarStyle>
				<span>Topbar</span>
				<div id="search"></div>
				<div id="profile"></div>
			</TopbarStyle>
		</>
	)
}

const TopbarStyle = styled("div")(() => {
	return {
		height: "100%",
		// width: "100%",
		backgroundColor: "skyblue",
		display: "flex",
		flexDirection: "row",
		margin: "20px",
		borderRadius: "25px",
		padding: "10px",

		"#profile": {
			minWidth: "30px",
			width: "30px",
			minHeight: "30px",
			height: "100%",
			borderRadius: "50%",
			backgroundColor: "beige"
		}
	}
})