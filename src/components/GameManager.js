import React from 'react'
import Cable from 'actioncable';

// == LOCAL URL ==
// const WS_URL = "ws://localhost:3000/cable"

// == HEROKU URL ==
const WS_URL = "wss://react-pictionary-backend.herokuapp.com/cable"

class GameManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameState: ''
        }
    }

    componentWillMount() {
        this.createSocket()
        // console.log('manager mounted')
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.gameJoined === true) {
        this.handleGameJoin()
      }
    }
    
    handleGameJoin = () => {
      if (this.props.gameJoined === true) {
        this.manager.addUserToGame(this.props.username, this.props.gameId)
      }
    }

    // sendGameState() {
    //   this.props.setGameState(this.state.gameState)
    // }

    createSocket() {
        let cable = Cable.createConsumer(WS_URL);
        this.manager = cable.subscriptions.create({
          channel: 'ManagerChannel'
        }, {
          connected: () => {},
          received: (data) => {
            console.log('management data received',data)
            if (data.command === 'updatedGameState') {
              // console.log('Game Manager:',data.command)
              // this.setState({ gameState });
              this.props.setGameState(data.payload)
            }
            else if (data.command === 'updatedUsers') {
              this.props.updateUsersList(data.payload)
            }
          },
          create: function(command) {

            this.perform('create', {
              command: command
            });
          },
          addUserToGame: function(username, gameId) {
            this.perform('addUserToGame', {
              username: username,
              gameId: gameId
            })
          },
          removeUserFromGame: function(username, gameId) {
            this.perform('removeUserFromGame', {
              username: username,
              gameId: gameId
            })
          }
        });
      }


    render() {
        return ( null );
    }
}

export default GameManager;
