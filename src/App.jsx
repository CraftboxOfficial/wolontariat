import logo from './logo.svg';
import styles from './App.module.css';
import {createSignal, onMount} from 'solid-js'
import {supabase} from './supabaseClient'

function App() {
  const [initialData, setInitialData] = createSignal([]);
  const [data, setData] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [postText, setPostText] = createSignal('');
  const [searchText, setSearchText] = createSignal('');
  const [searchResult, setSearchResult] = createSignal([]);

  const getPosts = async () => {
    const data = await supabase.from('posts').select();
    return data;
  }

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
  });

  return (
    <div>
      {isLoading() && <h1>Loading...</h1>}
      <div className="object">
        <h2>getPosts() - data fetching</h2>
        <ul>
          {data().map((post => {
          return(<li>{post}</li>)
        }))}
        </ul>
        <button onClick={async () => {
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
        }}>get data</button>
      </div>

      <div className="object">
        <h2>uploadPost(postText) - data inserting</h2>
        <input value={postText()} onInput={(e) => {setPostText(e.target.value)}}></input>
        <p>{postText()}</p>
        <button onClick={async () => {
          setIsLoading(true);
          await insertPost(postText()).then((res) => {
            setIsLoading(false);
          })
        }}>post data</button>
      </div>

      <div className="object">
        <h2>searchPost(postText) - data searching</h2>
        <input value={searchText()} onInput={(e) => {setSearchText(e.target.value)}}></input>
        {searchResult() && 
          <ul>
            {searchResult().map((post) => {
              return(<li>{post}</li>)
            })}
          </ul>
          }
        <p>{searchText()}</p>
        <button onClick={async () => {
          setIsLoading(true);
          await searchPost(searchText()).then((res) => {
            console.log(res);
            const data = res;
            let dataObject = [];
            data.map(post => {
              dataObject.push(post.tekst);
            })
            setSearchResult(dataObject);
            
            setIsLoading(false);
          })
        }}>search data</button>
      </div>
    </div>
  );
}

export default App;
