import React, { Component } from 'react';
import './App.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: this.props.obj,
    };
  }
  
  render() {
    return (
      <div className="App-card">
        <figure className="App-card-image">
          <figCaption className="App-card-footer">
            <img className="App-card-avatar" src={this.state.picture.photoURL} alt={this.state.picture.displayName} />
            <span>{this.state.picture.displayName}</span>
          </figCaption>
          <img className="Card-image" src={this.state.picture.image} alt="" />
        </figure>
      </div>
    );
  }
}

export default Card;
