import { supabase } from "../supabaseClient";
import { createSignal } from "solid-js";

const [email, setEmail] = createSignal('')
const [password, setPassword] = createSignal('')
const [confirmPassword, setConfirmPassword] = createSignal('')

const signUp = async () => {
  if(password !== confirmPassword)
    return console.error("password does not match")

  const {data, error} = await supabase.auth.signUp({
    email,
    confirmPassword,
  })
}

const LoginComponent = () => {
  return (
    <>
      <h4>Login</h4>
      <input type="email"></input>
      <input type="password"></input>
      <button>login</button>
    </>
  );
}

//TODO
const RegisterComponent = () => {
  return (
    <>
      <h4>Register</h4>
      <input type="email" onInput={(e) => {setEmail(e.target.value)}}></input>
      <input type="password" onInput={(e) => {setPassword(e.target.value)}}></input>
      <input type="password" onInput={(e) => {setConfirmPassword(e.target.value)}}></input>
      <button onClick={signUp}>register</button>
    </>
  );
}

const UserComponent = () => {
  return (
    <>
      <RegisterComponent />
    </>
  );
}

export default UserComponent;