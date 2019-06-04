import React from 'react'
import Cable from 'actioncable';

class GameManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameState: ''
         }
    }

    componentWillMount() {
        this.createSocket()
        console.log('manager mounted')
    }

    createSocket() {
        let cable = Cable.createConsumer('wss://react-pictionary-backend.herokuapp.com/cable');
        this.manager = cable.subscriptions.create({
          channel: 'ManagerChannel'
        }, {
          connected: () => {},
          received: (data) => {
            // console.log('management data received',data)
            let gameState = data.command
            console.log('Game Manager:',data.command)
            this.setState({ gameState });
            this.sendGameState()
          },
          create: function(command) {

            this.perform('create', {
              command: command
            });
          }
        });
      }

      sendGameState() {
        this.props.setGameState(this.state.gameState)
      }

    render() {
        return ( null );
    }
}

export default GameManager;
