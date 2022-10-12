import { Component } from "solid-js";
import { styled } from 'solid-styled-components';

export const HomePage: Component = () => {


	return (
		<>
			<HomePageStyle>
				<span>Home Page</span>
			</HomePageStyle>
		</>
	)
}

const HomePageStyle = styled("div")(() => {
	return {
		height: "100%",
	}
})