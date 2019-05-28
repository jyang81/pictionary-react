import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Chatbox from './components/Chatbox';
import GameInfo from './containers/GameInfo';

// import SketchPad from './components/SketchPad';
import Login from './components/Login';
import {BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom'
import { withRouter } from "react-router";
import { ActionCable } from 'actioncable-client-react'


const GamesURL = 'http://localhost:3000/api/v1/games'
const UserURL = 'http://localhost:3000/api/v1/users'
const LoginURL = 'http://localhost:3000/api/v1/login'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      username : ''
    }
    // this.getUsers()
    this.loginNewUser = this.loginNewUser.bind(this)
    if (this.getToken()) {
      this.getProfile()
    }
  }

  // getUsers() {
  //      fetch(UserURL, {
  //       method: 'GET'
  //     })
  //     .then(res => res.json())
  //     .then(json => this.setState({
  //       users: json
  //     }))
  // }

  loginNewUser(username) {
       fetch(LoginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          games_won: null,
          game_id: null
        })
      })
      .then(res => res.json())
      .then(json => {
        console.log('login:', json)
        if (json && json.jwt) {
          this.saveToken(json.jwt)
          this.getProfile()
        }
      })

  }

  getProfile = () => {
    let token = this.getToken()
    fetch('http://localhost:3000/api/v1/profile', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(json => {
      console.log('profile:', json)
      this.setState({username: json.user.name})
    })
  }

  saveToken(jwt) {
    localStorage.setItem('jwt', jwt)
  }

  getToken(jwt) {
    return localStorage.getItem('jwt')
  }


  render() {
    return (
     <div className="App">
      {this.state.username === '' ? (<Login loginNewUser={this.loginNewUser}/>) : (<div>Logged In As:{this.state.username}</div>)  }
      <Header />
      <Canvas />
      <Chatbox />
      <GameInfo />
    </div>
    )
  }
}

export default App;

  // contructor methods??
  // this.createUser('JonnyBoy')
    // this.createGame()
    // this.updateUser(12,6,)

    //-----------------------------------------
    // createUser(name) {
    //   fetch(UserURL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       name: name,
    //       games_won: null,
    //       game_id: null
    //     })
    //   })
    //   .then(res => res.json())
    //   .then(json => this.updateUser(json))
    // }

    // updateUser(userId, gameId, gamesWon = null) {
    //     fetch(UserURL + '/' + `${userId}`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       games_won: gamesWon,
    //       game_id: gameId
    //     })
    //   })
    //   .then(res => res.json())
    //   .then(json => console.log('patch info',json))
    // }

    // createGame() {
    //   fetch(GamesURL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({

    //     })
    //   })
    //   .then(res => res.json())
    //   .then(json => this.readGameId(json))
    // }

    // readGameId(game) {
    //   console.log(game.id)
    //   // this.removeGame(game.id)
    // }

    // removeGame(id) {
    //   fetch(GamesURL + '/' + `${id}`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //     }
    //   })
    //   .then(res => res.json())
    //   .then(json => console.log(json))
    // }
