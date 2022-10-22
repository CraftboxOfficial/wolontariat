import { Accessor, Component, createSignal, onMount, Show, Setter, For, createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useNavigate } from 'solid-app-router';
import { supabase } from "../supabaseClient";
import { getPosts, FetchedPosts, PostI, searchPostByTitle } from '../App';
import { GoogleMap } from '../components/GoogleMap';
import { HomePost } from './Home/HomePost';



export const HomePage: Component = (props) => {

	const [ initialData, setInitialData ]: [ Accessor<FetchedPosts | undefined>, Setter<FetchedPosts | undefined> ] = createSignal();

	onMount(async () => {
		const data = await getPosts()
		setInitialData(data)
	});


	const [ posts, setPosts ]: [ Accessor<PostI[]>, Setter<PostI[]> ] = createSignal([])


	const [ searchInput, setSearchInput ] = createSignal("")

	let typingTimer: NodeJS.Timeout
	const doneTypingInterval = 300

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
		console.log(posts())
	})

	return (
		<>
			<HomeStyle>
				<div id="top">

					<div id="search-bar">
						<input id="search-input" onInput={(e) => {
							clearTimeout(typingTimer)
							typingTimer = setTimeout(stoppedTyping, doneTypingInterval)
						}} placeholder="Type here..."></input>
					</div>
				</div>

				<div id="posts">
					<Show when={posts().length > 0} fallback={
						<>
							<For each={initialData()?.data}>
								{(post) => {
									return (
										<>
											<HomePost post={post} />
										</>
									)
								}}
							</For>
						</>
					}>
					</Show>
					<For each={posts()}>
						{(post) => {
							return (
								<>
									<HomePost post={post} />
								</>
							)
						}}
					</For>
				</div>
			</HomeStyle>
		</>
	)
}

const HomeStyle = styled("div")(() => {
	return {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		// alignContent: "center",

		"#posts": {

			width: "calc(100% - 20px)",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			margin: "0 10px",
			// marginLeft: "10px",
			// marginRight: "10px"

		},

		"#top": {
			width: "100%",
			padding: "24px 0",
			// height: "100px",
			backgroundColor: "#2B2B2B",
			position: "sticky",
			top: "0",
			// justifySelf: "center",

			"#search-bar": {
				marign: "0 10px",
				margin: "auto",
				display: "flex",
				flexDirection: "row",
				width: "calc(100% - 20px)",
				minWidth: "340px",
				minHeight: "48px",
				backgroundColor: "#383838",
				borderRadius: "50px",
				maxWidth: "740px",

				"#search-input": {
					backgroundColor: "inherit",
					outline: "none",
					border: "none",
					margin: "0 20px",
					width: "100%",
					fontSize: "140%",
					color: "#FFFFFF"
					// height: "100%"
				}
			}
		}
	}
})