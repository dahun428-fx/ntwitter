import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAy9E9oR2A7hCPOrMQVpkrquwJh5tTl4do",
    authDomain: "ntwttier.firebaseapp.com",
    projectId: "ntwttier",
    storageBucket: "ntwttier.appspot.com",
    messagingSenderId: "753766466093",
    appId: "1:753766466093:web:40d2f059ef324b30c16ea4"
};

const app = initializeApp(firebaseConfig);
export default app;