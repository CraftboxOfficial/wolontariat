import logo from './logo.svg';
import styles from './App.module.css';
import {createSignal, onMount, For, Show, createContext, useContext} from 'solid-js'
import {supabase} from './supabaseClient'
import OpenLayersMap from './components/OpenLayersMap';
import GoogleMap from './components/GoogleMap';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {LocationsProvider, useLocations} from './LocationsProvider';

export const getPosts = async () => {
  const data = await supabase.from('posts').select();
  return data;
}

function App() {
  const [initialData, setInitialData] = createSignal([]);
  const [data, setData] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [postText, setPostText] = createSignal('');
  const [searchText, setSearchText] = createSignal('');
  const [searchResult, setSearchResult] = createSignal([]);
  const [useOpenLayers, setUseOpenLayers] = createSignal(false);

  const [locations, {updateLocations}] = useLocations();
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

  const insertPost = async (text) => {
    const data = await supabase.from('posts').insert({tekst: text})
    return data;
  }

  // Można raz wykonać requesta do bazy danych po posty i potem nimi manipulować przez createSignal.
  const searchPostLocally = async (text) => {
    const data = initialData().length == 0 ? await supabase.from('posts').select() : initialData()
    const array = data.data;
    const filteredResult = array.filter(post => post.tekst.toLowerCase().includes(text.toLowerCase()));
    return filteredResult;
  }

  // Albo wykonywać request za każdym razem.
  const searchPost = async (text) => {
    const data = await supabase.from('posts').select().like('tekst', `%${text}%`)
    return data.data;
  }

  onMount(async () => {
    const data = await supabase.from('posts').select();
    setInitialData(data);
    console.log(data);
    console.warn(initialData())
  });

  const fetchHandler = async () => {
    setIsLoading(true);
    await getPosts().then((res) => {
      console.log(res.data[0].tekst)
      const posts = res.data;
      let dataObject = [];
      posts.map((post) => {
        dataObject.push(post.tekst);
      })
      setData(dataObject);
      setIsLoading(false);
    })
  }

  const uploadHandler = async () => {
    setIsLoading(true);
    await insertPost(postText()).then((res) => {
      if(res.error)
        console.error(res.error);
    
      setIsLoading(false);
    })
  }

  const searchHandler = async () => {
    setIsLoading(true);
    await searchPostLocally(searchText()).then((res) => {
      console.log(res);
      const data = res;
      let dataObject = [];
      data.map(post => {
        dataObject.push(post.tekst);
      })
      setSearchResult(dataObject);
      
      setIsLoading(false);
    })
  }

  const clearMarkers = () => {
    updateLocations({"data": []})
  }
  
  const loadMarkersManual = async () => {
    const data = await supabase.from('posts').select();
    updateLocations(data);
  }

  return (
  <div>
      <Show when={isLoading()}>
        <h1>Loading...</h1>
      </Show>
      <button onClick={clearMarkers}>delete clusters</button>
      <button onClick={loadMarkersManual}>load manual</button>  
        {!useOpenLayers() && (
          <Show when={initialData() !== undefined}>
            <GoogleMap/>
          </Show>)
        }
      {useOpenLayers() && <OpenLayersMap/>}
      <label><input checked={useOpenLayers()} type="checkbox" onChange={() => {setUseOpenLayers(!useOpenLayers())}}/> use OpenLayers</label>
      <div className="object">
        <h2>getPosts() - data fetching</h2>
        <ul>
          <For each={data()} fallback={<h5>No data</h5>}>
            {(post) => <li>{post}</li>}
          </For>
        </ul>
        <button onClick={fetchHandler}>get data</button>
      </div>

      <div className="object">
        <h2>uploadPost(text) - data inserting</h2>
        <input value={postText()} onInput={(e) => {setPostText(e.target.value)}}></input>
        <p>{postText()}</p>
        <button onClick={uploadHandler}>post data</button>
      </div>

      <div className="object">
        <h2>searchPost(text) - data searching</h2>
        <input value={searchText()} onInput={(e) => {setSearchText(e.target.value)}}></input>
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
  );
}
export default App;
