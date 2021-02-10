import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import firebase from 'firebase/app';

var app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
});

export const auth = app.auth();
const firestore = app.firestore()

export const db = {
    questions: firestore.collection('questions'),
    exams: firestore.collection('exams'),
    answers: firestore.collection('answers'),
    formatDoc: doc =>
    {
        return {
            id: doc.id,
            ...doc.data(),
        }
    },
    getCurrentTimeStamp: firebase.firestore.FieldValue.serverTimestamp
}
export const storage = app.storage();
export default app;
