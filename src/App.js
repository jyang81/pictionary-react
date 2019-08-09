import React from 'react';
import './App.css';
import Header from './components/Header';
import Canvas from './components/Canvas';
import CanvasDisplay from './components/CanvasDisplay';
import Chatbox from './components/Chatbox';
// import GameInfo from './containers/GameInfo';
import Login from './components/Login';
import GameManager from './components/GameManager';
import Profile from './components/Profile';
// import {BrowserRouter as Router, Route, Link, NavLink} from 'react-router-dom'
// import { withRouter } from "react-router";

// ======== LOCAL HOSTING URLS =========
// const gamesURL = 'http://localhost:3000/api/v1/games'
// const usersURL = 'http://localhost:3000/api/v1/users'
// const loginURL = 'http://localhost:3000/api/v1/login'
// const profileURL = 'http://localhost:3000/api/v1/profile'

// ======= HEROKU URLS =============
const gamesURL = 'https://react-pictionary-backend.herokuapp.com/api/v1/games'
const usersURL = 'https://react-pictionary-backend.herokuapp.com/api/v1/users'
const loginURL = 'https://react-pictionary-backend.herokuapp.com/api/v1/login'
const profileURL = 'https://react-pictionary-backend.herokuapp.com/api/v1/profile'

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
      word: '',
      gamesWon: 0,
      gameWillEnd: false
    }

    this.resetUserState = this.resetUserState.bind(this)
    this.setGameState = this.setGameState.bind(this)
    this.loginNewUser = this.loginNewUser.bind(this)
    this.createGame = this.createGame.bind(this)
    this.handleWin = this.handleWin.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.endGame = this.endGame.bind(this)
    this.logout = this.logout.bind(this)

    if (this.getToken()) {
      this.getProfile()
    }

  }

  getUsers() {
    let token = this.getToken()
    fetch(usersURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      // .then(json => console.log('users:', json))
  }


  getGameStatus() {
    let token = this.getToken()
      fetch(gamesURL, {
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
          gameId: game[0].id,
          drawer: game[0].drawer_name,
          word: game[0].word
        })
      }
      // console.log('here is game:',game)
      // console.log('here is state:',this.state)
    }

    setGameState(status) {
      if (status === 'Started') {
        this.setState({
          gameAlreadyStarted: true
        })
      }

      else if (status === 'End') {
        this.setState({gameWillEnd: true})
        setTimeout(() => {this.handleWin()}, 3000)
      }
    }

  loginNewUser(username) {
    fetch(loginURL, {
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
    // console.log('login:', json)
    if (json && json.jwt) {
      this.saveToken(json.jwt)
      this.getProfile()
    }
  })
  .then(_ => this.getGameStatus())
  .then(_ => this.getUsers())
  }

  getProfile = () => {
    let token = this.getToken()
    fetch(profileURL, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(json => {
      // console.log('profile:', json)
      this.setState({
        username: json.user.name,
        userId: json.user.id,
        gamesWon: json.user.games_won
      })
    })
  }

  resetUserState() {
    this.setState({
      gameAlreadyStarted: false,
      gameJoined: false,
      gameId: 0,
      drawer: '',
      word: ''
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
    // console.log('clicked')
    let token = this.getToken()
    fetch(gamesURL, {
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
      drawer: this.state.username,
      word: game.word
    }))
}

  joinGame() {
    this.getGameStatus()
    this.setState({
      gameJoined: true
    })
  }

  endGame() {
    let id = this.state.gameId
    let token = this.getToken()
    fetch(`${gamesURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(_ => this.resetUserState())
    // .then(_ => this.getProfile())
  }

  logout() {
    setTimeout(() => {
      this.removeToken()
      this.setState({
        username : '',
        userId: 0,
        gameAlreadyStarted: false,
        gameJoined: false,
        gameId: 0,
        drawer: '',
        word: '',
        gamesWon: 0
      })},600)
  }

  handleWin() {
    setTimeout(() => {
    if (this.state.username === this.state.drawer) {
      this.endGame()
    }
    else {
      this.resetUserState()
      this.getProfile()
    }}, 1000)
  }

  renderLogin() {
    if (this.state.username === '')  {
      return (
        <><div></div>
        <Login loginNewUser={this.loginNewUser}/>
        </>
      )
     }
     else {
      return (
        <Profile
          username={this.state.username}
          gamesWon={this.state.gamesWon}
          logout={this.logout}
        />
      )
     }
  }

  renderJoinButtons() {
    if (this.state.username !== '') {
      if (this.state.gameAlreadyStarted && this.state.gameJoined) {
        return
      }
      if (this.state.gameAlreadyStarted) {
        return (
          <div>
          <div>Click Join Game to guess the word!</div><br></br>
          <button onClick={() => this.joinGame()} className="ui button big-text">Join Game</button>
          </div>
        )
      }
      else {
        return (
          <div>
          <div>Click Create Game to be the drawer!</div><br></br>
          <button onClick={() => this.createGame()} className="ui button big-text">Create Game</button>
          </div>
        )
      }
    }
  }

  renderCanvas() {
    if (this.state.gameJoined) {
      if (this.state.drawer === this.state.username) {
        return <Canvas word={this.state.word} clearClientCanvas={this.clearClientCanvas} gameWillEnd={this.state.gameWillEnd}/>
      }
      else {
      return <CanvasDisplay drawer={this.state.drawer} gameWillEnd={this.state.gameWillEnd}/>
      }
    }
  }

  renderChatBox() {
    if (this.state.username !== '' && this.state.gameJoined) {
      return <Chatbox username={this.state.username} userId={this.state.userId}/>
    }
  }


  render() {
    return (
     <div className="App">
      <Header />
      <div className="parent" >
        {this.renderLogin()}
        {this.renderJoinButtons() }
        {this.renderCanvas()}
        {this.renderChatBox()}
      </div>
      <GameManager setGameState={this.setGameState} gameId={this.state.gameId}/>
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
