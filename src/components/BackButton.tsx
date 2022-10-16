import { Component, Show } from "solid-js";
import { styled } from 'solid-styled-components';



export const BackButton: Component = (props) => {

	return (
		<>
			<PostStyle onClick={(e) => {
				window.history.back()
			}}>
				<span>Back</span>
			</PostStyle>
		</>
	)
}

const PostStyle = styled("button")(() => {
	return {
		minHeight: "25px",
		minWidth: "25px",
		maxWidth: "100px",
		maxHeight: "100px"
	}
})