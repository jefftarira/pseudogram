import React, { Component } from 'react';
import firebase from 'firebase';
import { Button } from 'muicss/react';
import FileUpload from './FileUpload';
import Card from './Card';
import './App.css';
import logo from './logo.svg';
import logoGoogle from './googleicon.png';

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0,
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val()),
      });
    });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage,
      });
    }, error => {
      console.log(error.message);
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL,
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  renderUploadButton() {
    if (this.state.uploadValue > 0 && this.state.uploadValue < 100) {
      return (
        <div className="margin-right">
          <div className="progress">
            <div className="indeterminate" />
          </div>
          <small>Subiendo {Math.round(this.state.uploadValue)}%</small>
        </div>
      );
    }
    return (<FileUpload onUpload={this.handleUpload} />);
  }

  renderUserData() {
    if (this.state.user) {
      return (
        <div className="App-button">
          {this.renderUploadButton()}
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <Button onClick={this.handleLogout}>Salir</Button>
        </div>
      );
    }
  }

  renderLoginButton() {
    // Si el usuario esta logueado
    if (this.state.user) {
      return (
        <div className="Card-container">
          {
            this.state.pictures.map((picture, key) => (
              <Card obj={picture} key={key} />
            )).reverse()
          }
        </div>
      );
    }
    return (
      <div>
        <button onClick={this.handleAuth} className="btn-login">
          <img className="logo-login" src={logoGoogle} alt="logo google" />
          <span>Login con google</span>
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-logo-name">
            <img src={logo} alt="" className="App-logo" />
            <h2>Pseudogram!</h2>
          </div>
          <div >
            {this.renderUserData()}
          </div>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
