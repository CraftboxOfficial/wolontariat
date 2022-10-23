import { useNavigate } from 'solid-app-router';
import { Accessor, Component, createEffect, createSignal, For, onMount, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { FetchedPosts, getPosts, PostI, searchPostByTitle } from '../App';
import { HomeMap } from './Home/HomeMap';

import { LocationsProvider, useLocations } from '../LocationsProvider';
import { FaSolidMapLocationDot } from 'solid-icons/fa'
import { RiSystemAddCircleFill } from 'solid-icons/ri'
import { TiThListOutline } from 'solid-icons/ti'

import { HomePost } from './Home/HomePost';




export const HomePage: Component = (props) => {

	const navigate = useNavigate()

	const [ showMap, setShowMap ] = createSignal(false)

	const [ initialData, setInitialData ]: [ Accessor<FetchedPosts | undefined>, Setter<FetchedPosts | undefined> ] = createSignal();

	onMount(async () => {
		const data = await getPosts()
		setInitialData(data)
	});


	const [ posts, setPosts ]: [ Accessor<PostI[]>, Setter<PostI[]> ] = createSignal([])


	const [ searchInput, setSearchInput ] = createSignal("")
	//@ts-ignore
	const [ locations, { updateLocations } ] = useLocations();

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
				updateLocations({ "data": r });
				setPosts(r)
			})

		} else {
			setPosts([])
		}
	})


	return (
		<>
			<HomeStyle>
				<span id="page-title">DobroWraca</span>
				<div id="top">
					<div id="search-bar">
						<input id="search-input" onInput={(e) => {
							clearTimeout(typingTimer)
							typingTimer = setTimeout(stoppedTyping, doneTypingInterval)
						}} placeholder="Szukaj..."></input>
					</div>
				</div>

				<div id="posts" style={{ display: showMap() ? "none" : "flex" }}>
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
				<HomeMap data={initialData} style={{ display: showMap() ? "block" : "none" }} />

				<div id='bottom-buttons'>
					<button onClick={(e) => setShowMap((prev) => !prev)}>{showMap() ? <TiThListOutline /> : <FaSolidMapLocationDot />}</button>
					<button onClick={(e) => { navigate("/create-post") }}><RiSystemAddCircleFill /></button>
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

		// overflow: "hidden",


		"#posts": {

			width: "calc(100% - 20px)",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			margin: "0 10px",
			// marginLeft: "10px",
			// marginRight: "10px"
			overflow: "auto",
			marginBottom: "25vh"
		},

		"#page-title": {
			fontSize: "180%",
			margin: "30px 0",
			fontWeight: "bolder"
		},

		"#top": {
			zIndex: "10",
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
		},

		"#bottom-buttons": {
			zIndex: "10",
			position: "fixed",
			bottom: "0",
			width: "100%",
			height: "140px",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			svg: {
				fontSize: "28px"
			},

			button: {
				aspectRatio: "1 / 1",
				width: "20%",
				maxWidth: "80px",
				margin: "5%",
				borderRadius: "25%",
				border: "none"
			},

		}
	}
})