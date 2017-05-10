import React, { Component } from 'react';
import './material-icon/css/material-icons.css';

class FileUpload extends Component {  
  constructor() {
    super();
    this.state = {
      uploadValue: 0,
    };
  }

  render() {
    return (
      <div className="margin-right">
        <input className="inputfile" type="file" name="file" id="file" onChange={this.props.onUpload} />
        <label htmlFor="file"><i className="md-icon md-24">file_upload</i></label>
      </div>
    );
  }
}

export default FileUpload;
