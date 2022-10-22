import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, onMount, For, Show, createContext, useContext, Component } from 'solid-js';
//@ts-ignore
import { supabase } from './supabaseClient'
import OpenLayersMap from './components/OpenLayersMap';
// import GoogleMap from './components/GoogleMap';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { LocationsProvider, useLocations } from './LocationsProvider';
import { Route, Routes } from 'solid-app-router';
import { PostsPage } from './pages/Posts';
import { styled } from 'solid-styled-components';
import { PostPage } from './pages/Post';
import { PageNavigator } from './components/PageNavigator';
import { MapPage } from './pages/Map';
import { HomePage } from './pages/Home';
import { CreatePostPage } from './pages/CreatePost';
import { GoogleMap } from './components/GoogleMap';

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

  //@ts-ignore
  const [ locations, { updateLocations } ] = useLocations();
  // const [locations, {updateLocations}] = useLocations();

  const mapOptions = {
    center: {
      lat: 51.9194381,
      lng: 19.145136
    },
    streetViewControl: false,
    //mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: false,
    mapTypeControl: false,
    scaleControl: true,
    zoomControl: true,
    zoomControlOptions: {
      //style: google.maps.ZoomControlStyle.LARGE 
    },
    zoom: 6
  };

  const insertPost = async (text: string) => {
    const data = await supabase.from('posts').insert({ title: text })
    return data;
  }

  // Można raz wykonać requesta do bazy danych po posty i potem nimi manipulować przez createSignal.
  const searchPostLocally = async (text: string) => {
    //@ts-ignore
    const data: FetchedPosts = initialData().length == 0 ? await supabase.from('posts').select() : initialData()
    const array = data.data;
    const filteredResult = array.filter((post: any) => post.title.toLowerCase().includes(text.toLowerCase()));
    return filteredResult
  }

  // Albo wykonywać request za każdym razem.
  const searchPost = async (text: string) => {
    const data = await supabase.from('posts').select().like('title', `%${text}%`)
    //@ts-ignore
    return data.data as FetchedPosts;
  }

  onMount(async () => {
    const data = await supabase.from('posts').select();
    //@ts-ignore
    setInitialData(data);
    console.log(data);
    console.warn(initialData())
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
    await insertPost(postText()).then((res) => {
      if (res.error)
        console.error(res.error);

      setIsLoading(false);
    })
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
      <AppStyle>
        <Routes>
          <Route path={"/"} component={HomePage} />
          <Route path={"/post/:postId"} component={PostPage} />
          <Route path={"/create-post"} component={CreatePostPage} />
        </Routes>
      </AppStyle>
    </>
  );
}
export default App;

const AppStyle = styled("div")(() => {
  return {
    // height: "100%",
    // maxHeight: "100%",
    // display: "flex"
    width: "100%",
  }
})