/* @refresh reload */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


import { render } from 'solid-js/web';

import './index.css';
import { Router } from 'solid-app-router';
import { FirebaseProvider } from 'solid-firebase';
import { App } from "./App";

const firebaseConfig = {
	apiKey: "AIzaSyCd2ypWuBLx-9EeUm8L9aJEGOn4cA1jEAc",
	authDomain: "dobrowraca-dev.firebaseapp.com",
	projectId: "dobrowraca-dev",
	storageBucket: "dobrowraca-dev.appspot.com",
	messagingSenderId: "193549306610",
	appId: "1:193549306610:web:ccfe6081efb72bde905e6b",
	measurementId: "G-588S4MEB35"
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


render(() => (
	<>
		<Router>
			<FirebaseProvider config={firebaseConfig}>
				<App />
			</FirebaseProvider>
		</Router>
	</>
), document.getElementById('root') as HTMLElement);
