import { Accessor, Component, createEffect, createSignal, JSXElement, onMount, Setter, Show } from 'solid-js';
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
	const [ isUploading, setIsUploading ] = createSignal(false)
	const [ insertDesc, setInsertDesc ] = createSignal('');
	const [ insertTitle, setInsertTitle ] = createSignal('');
	const [ insertAddress, setInsertAddress ] = createSignal('');
	const [ insertResult, setInsertResult ] = createSignal(null);
	const MAXIMUM_FILE_SIZE = 1000000; //1 mb

	createEffect(() => {
		console.log(selectedImage())
	})

	const insertPost = async (text: string, desc: string, loc: { lat: number, lng: number }, images: any[], address: string) => {
		const data = await supabase.from('posts').insert({ title: text, geolocation: loc, desc: desc, images: images, address: address });
		if (data.error) {
			//@ts-ignore
			setInsertResult({ "data": null, "error": 'Database access denied' });
			return null;
		}
		//@ts-ignore
		setInsertResult({ "data": data, "error": null });
		return data;
	}

	function formatFileSize(bytes: any, decimalPoint: any) {
		if (bytes == 0) return '0 Bajtów';
		var k = 1000,
			dm = decimalPoint || 2,
			sizes = [ 'Bajtów', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
			i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[ i ];
	}

	/**
   * It takes a file, uploads it to supabase, and returns the public url of the file
   * @param {any} file - the file to be uploaded
  */
	const uploadFile = async (file: any) => {
		if (file === null)
			return;

		// Max: 1mb
		if (file.size > MAXIMUM_FILE_SIZE) {
			setIsUploading(false);
			//@ts-ignore
			setInsertResult({ "data": null, "error": 'File too large' });
			throw new Error("File size too large")
		}

		const fileName = file.name;
		const fileSize = formatFileSize(file.size, 2);

		const fileExtension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
		const randomName = crypto.randomUUID();

		await supabase.storage.from('images').upload('public/' + randomName + "." + fileExtension, file, {
			cacheControl: '3600',
			upsert: true
		}).then((res: any) => {
			if (res.error) {
				setIsUploading(false);
				//@ts-ignore
				setInsertResult({ "data": null, "error": 'File upload failed' });
				throw new Error("File upload failed")
			}
		})

		const { data } = await supabase.storage.from('images').getPublicUrl('public/' + randomName + "." + fileExtension);
		return data.publicUrl;
	}

	const uploadHandler = async () => {
		setIsUploading(true);
		if (navigator.geolocation) {
			await navigator.geolocation.getCurrentPosition(async (position) => {
				await uploadFile(selectedImage()).then(async (url) => {
					await insertPost(insertTitle(), insertDesc(), { "lat": position.coords.latitude, "lng": position.coords.longitude }, url !== undefined ? [ url ] : [], insertAddress()).then((res) => {
						if (res.error)
							console.error(res.error);

						setIsUploading(false);
					})
				})
			}, (error) => {
				console.error(error);
			});
		} else {
			console.error('Browser does not support geolocation');
		}
	}

	return (
		<>
			<CreatePostStyle>
				<div id="back-button">
					<BackButton />
				</div>
				<div id="top">
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

				<Show when={insertResult() !== null}>
					{/*@ts-ignore*/}
					{insertResult().error !== null && <h5 style={{ color: 'tomato' }}>{insertResult().error}</h5>}
					{/*@ts-ignore*/}
					{insertResult().data !== null && <h5 style={{ color: 'lightgreen' }}>{"Success"}</h5>}
				</Show>
				<input id="title-input" type='text' placeholder="Tytuł..." value={insertTitle()} onInput={(e) => { setInsertTitle(e.target.value) }}></input>
				<input id="address-input" type='text' placeholder="Lokalizacja..." value={insertAddress()} onInput={(e) => { setInsertAddress(e.target.value) }}></input>
				<textarea id="description-input" placeholder="Opis..." value={insertDesc()} onInput={(e) => { setInsertDesc(e.target.value) }}></textarea>
				<button id="submit-post" onClick={uploadHandler}>Dodaj ogłoszenie</button>
			</CreatePostStyle>
		</>
	)
}

const CreatePostStyle = styled("div")(() => {
	return {
		margin: "auto",
		// width: "100%",
		height: "100%",
		maxWidth: "640px",
		display: "flex",
		flexDirection: "column",

		"#back-button": {
			position: "absolute",
			margin: "20px 0"
			// aspectRatio: "1 / 1",
			// // width: "20%",
			// // maxWidth: "80px",
			// margin: "5%",
			// // borderRadius: "25%",
			// border: "none"
		},

		"#top": {
			margin: "20px 0",
			height: "50px",
			display: "flex",
			flexDirection: "row",

			justifyContent: "center",

			"#page-title": {
				fontSize: "180%",
				alignSelf: "center",
				fontWeight: "bolder"
			}
		},

		"#image-input-div": {
			marginTop: "20px",
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


		"#title-input": {
			marginTop: "20px",
			backgroundColor: "#383838",
			border: "none",
			borderRadius: "10px",
			height: "48px",
			minHeight: "48px",
			fontSize: "140%",
			padding: "0 20px",
			color: "#FFFFFF"
		},

		"#title-input:focus": {
			outline: "none"
		},

		"#address-input": {
			marginTop: "20px",
			backgroundColor: "#383838",
			border: "none",
			borderRadius: "10px",
			height: "48px",
			minHeight: "48px",
			fontSize: "140%",
			padding: "0 20px",
			color: "#FFFFFF"
		},

		"#address-input:focus": {
			outline: "none"
		},

		"#description-input": {
			marginTop: "20px",
			backgroundColor: "#383838",
			border: "none",
			resize: "none",
			borderRadius: "10px",
			height: "200px",
			minHeight: "48px",
			fontSize: "140%",
			padding: "20px 20px",
			color: "#FFFFFF",
			fontFamily: "Arial"
		},

		"#description-input:focus": {
			outline: "none"
		},

		"#submit-post": {
			position: "fixed",
			bottom: "0",
			width: "100%",
			maxWidth: "640px",
			// marginLeft: "auto",
			// marginRight: "auto",
			// width: "calc(100% - 20px)",
			marginTop: "auto",
			marginBottom: "20px",
			minHeight: "48px",
			borderRadius: "10px",
			border: "none",
			fontSize: "140%"
		},
	}
})