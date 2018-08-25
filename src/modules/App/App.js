import React, { Component } from 'react';
import './App.css';
import { hot } from "react-hot-loader"
import MapContainer from '../Map/MapContainer'
class App extends Component {
  render() {
    return (
      <div className="App">
				<MapContainer config={{
					libraries: ['drawing', 'geometry'],
					apiKey: 'AIzaSyD8yZTbBcEeiSy7J9Tn8dMCyQneAM3DQAA',
				}}/>
      </div>
    );
  }
}

export default hot(module)(App);
