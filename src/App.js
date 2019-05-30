import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Canvas from './components/Canvas';
import CanvasDisplay from './components/CanvasDisplay';
import Chatbox from './components/Chatbox';
import GameInfo from './containers/GameInfo';
import Login from './components/Login';
// import {BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom'
// import { withRouter } from "react-router";



const GamesURL = 'http://localhost:3000/api/v1/games'
const UserURL = 'http://localhost:3000/api/v1/users'
const LoginURL = 'http://localhost:3000/api/v1/login'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      username : '',
      userId: 0,
      gameAlreadyStarted: false,
      gameJoined: false,
      gameId: 0,
      drawer: '',
      word: ''
    }
    // this.getUsers()
    this.loginNewUser = this.loginNewUser.bind(this)
    this.createGame = this.createGame.bind(this)
    this.joinGame = this.joinGame.bind(this)

    // if (this.getToken()) {
    //   this.getProfile()
    // }
    this.removeToken()

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


  getGameStatus() {
    let token = this.getToken()
      fetch(GamesURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(res => res.json())
      .then(json => this.setGame(json))
    }

    setGame(game) {
      if (game[0]) {
        this.setState({
          gameAlreadyStarted: true,
          gameId: game.id,
          drawer: game.drawer_name,
          word: game.word
        })
      }
      console.log('here is game:',game)
      console.log('here is state:',this.state)
    }

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
      .then(_ => this.getGameStatus())

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
      this.setState({
        username: json.user.name,
        userId: json.user.id
      })
    })
  }

  saveToken(jwt) {
    localStorage.setItem('jwt', jwt)
  }

  getToken(jwt) {
    return localStorage.getItem('jwt')
  }

  removeToken() {
    localStorage.removeItem('jwt')
  }

  createGame() {
    console.log('clicked')
    let token = this.getToken()
    fetch(GamesURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        drawer_id: this.state.userId,
        drawer_name: this.state.username
      })
    })
    .then(res => res.json())
    .then(game => this.setState({
      gameAlreadyStarted: true,
      gameJoined: true,
      gameId: game.id,
      drawer: game.drawer_name,
      word: game.word
    }))
    .then(_ => console.log('here is the state after creation:',this.state))
}

  joinGame() {
    this.setState({
      gameJoined: true
    })
  }

  renderCanvas() {
    if (this.state.gameJoined) {
      if (this.state.drawer === this.state.username) {
        return <Canvas word={this.state.word}/>
      }
      else {
      return <CanvasDisplay />
      }
    }
  }

  renderJoinButtons() {
    if (this.state.username !== '') {
      if (this.state.gameAlreadyStarted) {
        return <button onClick={() => this.joinGame()} className="ui button">Join Game</button>
      }
      else {
        return <button onClick={() => this.createGame()} className="ui button">Create Game</button>
      }
    }
  }


  render() {
    return (
     <div className="App">
      {this.state.username === '' ? (<Login loginNewUser={this.loginNewUser}/>) : (<div>Logged In As:{this.state.username}</div>)  }
      <Header />
      {this.renderJoinButtons() }
      {this.renderCanvas()}
      <Chatbox username={this.state.username} userId={this.state.userId}/>
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
