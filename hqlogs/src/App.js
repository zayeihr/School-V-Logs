import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';



// Uses Firebase 9 copat because idk how to build with the acutal Firebase 9 API oops
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, deleteDoc, getDoc } from "firebase/firestore";



//Import Pages
import AddItem from './pages/AddItem';
import AddUser from './pages/AddUser';
import Admin from './pages/Admin';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import NavBar from './components/NavBar';
import ItemsTable from './pages/Items';
import Loans from './pages/Loans'; 
import Returns from './pages/Returns';
import AccessDenied from './pages/AccessDenied';
import AdminManageItems from './pages/AdminManageItems'
import SignOut from './pages/SignOut'




// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaM1tYHIUY4kDPBHPWCzMzPvr9QZ1X2T8",
  authDomain: "hq-store-18fb9.firebaseapp.com",
  projectId: "hq-store-18fb9",
  storageBucket: "hq-store-18fb9.appspot.com",
  messagingSenderId: "1085448679823",
  appId: "1:1085448679823:web:0977c2e7dbd9b9c9bf9bfa",
  measurementId: "G-TJDFNNBEES"
};
firebase.initializeApp(firebaseConfig);
//Initialise Firestore Database
const db = firebase.firestore();
const auth = firebase.auth();



//TODO: Maybe make this its own page?
function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

function App() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState('');
  const [isLoaded, setLoaded] = useState(false);
  const [uid, setUid] = useState(null);

  
  
  /* Use onAuthStateChanged to wait for user verfication before loading the app!
  the userData state will update when it has recieved auth state from Firebase */

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userUid = user.uid;
        setUid(userUid);

        // Fetch user data from Firestore based on UID
        db.collection('users')
          .doc(userUid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUserData(doc.data());
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    });
    return () => unsubscribe();
  }, []);
  console.log(userData)
  console.log(userData.admin)

  

  return  (
    <div className="App">
      
        <BrowserRouter>
        <NavBar userData={userData}/>
          <Routes>
            <Route path="/" element={ user ? <ItemsTable /> : <SignInForm/>} /> 
            <Route path="/add_item" element={  userData.admin ? <AddItem/> : <AccessDenied /> } />
            <Route path="/admin" element={  userData.admin ? <Admin/> : <AccessDenied /> } /> 
            <Route path="/loans" element={  userData.admin ? <Loans/> : <AccessDenied /> } />
            <Route path ="/return" element={user ? <Returns /> : <SignInForm/>} />  
            
            <Route path ="/add_user" element={  userData.admin ? <AddUser/> : <AccessDenied /> } />  
            <Route path ="/edit_items" element={  userData.admin ? <AdminManageItems/> : <AccessDenied /> } />
            <Route path ="/sign_out" element={  <SignOut /> } />
            
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
