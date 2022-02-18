import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { logError } from './utils';

const firebaseConfig = {
	apiKey: 'AIzaSyBArC1vwhEAi8iu5tqEhKlFylnoSss7uzo',
	authDomain: 'groselha-legality.firebaseapp.com',
	projectId: 'groselha-legality',
	appId: '1:1087712568216:web:bfea284ce7b05e1df4c1ed'
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
	prompt: 'select_account'
});

export const auth = getAuth();
auth.languageCode = 'pt_br';

export const signIn = () => signInWithRedirect(auth, provider);

getRedirectResult(auth).catch((error) => {
	logError(error, false);
});

export let user;
