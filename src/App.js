import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Chatbox from './components/Chatbox';
import ColorPicker from './components/ColorPicker';
import GameInfo from './containers/GameInfo';
import Login from './components/Login';
import {BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom'
import { withRouter } from "react-router";

function App() {
  return (
    <div className="App">
      <Login/>
      {/* <Header />
      <Canvas />
      <Chatbox />
      <ColorPicker />
      <GameInfo /> */}
    </div>
  );
}

export default App;
