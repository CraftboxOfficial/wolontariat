import { Accessor, Component, createEffect, createSignal, onMount, Setter, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import { FetchedPosts, getPosts } from '../App';
import { BackButton } from '../components/BackButton';



export const CreatePostPage: Component = (props) => {

	const [ initialData, setInitialData ]: [ Accessor<FetchedPosts | undefined>, Setter<FetchedPosts | undefined> ] = createSignal();

	onMount(async () => {
		const data = await getPosts()
		setInitialData(data)
	});

	const [ selectedImage, setSelectedImage ] = createSignal()

	createEffect(() => {
		console.log(selectedImage())
	})

	return (
		<>
			<CreatePostStyle>
				<div id="top">
					<BackButton />
					<span id="page-title">Dodaj ogłoszenie</span>
				</div>
				<div id="image-input-div" onClick={(e) => {
					const input = document.getElementById("image-input")

					input?.click()
				}}>
					<input id="image-input" type='file' accept='image/*' onInput={(e) => {
						//@ts-ignore
						if (e.target.files[ 0 ]) {
							//@ts-ignore
							setSelectedImage(e.target.files[ 0 ])
						}
					}}></input>
					<Show when={selectedImage()} fallback={
						<>
							<div id="no-image-text">
								<span>Dodaj zdjęcie</span>
							</div>
						</>
					}>
						<img src={URL.createObjectURL(selectedImage() as Blob)}></img>
					</Show>
				</div>

				<input id="title-input" type='text'></input>
				<textarea id="description-input"></textarea>
				<button id="submit-post">Dodaj ogłoszenie</button>
			</CreatePostStyle>
		</>
	)
}

const CreatePostStyle = styled("div")(() => {
	return {
		width: "100%",
		display: "flex",
		flexDirection: "column",

		"#top": {
			display: "flex",
			flexDirection: "row",

			button: {
				aspectRatio: "1 / 1",
				// width: "20%",
				// maxWidth: "80px",
				margin: "5%",
				// borderRadius: "25%",
				border: "none"
			},

			alignItems: "center",

			"#page-title": {
				fontSize: "180%"
			}
		},

		"#image-input-div": {
			display: "block",
			// outlineOffset: "-4px",
			border: "6px dashed",
			borderRadius: "10px",
			width: "calc(100% - 12px)",
			height: "150px",
			maxHeight: "150px",
			// aspectRatio: "1 / 1 ",

			"#no-image-text": {
				width: "100%",
				height: "100%",
				// margin: "auto",
				color: "#555555",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			},

			img: {
				// aspectRatio: "1 / 1 ",
				zIndex: "-1",
				borderRadius: "10px",
				width: "100%",
				height: "100%",
				maxWidth: "100%",
				maxHeight: "100%",
				objectFit: "cover",
			},

			"#image-input": {
				height: "0",
				display: "none"
			}
		},


	}
})