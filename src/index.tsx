/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { getPosts } from './App';
import { LocationsProvider, useLocations } from './LocationsProvider';
import { Accessor, createSignal, onMount, Setter } from 'solid-js';
import { Router } from 'solid-app-router';

const [ postsSignal, setPostsSignal ]: [ Accessor<any[]>, Setter<any[]> ] = createSignal([]);


render(() => {

  return (
    <>
      <LocationsProvider locations={postsSignal()}>
        <Router>
          <App />
        </Router>
      </LocationsProvider>
    </>)
}, document.getElementById('root') as HTMLElement);
