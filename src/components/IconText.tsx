import { RiSystemArrowGoBackFill } from "solid-icons/ri";
import { Component, Show, JSXElement, children } from 'solid-js';
import { styled } from 'solid-styled-components';



export const IconText: Component<{ children: JSXElement }> = (props) => {

	return (
		<>
			<PostStyle>
				{props.children}
			</PostStyle>
		</>
	)
}

const PostStyle = styled("div")(() => {
	return {
		display: "flex",
		flexDirection: "row",
		marginTop: "5px"
	}
})