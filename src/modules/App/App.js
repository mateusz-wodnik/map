import React, { Component } from 'react';
import './App.css';
import { hot } from "react-hot-loader"
import MapContainer from '../Map/MapContainer'
class App extends Component {
  render() {
    return (
      <div className="App">
				<MapContainer />
      </div>
    );
  }
}

export default hot(module)(App);
