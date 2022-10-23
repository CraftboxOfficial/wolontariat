import { useParams } from "solid-app-router";
import { BsCalendarDateFill } from "solid-icons/bs";
import { FaSolidLocationDot } from "solid-icons/fa";
import { Accessor, Component, createSignal, onMount, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { getPostById, PostI } from '../App';
import { BackButton } from "../components/BackButton";
import { IconText } from '../components/IconText';

export const PostPage: Component = () => {

	const params = useParams()

	const [ post, setPost ]: [ Accessor<PostI | undefined>, Setter<PostI | undefined> ] = createSignal()

	

	onMount(async () => {
		const post = (await getPostById(parseInt(params.postId))).data[ 0 ]
		setPost(post)
	})

	window.onload = () => {
		window.scrollTo(0, 0)
	}

	return (
		<>
			<PostPageStyle>
				<div id="back-button">
					<BackButton />
				</div>
				
				<span id="page-title">Ogłoszenie</span>

				<Show when={post()} fallback={
					<div id="skeleton">
						<div id="header">
							{/* <div id="img"></div> */}
						</div>

						<div id="title">
						</div>
						<div id="info">
							<IconText>
								<FaSolidLocationDot />
								<div id="text"></div>
							</IconText>
							<IconText>
								<BsCalendarDateFill />
								<div id="text"></div>
							</IconText>
						</div>


						<div id="body">
							
						</div>

						<div id="fotter">
						</div>

					</div>
				}>
					<div id="header">
						<Show when={post()?.images[ 0 ]} fallback={
							// <div id="img"></div>
							<></>
						}>
							<img id="img" src={post()?.images[ 0 ]}></img>
						</Show>
					</div>

					<div id="title">
						<span>{post()?.title ? post()?.title : "brak tytułu"}</span>
					</div>
					<div id="info">
						<IconText>
							<FaSolidLocationDot />
							<span style={{ "margin-left": "5px" }}>{post()?.address ? post()?.address : 'Nieznany'}</span>
						</IconText>
						<IconText>
							<BsCalendarDateFill />
							<span style={{ "margin-left": "5px" }}>{post()?.created_at ? post()?.created_at.toString() : 'unknown'}</span>
						</IconText>
					</div>


					<div id="body">
						<span>{post()?.desc ? post()?.desc : "Brak opisu"}</span>
					</div>

					<div id="fotter">
					</div>
				</Show>

			</PostPageStyle>
		</>
	)
}

const PostPageStyle = styled("div")(() => {
	return {
		height: "100%",
		width: "100%",
		maxWidth: "640px",
		display: "flex",
		flexDirection: "column",
		margin: "auto",

		overflow: "auto !important",

		alignItems: "center",

		"#back-button": {
			position: "absolute",
			margin: "20px 0",
			width: "calc(100% - 20px)",
			maxWidth: "640px"
			// left: "20px"
		},

		// "#back-button:hover": {
		// 	scale: "1.1"
		// },

		"#page-title": {
			fontSize: "180%",
			margin: "30px 0",
			fontWeight: "bolder",
			textAlign: "center"
		},


		"#header": {
			width: "calc(100% - 20px)",
			maxWidth: "640px",
			display: "flex",
			justifyContent: "center",


			"#img": {
				marginTop: "20px",
				width: "calc(100% - 0px)",
				maxWidth: "640px",
				aspectRatio: "1 / 1 ",
				// maxWidth: "90%",
				minHeight: "200px",
				height: "fit-content",
				maxHeight: "400px",
				objectFit: "cover",
				objectPosition: "center",
				backgroundColor: "#383838",
				borderRadius: "10px"
			}
			// top: "100px"
		},

		"#title": {
			width: "calc(100% - 40px)",
			maxWidth: "640px",
			marginTop: "20px",
			// position: "absolute"
			backgroundColor: "#383838",
			borderRadius: "10px",
			fontSize: "180%",
			fontWeight: "bolder",
			padding: "10px"
		},

		"#info": {
			width: "calc(100% - 40px)",
			maxWidth: "640px",
			display: "flex",
			flexDirection: "column",
			marginTop: "10px",
			// backgroundColor: "#383838",
			borderRadius: "10px",
			padding: "10px",
			color: "#C5C5C5",
		},

		"#body": {
			width: "calc(100% - 40px)",
			maxWidth: "640px",
			marginTop: "20px",
			backgroundColor: "#383838",
			borderRadius: "10px",
			padding: "10px",
			fontSize: "100%"
		},

		"#fotter": {
			position: "fixed",
			bottom: "0",

			width: "100%",
			display: "flex",
			flexDirection: "row-reverse"
		},

		"#skeleton": {
			width: "100%",
			// margin: "0 auto",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",


			"#back-button": {
				position: "absolute",
				margin: "20px 0",
				width: "calc(100% - 20px)",
				maxWidth: "640px"
				// left: "20px"
			},

			// "#back-button:hover": {
			// 	scale: "1.1"
			// },

			"#page-title": {
				fontSize: "180%",
				margin: "30px 0",
				fontWeight: "bolder",
				textAlign: "center"
			},


			"#header": {
				width: "calc(100% - 20px)",
				maxWidth: "640px",
				display: "flex",
				justifyContent: "center",


				"#img": {
					marginTop: "20px",
					width: "calc(100% - 0px)",
					maxWidth: "640px",
					aspectRatio: "1 / 1 ",
					// maxWidth: "90%",
					minHeight: "200px",
					height: "200px",
					maxHeight: "400px",
					objectFit: "cover",
					objectPosition: "center",
					backgroundColor: "#383838",
					borderRadius: "10px",

					animationName: "skeleton-loading",
					animationDuration: "3s",
					animationIterationCount: "infinite"
				}
				// top: "100px"
			},

			"#title": {
				width: "calc(100% - 40px)",
				maxWidth: "640px",
				marginTop: "20px",
				height: "1rem",
				// position: "absolute"
				backgroundColor: "#383838",
				borderRadius: "10px",
				fontSize: "180%",
				fontWeight: "bolder",
				padding: "10px",

				animationName: "skeleton-loading",
				animationDuration: "3s",
				animationIterationCount: "infinite"
			},

			"#info": {
				width: "calc(100% - 40px)",
				maxWidth: "640px",
				display: "flex",
				flexDirection: "column",
				marginTop: "10px",
				// backgroundColor: "#383838",
				borderRadius: "10px",
				padding: "10px",
				color: "#C5C5C5",

				"#text": {
					width: "100px",
					borderRadius: "10px",
					marginLeft: "5px",

					animationName: "skeleton-loading",
					animationDuration: "3s",
					animationIterationCount: "infinite"
				}
			},

			"#body": {
				width: "calc(100% - 40px)",
				maxWidth: "640px",
				marginTop: "20px",
				backgroundColor: "#383838",
				borderRadius: "10px",
				padding: "10px",
				fontSize: "100%",
				height: "1rem",

				animationName: "skeleton-loading",
				animationDuration: "3s",
				animationIterationCount: "infinite"
			},

			"#fotter": {
				position: "fixed",
				bottom: "0",

				width: "100%",
				display: "flex",
				flexDirection: "row-reverse"
			}
		},

		"@keyframes skeleton-loading": {
			"0%": {
				backgroundColor: "#383838"
			},

			"50%": {
				backgroundColor: "#555555"
			},

			"100%": {
				backgroundColor: "#383838"
			}
		}
	}
})