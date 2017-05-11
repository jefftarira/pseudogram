import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';

firebase.initializeApp({
  apiKey: 'AIzaSyBvdzbXbOprUZU1j4WHxvnJf3oRDSPT4PM',
  authDomain: 'pseudogram-5d92d.firebaseapp.com',
  databaseURL: 'https://pseudogram-5d92d.firebaseio.com',
  projectId: 'pseudogram-5d92d',
  storageBucket: 'pseudogram-5d92d.appspot.com',
  messagingSenderId: '631394629372',
});

ReactDOM.render(
  <div className="main-container">
    <App />
  </div>,
  document.getElementById('root')
);
