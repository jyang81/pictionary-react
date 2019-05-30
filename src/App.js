import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Canvas from './components/Canvas';
import CanvasDisplay from './components/CanvasDisplay';
import Chatbox from './components/Chatbox';
// import GameInfo from './containers/GameInfo';
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
      word: '',
      gamesWon: 0
    }

    this.resetUserState = this.resetUserState.bind(this)
    this.loginNewUser = this.loginNewUser.bind(this)
    this.createGame = this.createGame.bind(this)
    this.handleWin = this.handleWin.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.endGame = this.endGame.bind(this)

    // if (this.getToken()) {
    //   this.getProfile()
    // }
    this.removeToken()


  }

  getUsers() {
    let token = this.getToken()
       fetch(UserURL, {
        method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
      })
      .then(res => res.json())
      .then(json => console.log('users:', json))
  }


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
}

  joinGame() {
    this.setState({
      gameJoined: true
    })
  }

  endGame() {
    let id = this.state.gameId
    let token = this.getToken()
    fetch(GamesURL + '/' + `${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(_ => this.resetUserState())
    .then(_ => this.getProfile())
  }

  handleWin() {
    if (this.state.username === this.state.drawer) {
      this.endGame()
    }
    else {
      this.resetUserState()
      this.getProfile()
    }
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
      <div className="width-250">
        <div class="ui card">
          <div class="content">
            <div class="meta">
              <span class="date">Username:</span>
            </div>
            <br></br>
            <a class="header">{this.state.username}</a>
          </div>
          <div class="extra content">
              <i class="trophy icon"></i>
              Games Won: {this.state.gamesWon}
          </div>
        </div>
      </div>
      )
     }
  }

  renderJoinButtons() {
    if (this.state.username !== '') {
      if (this.state.gameAlreadyStarted && this.state.gameJoined) {
        return
      }
      if (this.state.gameAlreadyStarted) {
        return <button onClick={() => this.joinGame()} className="ui button big-text">Join Game</button>
      }
      else {
        return <button onClick={() => this.createGame()} className="ui button big-text">Create Game</button>
      }
    }
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

  renderChatBox() {
    if (this.state.username !== '' && this.state.gameJoined) {
      return <Chatbox handleWin ={this.handleWin} username={this.state.username} userId={this.state.userId}/>
    }
  }


  render() {
    return (
     <div className="App">
      <Header />
      <container className="parent" >
        {this.renderLogin()}
        {this.renderJoinButtons() }
        {this.renderCanvas()}
        {this.renderChatBox()}
      </container>
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
