import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {signOut} from 'firebase/auth';
import 'firebase/compat/firestore';
import { auth } from '../firebase_config';

//TODO CLEAN UP IMPORTS 

function SignOut(){


signOut(auth);
window.location.assign('/')

}

export default SignOut