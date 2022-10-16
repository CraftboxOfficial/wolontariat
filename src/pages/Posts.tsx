import { Component, For } from "solid-js";
import { styled } from 'solid-styled-components';
import { PostI } from "../App";
import { Post } from "./Posts/Post";

export const PostsPage: Component = () => {

	const a: PostI[] = [
		{
			id: 1,
			desc: "desc 1",
			geolocation: {
				lat: 1,
				lng: 1
			},
			created_at: new Date(),
			images: [],
			title: "title 1"
		},
		{
			id: 2,
			desc: "desc 2",
			geolocation: {
				lat: 1,
				lng: 1
			},
			created_at: new Date(),
			images: [],
			title: "title 2"
		},
		{
			id: 3,
			desc: "desc 3",
			geolocation: {
				lat: 1,
				lng: 1
			},
			created_at: new Date(),
			images: [],
			title: "title 3"
		}
	]

	return (
		<>
			<PostsPageStyle>
				<For each={a}>
					{(post) => (
						<Post post={post} />
					)}
				</For>

			</PostsPageStyle>
		</>
	)
}

const PostsPageStyle = styled("div")(() => {
	return {
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column"
	}
})