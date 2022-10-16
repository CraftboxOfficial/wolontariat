/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { getPosts } from './App';
import { LocationsProvider, useLocations } from './LocationsProvider';
import { createSignal, onMount } from 'solid-js';
import { Router } from 'solid-app-router';

const [ postsSignal, setPostsSignal ] = createSignal([]);



render(() => {

  onMount(async () => {
    const posts = await getPosts();
    setPostsSignal(posts);
  })

  return (
    <>
      <LocationsProvider locations={postsSignal()}>
        <Router>
          <App />
        </Router>
      </LocationsProvider>
    </>)
}, document.getElementById('root') as HTMLElement);
