import { useParams } from "solid-app-router";
import { Component, For, createSignal, onMount, Accessor, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { PostI, getPostById } from '../App';
import { BackButton } from "../components/BackButton";

export const PostPage: Component = () => {

	const params = useParams()

	const [ post, setPost ]: [ Accessor<PostI | undefined>, Setter<PostI | undefined>] = createSignal()

	onMount(async () => {
		const post = (await getPostById(parseInt(params.postId))).data[0]
		setPost(post)
	})

	return (
		<>
			<PostPageStyle>
				<BackButton></BackButton>
				<div id="header">
					<Show when={post()?.images[ 0 ]} fallback={
						<div id="img"></div>
					}>
						<img id="img" src={post()?.images[ 0 ]}></img>
					</Show>
				</div>

				<div id="title">
					<span>{post()?.title}</span>
				</div>

				<div id="body">
					<span>{post()?.desc}</span>
				</div>

				<div id="fotter">
					<button>Chat</button>
				</div>
			</PostPageStyle>
		</>
	)
}

const PostPageStyle = styled("div")(() => {
	return {
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column",

		"#header": {
			display: "flex",
			justifyContent: "center",
			"#title": {
				position: "absolute"
			},

			"#img": {
				width: "90%",
				maxWidth: "90%",
				minHeight: "200px",
				backgroundColor: "whitesmoke"
			}
			// top: "100px"
		},

		"#fotter": {
			position: "fixed",
			bottom: "0",

			width: "100%",
			display: "flex",
			flexDirection: "row-reverse"
		}
	}
})