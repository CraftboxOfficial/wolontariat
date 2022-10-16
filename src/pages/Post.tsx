import { useParams } from "solid-app-router";
import { Component, For } from "solid-js";
import { styled } from 'solid-styled-components';
import { PostI } from "../App";

export const PostPage: Component = () => {

	const params = useParams()

	return (
		<>
			<PostPageStyle>
				<span>post</span>
				<span> {params.postId}</span>
			</PostPageStyle>
		</>
	)
}

const PostPageStyle = styled("div")(() => {
	return {
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column"
	}
})