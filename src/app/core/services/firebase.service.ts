// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD_7z7mzTaHD3JmS4Cml5vClfo3cvedPsI',
  authDomain: 'vlearning-67297.firebaseapp.com',
  databaseURL:
    'https://vlearning-67297-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'vlearning-67297',
  storageBucket: 'vlearning-67297.appspot.com',
  messagingSenderId: '125728227059',
  appId: '1:125728227059:web:cee552ddd11804a1e94186',
  measurementId: 'G-F9X8NCQ4GJ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
declare global {
  // var must be used for global scopes
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#type-checking-for-globalthis
  // eslint-disable-next-line no-var
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}
// window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcrH8cgAAAAADTfSKoKx9LOA0xlSPLlkmLpZLtK'),
  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});
// export const analytics = getAnalytics(app);
export const storage = getStorage(app);
