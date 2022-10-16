import { useNavigate } from "solid-app-router";
import { Component, For, createContext, createSignal, Accessor, Setter, onMount, createEffect, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { PostI, getPosts, searchPostByTitle } from '../App';
import { PostCard } from "./Posts/PostCard";

export const PostsPage: Component = () => {

	const navigate = useNavigate()

	const [ getPosts, setPosts ]: [ Accessor<PostI[]>, Setter<PostI[]> ] = createSignal([])


	const [ searchInput, setSearchInput ] = createSignal("")

	let typingTimer: NodeJS.Timeout
	const doneTypingInterval = 1000

	let inputElem = document.getElementById("search-input")
	onMount(() => {
		inputElem = document.getElementById("search-input")
		// console.log(worker)
	})

	const stoppedTyping = () => {
		// @ts-expect-error
		setSearchInput(inputElem.value)
	}

	createEffect(() => {
		if (searchInput()) {

			searchPostByTitle(searchInput()).then((r) => {
				console.log(r)
				setPosts(r)
			})

		} else {
			setPosts([])
		}
	})

	createEffect(() => {
		console.log(getPosts())
	})

	return (
		<>
			<PostsPageStyle>
				<div id="search-bar">
					<input id="search-input" onInput={(e) => {
						clearTimeout(typingTimer)
						typingTimer = setTimeout(stoppedTyping, doneTypingInterval)
					}}></input>
				</div>
				{/* <Show when={getPosts().length > 0} fallback={(<span>No posts :(</span>)}> */}
				<For each={getPosts()}>
					{(post) => {

						return (
							<a href={`/post/${post.id}`}>
								<PostCard post={post} />
							</a>
						)
					}}
				</For>
				<div id="bottom-space"></div>
				{/* </Show> */}
			</PostsPageStyle>
		</>
	)
}

const PostsPageStyle = styled("div")(() => {
	return {
		overflow: "scroll",
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column",

		"#search-bar": {
			position: "sticky",
			top: "0"
		},

		"#bottom-space": {
			width: "100%",
			height: "25vh"
		}
	}
})