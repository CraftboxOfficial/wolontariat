import { Accessor, Component, createSignal, onMount, Show, Setter } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useNavigate } from 'solid-app-router';
import { supabase } from "../supabaseClient";
import { getPosts, FetchedPosts } from '../App';
import {GoogleMap} from '../components/GoogleMap';



export const MapPage: Component = (props) => {

	const [ initialData, setInitialData ]: [Accessor<FetchedPosts | undefined>, Setter<FetchedPosts | undefined>] = createSignal();

	onMount(async () => {
		const data = await getPosts()
		setInitialData(data)
	});


	return (
		<>
			<MapStyle>
				<Show when={initialData()}>
					{/* TEMP DISABLED */}
					<GoogleMap />
				</Show>
			</MapStyle>
		</>
	)
}

const MapStyle = styled("div")(() => {
	return {
		width: "100%",
	}
})