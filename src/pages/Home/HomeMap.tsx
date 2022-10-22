import { Accessor, Component, createSignal, onMount, Show, Setter } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useNavigate } from 'solid-app-router';
import { FetchedPosts, getPosts } from '../../App';
import { GoogleMap } from '../../components/GoogleMap';



export const HomeMap: Component<{ data: Accessor<FetchedPosts | undefined> }> = (props) => {

	return (
		<>
			<HomeMapStyle>
				{/* <Show when={props.data()}> */}
				{/* TEMP DISABLED */}
				<GoogleMap />
				{/* </Show> */}
			</HomeMapStyle>
		</>
	)
}

//@ts-ignore
const HomeMapStyle = styled("div")(() => {
	return {
		"#map": {
			position: "fixed !important",
			left: "0",
			top: "0",
			// minWidth: "360px",
			// minHeight: "724px",
			width: "100%",
			height: "100%",
			maxWidth: "100vw",
			maxHeight: "100vh",
			overflow: "hidden",
			zIndex: "0"
		}
	}
})