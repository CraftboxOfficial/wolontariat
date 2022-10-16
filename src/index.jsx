/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { getPosts } from './App';
import {LocationsProvider, useLocations} from './LocationsProvider';
import { createSignal, onMount } from 'solid-js';

const [postsSignal, setPostsSignal] = createSignal([]);

onMount(async () => {
  const posts = await getPosts();
  setPostsSignal(posts);
})

render(() => <LocationsProvider locations={postsSignal()}><App /></LocationsProvider>, document.getElementById('root'));
