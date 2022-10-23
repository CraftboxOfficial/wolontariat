import { RiSystemArrowGoBackFill } from "solid-icons/ri";
import { Component, Show } from "solid-js";
import { styled } from 'solid-styled-components';



export const BackButton: Component = (props) => {

	return (
		<>
			<PostStyle onClick={(e) => {
				window.history.back()
			}}>
				<RiSystemArrowGoBackFill size={24}/>
			</PostStyle>
		</>
	)
}

const PostStyle = styled("button")(() => {
	return {
		minHeight: "25px",
		minWidth: "25px",
		maxWidth: "100px",
		maxHeight: "100px",
		aspectRatio: "1 / 1",
		width: "50px",
		// maxWidth: "80px",
		// margin: "5%",
		borderRadius: "10px",
		border: "none"
	}
})