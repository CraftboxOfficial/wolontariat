import { supabase } from "../supabaseClient";
import { createSignal, Show, onMount } from "solid-js";

const [registration, setRegistration] = createSignal(true);

const [email, setEmail] = createSignal('')
const [password, setPassword] = createSignal('')
const [confirmPassword, setConfirmPassword] = createSignal('')

const [isLoading, setIsLoading] = createSignal(false);
const [loggedIn, setLoggedIn] = createSignal(false);

const [currentUser, setCurrentUser] = createSignal(null);

const signUp = async () => {
  if (password() !== confirmPassword())
    return console.error("password does not match")
  
  setIsLoading(true);
  
  const pass = password()
  const mail = email()
  console.trace(pass, mail)
  
  await supabase.auth.signUp({
    //@ts-ignore
    email: mail,
    password: pass,
  }).then((res) => {
    if(res.error){
      console.error(res.error)
    }
    console.trace(res);
    setIsLoading(false);
  })
}

const signIn = async () => {
  setIsLoading(true);
  
  const pass = password()
  const mail = email()
  console.trace(pass, mail)
  
  await supabase.auth.signInWithPassword({
    //@ts-ignore
    email: mail,
    password: pass,
  }).then((res) => {
    if(res.error){
      console.error(res.error)
    }
    console.trace(res);
    setIsLoading(false);
  })
}

const logOut = async () => {
  await supabase.auth.signOut();
}

const UserComponent = () => {
  const LoginComponent = () => {
    return (
      <>
        <h4>Login</h4>
        <input type="email" onInput={(e) => { setEmail((e.target as HTMLInputElement).value) }}></input>
        <input type="password" onInput={(e) => { setPassword((e.target as HTMLInputElement).value) }}></input>
        <button onClick={signIn}>login</button>
      </>
    );
  }
  
  const RegisterComponent = () => {
    return (
      <>
        <h4>Register</h4>
        <input type="email" onInput={(e) => { setEmail((e.target as HTMLInputElement).value) }}></input>
        <input type="password" onInput={(e) => { setPassword((e.target as HTMLInputElement).value) }}></input>
        <input type="password" onInput={(e) => { setConfirmPassword((e.target as HTMLInputElement).value) }}></input>
        <button onClick={signUp}>register</button>
      </>
    );
  }
  
  const authComponent = () => {
    return (      
      <Show when={registration()} fallback={<LoginComponent></LoginComponent>}>
        <RegisterComponent />
      </Show>
    )
  }
  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN'){
      setLoggedIn(true);
      //@ts-ignore
      setCurrentUser({"email": session?.user.email})
      console.trace(currentUser())
    }else{
      setCurrentUser(null)
      setLoggedIn(false);
    }
  })
  return (
    <>
      <Show when={loggedIn()} fallback={authComponent}>
          <p>{JSON.stringify(currentUser())}</p>
          <button onClick={logOut}>Logout</button>
      </Show>
      <label><input type="checkbox" onChange={(e) => {setRegistration(!registration())}} checked={registration()}></input>register?</label>
    </>
  );
}

export default UserComponent;