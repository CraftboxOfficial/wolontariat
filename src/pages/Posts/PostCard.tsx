import { Component, Show } from "solid-js";
import { styled } from 'solid-styled-components';
import { PostI } from "../../App";



export const PostCard: Component<{ post: PostI }> = (props) => {

	return (
		<>
			<PostStyle>
				<Show when={props.post.images[ 0 ]} fallback={
					<div id="img"></div>
				}>
					<img id="img" src={props.post.images[ 0 ]}></img>
				</Show>
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

		"#img": {
			maxWidth: "100%",
			minHeight: "200px",
			backgroundColor: "whitesmoke"
		},

		"#overlay": {
			// position: "absolute",
			// bottom: "10px"
		}
	}
})