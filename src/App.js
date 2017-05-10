import React, { Component } from 'react';
import firebase from 'firebase';
import { Button } from 'muicss/react';
import FileUpload from './FileUpload';
import './App.css';
import logo from './logo.svg';

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      pictures: [],
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

  renderUserData() {
    if (this.state.user) {
      return (
        <div className="App-button">
          <FileUpload onUpload={this.handleUpload} />
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
              <div className="App-card" key={key}>
                <figure className="App-card-image">
                  <figCaption className="App-card-footer">
                    <img className="App-card-avatar" src={picture.photoURL} alt={picture.displayName} />
                    <span>{picture.displayName}</span>
                  </figCaption>
                  <img className="Card-image" src={picture.image} alt="" />
                </figure>
              </div>
            )).reverse()
          }
        </div>
      );
    }
    return <button onClick={this.handleAuth}>Login con Google</button>;
  }

  render() {
    return (
      <di className="App">
        <div className="App-header">
          <div className="App-logo-name">
            <img src={logo} alt="" className="App-logo" />
            <h2>Pseudogram</h2>
          </div>
          <div >
            {this.renderUserData()}
          </div>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </di>
    );
  }
}

export default App;
