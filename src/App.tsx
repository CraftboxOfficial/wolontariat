import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, onMount, For, Show, createContext, useContext, Component } from 'solid-js';
//@ts-ignore
import { supabase } from './supabaseClient'
import {GoogleMap} from './components/GoogleMap';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { LocationsProvider, useLocations } from './LocationsProvider';
import { Route, Routes } from 'solid-app-router';
import { PostsPage } from './pages/Posts';
import { styled } from 'solid-styled-components';
import { PostPage } from './pages/Post';
import { PageNavigator } from './components/PageNavigator';
import { MapPage } from './pages/Map';
import UserComponent  from './components/UserComponent';

export interface PostI {
  id: number,
  created_at: Date,
  title: string,
  geolocation: {
    lat: number,
    lng: number
  },
  desc: string,
  images: string[]
}

export interface FetchedPosts {
  count: number | null,
  data: PostI[],
  error: string | null,
  status: number,
  statusText: string
}

export const searchPostByTitle = async (text: string) => {
  const data = await supabase.from('posts').select().like('title', `%${text}%`)
  return data.data as PostI[];
}

export const getPostById = async (id: number) => {
  const data = await supabase.from('posts').select().eq(`id`, id);
  return data as FetchedPosts;
}

export const getPosts = async () => {
  // const data = await supabase.from('posts').select().eq(`id`, 123);
  const data = await supabase.from('posts').select()
  return data as FetchedPosts;
}

export const App: Component = () => {
  const [ initialData, setInitialData ] = createSignal([]);
  const [ data, setData ] = createSignal([]);
  const [ isLoading, setIsLoading ] = createSignal(false);
  const [ postText, setPostText ] = createSignal('');
  const [ searchText, setSearchText ] = createSignal('');
  const [ searchResult, setSearchResult ] = createSignal([]);
  const [ useOpenLayers, setUseOpenLayers ] = createSignal(false);

  const [insertResult, setInsertResult] = createSignal(null);
  const [ insertDesc, setInsertDesc ] = createSignal('');
  const [ insertGeo, setInsertGeo ] = createSignal(null);

  //@ts-ignore
  const [ locations, { updateLocations } ] = useLocations();
  // const [locations, {updateLocations}] = useLocations();

  const insertPost = async (text: string, desc: string, loc: {lat: number, lng: number}) => {
    const data = await supabase.from('posts').insert({ title: text, geolocation: loc, desc: desc })
    if(data.error){
      //@ts-ignore
      setInsertResult({"data": null, "error": 'Database access denied'});
      return null;
    }
    //@ts-ignore
    setInsertResult({"data": data, "error": null});
    return data;
  }

  // Można raz wykonać requesta do bazy danych po posty i potem nimi manipulować przez createSignal.
  const searchPostLocally = async (text: string) => {
    const data: FetchedPosts = initialData().length == 0 ? await supabase.from('posts').select() : initialData()
    const array = data.data;
    const filteredResult = array.filter((post: any) => post.title.toLowerCase().includes(text.toLowerCase()));
    return filteredResult
  }

  // Albo wykonywać request za każdym razem.
  const searchPost = async (text: string) => {
    const data = await supabase.from('posts').select().like('title', `%${text}%`)
    return data.data as FetchedPosts;
  }

  onMount(async () => {
    const data = await supabase.from('posts').select();
    setInitialData(data);
    console.trace(data);
    console.trace(initialData())
  });

  const fetchHandler = async () => {
    setIsLoading(true);
    await getPosts().then((res) => {
      console.log(res.data[ 0 ].title)
      const posts = res.data;
      let dataObject: any[] = [];
      posts.map((post: any) => {
        dataObject.push(post.title);
      })
      //@ts-ignore
      setData(dataObject);
      setIsLoading(false);
    })
  }

  const uploadHandler = async () => {
    setIsLoading(true);
    if(navigator.geolocation){
      await navigator.geolocation.getCurrentPosition(async (position) => {
        //@ts-ignore
        await insertPost(postText(), insertDesc(), {"lat": position.coords.latitude, "lng": position.coords.longitude}).then((res) => {
          if (res.error)
            console.error(res.error);
    
          setIsLoading(false);
        })
      }, (error) => {

      });
    }else{
      
    }
  }

  const searchHandler = async () => {
    setIsLoading(true);
    await searchPostLocally(searchText()).then((res) => {
      console.log(res);
      const data = res;
      let dataObject: any[] = [];
      data.map((post: PostI) => {
        dataObject.push(post.title);
      })
      // @ts-ignore
      setSearchResult(dataObject);

      setIsLoading(false);
    })
  }

  const clearMarkers = () => {
    updateLocations({ "data": [] })
  }

  const loadMarkersManual = async () => {
    const data = await supabase.from('posts').select();
    updateLocations(data);
  }


  return (
    <>
      {/* <AppStyle>
        <Routes>
          <Route path={"/"} component={MapPage} />
          <Route path={"/search"} component={PostsPage} />
          <Route path={"/post/:postId"} component={PostPage} />
        </Routes>
        <PageNavigator />
      </AppStyle>
    </> */}
      <div>
        <Show when={isLoading()}>
          <h1>Loading...</h1>
        </Show>
        <button onClick={clearMarkers}>delete clusters</button>
        <button onClick={loadMarkersManual}>load manual</button>
        {!useOpenLayers() && (
          <Show when={initialData() !== undefined}>
            <GoogleMap />
          </Show>)
        }
        <UserComponent />
        <div class="object">
          <h2>getPosts() - data fetching</h2>
          <ul>
            <For each={data()} fallback={<h5>No data</h5>}>
              {(post) => <li>{post}</li>}
            </For>
          </ul>
          <button onClick={fetchHandler}>get data</button>
        </div>

        <div class="object">
          <h2>uploadPost(text) - data inserting</h2>
          <input value={postText()} onInput={(e: any) => { setPostText(e.target.value) }}></input>
          <textarea value={insertDesc()} onInput={(e: any) => { setInsertDesc(e.target.value) }}></textarea>
          <p>{postText()}</p>
          <Show when={insertResult() !== null}>
            {/*@ts-ignore*/}
            {insertResult().error !== null && <h5 style={{color: 'tomato'}}>{insertResult().error}</h5>}
            {/*@ts-ignore*/}
            {insertResult().data !== null && <h5 style={{color: 'lightgreen'}}>{"Success"}</h5>}
          </Show>
          <button onClick={uploadHandler}>post data</button>
        </div>

        <div class="object">
          <h2>searchPost(text) - data searching</h2>
          <input value={searchText()} onInput={(e: any) => { setSearchText(e.target.value) }}></input>
          {searchResult() &&
            <ul>
              <For each={searchResult()} fallback={<h5>No data</h5>}>
                {(post) => <li>{post}</li>}
              </For>
            </ul>
          }
          <p>{searchText()}</p>
          <button onClick={searchHandler}>search data</button>
        </div>
      </div>
    </>
  );
}
export default App;

const AppStyle = styled("div")(() => {
  return {
    height: "100vh",
    maxHeight: "100vh",
    // display: "flex"
  }
})