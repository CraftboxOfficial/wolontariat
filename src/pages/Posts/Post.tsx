import { Component } from "solid-js";
import { styled } from 'solid-styled-components';
import { PostI } from "../../App";



export const Post: Component<{ post: PostI }> = (props) => {

	return (
		<>
			<PostStyle>
				<img src="https://image.tmdb.org/t/p/original/2UElp7Dkm3SiB9ZEdKEWNmAOijB.jpg"></img>
				<div id="overlay">
					<span>{props.post.title}</span>
				</div>
			</PostStyle>
		</>
	)
}

const PostStyle = styled("div")(() => {
	return {
		maxWidth: "100%",
		height: "100%",
		// display: "flex",

		img: {
			maxWidth: "100%"
		},

		"#overlay": {
			position: "fixed"
		}
	}
})