import { Component, Show } from "solid-js";
import { styled } from 'solid-styled-components';
import { useNavigate } from 'solid-app-router';



export const PageNavigator: Component = (props) => {

	const navigate = useNavigate()

	return (
		<>
			<PostStyle>
				<button onClick={() => { navigate("/") }}>Explore</button>
				<button onClick={() => { navigate("/search") }}>Search</button>
			</PostStyle>
		</>
	)
}

const PostStyle = styled("div")(() => {
	return {
		width: "100%",
		position: "fixed",
		bottom: "0",
		backgroundColor: "skyblue",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",

		button: {
			aspectRatio: "1 / 1"
		}
	}
})