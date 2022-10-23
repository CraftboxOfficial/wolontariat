import { useNavigate } from 'solid-app-router';
import { Accessor, Component, createEffect, createSignal, For, onMount, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { FetchedPosts, getPosts, PostI, searchPostByTitle } from '../App';
import { HomeMap } from './Home/HomeMap';
import { FaSolidMapLocationDot } from 'solid-icons/fa'
import { RiSystemAddCircleFill } from 'solid-icons/ri'
import { TiThListOutline } from 'solid-icons/ti'

import { HomePost } from './Home/HomePost';
import { SkeletonPost } from './Home/SkeletonPost';
import { useLocations } from '../LocationsProvider';

export const HomePage: Component = (props) => {

	const navigate = useNavigate()

	const [ showMap, setShowMap ] = createSignal(false)

	const [ initialData, setInitialData ]: [ Accessor<FetchedPosts | undefined>, Setter<FetchedPosts | undefined> ] = createSignal();

	onMount(async () => {
		const data = await getPosts()
		//@ts-ignore
		setPosts(data.data?.sort((a:any,b:any) => {return b.id - a.id}))
		updateLocations({"data": data.data?.sort((a:any,b:any) => {return b.id - a.id})})
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
				updateLocations({ "data": r.sort((a:any,b:any) => {return b.id - a.id})});
				setPosts(r.sort((a:any,b:any) => {return b.id - a.id}))
			})

		} else {
			searchPostByTitle("").then((r) => {
				updateLocations({ "data": r.sort((a:any,b:any) => {return b.id - a.id})});
				setPosts(r.sort((a:any,b:any) => {return b.id - a.id}))
			})
		}
	})

	// const [ currentScroll, setCurrentScroll ] = createSignal(window.screenTop)

	createEffect(() => {
		if (showMap()) {
			window.scrollTo(0, 0)
		}
	})

	return (
		<>
			<HomeStyle>
				<span id="page-title" style={{ display: showMap() ? "none" : "block" }}>DobroWraca</span>
				<div id="top" style={(() => {
					if (showMap()) {
						return {
							position: "fixed",
							top: "0"
						}
					} else {
						return {
							position: "sticky"
						}
					}
				})()}>
					<div id="search-bar">
						<input id="search-input" onInput={(e) => {
							clearTimeout(typingTimer)
							typingTimer = setTimeout(stoppedTyping, doneTypingInterval)
						}} placeholder="Szukaj..."></input>
					</div>
				</div>

				<div id="posts" style={{ display: showMap() ? "none" : "flex" }}>
					<Show when={searchInput().length > 0} fallback={
						<>
							<For each={posts()} fallback={
								<>
									<SkeletonPost />
									<SkeletonPost />
									<SkeletonPost />
									<SkeletonPost />
									<SkeletonPost />
								</>
							}>
								{(post) => {
									return (
										<>
											<HomePost class="post" post={post} />
										</>
									)
								}}
							</For>
						</>
					}>
						<For each={posts()} fallback={
							<>
								<span>Nic nie mogliśmy znaleźć</span>
							</>
						}>
							{(post) => {
								return (
									<>
										<HomePost class="post" post={post} />
									</>
								)
							}}
						</For>
					</Show>
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
			overflow: "auto !important",
			marginBottom: "25vh",

			// ".post:hover": {
			// 	scale: "1.1",
			// 	transition: "scale 200ms"
			// }
		},

		"#page-title": {
			zIndex: "10",
			backgroundColor: "#2B2B2B",
			fontSize: "180%",
			padding: "30px 0",
			fontWeight: "bolder",
			textAlign: "center",
			width: "100%",
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
				border: "none",
				transition: "scale 100ms"
			},

			// "button:hover": {
			// 	scale: "1.1"
			// }

		},

	}
})