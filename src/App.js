import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Chatbox from './components/Chatbox';
import ColorPicker from './components/ColorPicker';
import GameInfo from './containers/GameInfo';
// import SketchPad from './components/SketchPad';


function App() {
  return (
    <div className="App">
      <Header />
      <Canvas />
      <Chatbox />
      <ColorPicker />
      <GameInfo />
    </div>
  );
}

export default App;
