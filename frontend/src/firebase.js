// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCLd1vlDXzWWPCGGRiKTmmwiP-Bk-Lknjo",
    authDomain: "zealthy-vivek.firebaseapp.com",
    databaseURL: "https://zealthy-vivek-default-rtdb.firebaseio.com",
    projectId: "zealthy-vivek",
    storageBucket: "zealthy-vivek.firebasestorage.app",
    messagingSenderId: "842116454892",
    appId: "1:842116454892:web:91265040fdda2f3184c8c9",
    measurementId: "G-RN1DCKGNQT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db };
