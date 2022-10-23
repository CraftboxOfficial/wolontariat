import { Component, createSignal, onMount } from 'solid-js';
//@ts-ignore
import { Route, Routes } from 'solid-app-router';
import { styled } from 'solid-styled-components';
import { useLocations } from './LocationsProvider';
import { PostPage } from './pages/Post';
import { supabase } from './supabaseClient';

import { CreatePostPage } from './pages/CreatePost';
import { HomePage } from './pages/Home';

export interface PostI {
  id: number,
  created_at: Date,
  title: string,
  geolocation: {
    lat: number,
    lng: number
  },
  desc: string,
  images: string[],
  address: string
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

  const [ insertResult, setInsertResult ] = createSignal(null);
  const [ insertDesc, setInsertDesc ] = createSignal('');
  const [ insertGeoCode, setInsertGeoCode ] = createSignal('');
  const [ insertFile, setInsertFile ] = createSignal(null);
  const [ isUploading, setIsUploading ] = createSignal(false);

  //@ts-ignore
  const [ locations, { updateLocations } ] = useLocations();

  const MAXIMUM_FILE_SIZE = 1000000; //1 mb

  const insertPost = async (text: string, desc: string, loc: { lat: number, lng: number }, images: any[]) => {
    const data = await supabase.from('posts').insert({ title: text, geolocation: loc, desc: desc, images: images });
    if (data.error) {
      //@ts-ignore
      setInsertResult({ "data": null, "error": 'Database access denied' });
      return null;
    }
    //@ts-ignore
    setInsertResult({ "data": data, "error": null });
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

    // Demo user login (żeby mógł tworzyc posty).
    await supabase.auth.signInWithPassword({
      email: 'komiyi3831@cadolls.com',
      password: 'demouser1',
    }).then((res) => {
      if(res.error){
        console.error(res.error)
      }
    })

    //@ts-ignore
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

  function formatFileSize(bytes: any, decimalPoint: any) {
    if (bytes == 0) return '0 Bajtów';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = [ 'Bajtów', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[ i ];
  }


  const getGeoCode = async () => {

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
    }).then((res) => {
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
        await uploadFile(insertFile()).then(async (url) => {
          await insertPost(postText(), insertDesc(), { "lat": position.coords.latitude, "lng": position.coords.longitude }, url !== undefined ? [ url ] : []).then((res) => {
            //@ts-ignore
            if (res.error)
              //@ts-ignore
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


  const searchHandler = async () => {
    setIsLoading(true);
    await searchPostLocally(searchText()).then((res) => {
      console.log(res);
      const data = res;
      updateLocations({ "data": res })
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
  )
}
export default App;

const AppStyle = styled("div")(() => {
  return {
    width: "100%",
    height: "100vh",
    color: "#FFFFFF",
    overflow: "auto"
  }
})