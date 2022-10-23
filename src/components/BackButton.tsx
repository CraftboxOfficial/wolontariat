import { RiSystemArrowGoBackFill } from "solid-icons/ri";
import { Component, Show } from "solid-js";
import { styled } from 'solid-styled-components';
import { useNavigate } from 'solid-app-router';



export const BackButton: Component = (props) => {

	const navigate = useNavigate()

	return (
		<>
			<BackButtonStyle onClick={(e) => {
				navigate("/")
			}}>
				<RiSystemArrowGoBackFill size={24} />
			</BackButtonStyle>
		</>
	)
}

const BackButtonStyle = styled("button")(() => {
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
		border: "none",
		transition: "scale 100ms",


	}
})