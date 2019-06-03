import React, {Component} from 'react';
import Cable from 'actioncable';
import { Transition } from 'semantic-ui-react'

class Chatbox extends Component {
  constructor() {
    super()
    this.state = {
      currentChatMessage: '',
      chatLogs: [],
      visible: false
    }
  }

  componentWillMount() {
    this.createSocket()
  }

  componentDidMount() {
    this.setState({
      visible: true
    })
  }

  componentWillUnmount() {
    this.setState({
      visible: false
    })
  }

  updateCurrentChatMessage(ev) {
    this.setState({
      currentChatMessage: ev.target.value
    })
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://react-pictionary-backend.herokuapp.com/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        this.setState({ chatLogs: chatLogs });
        // this.CheckChatsForWin()
      },
      create: function(chatContent, id, username) {

        this.perform('create', {
          content: chatContent,
          user_id: id,
          user_name: username
        });
      }
    });
  }

  handleSendEvent(ev) {
    ev.preventDefault();
    this.chats.create(
      this.state.currentChatMessage,
      this.props.userId,
      this.props.username
      );
    this.setState({
      currentChatMessage: ''
    });
  }

  // CheckChatsForWin() {
  //   this.state.chatLogs.map((el) => {this.checkForWin(el)})
  // }

  // checkForWin(message) {
  //   if (message.user_name === 'EvilHost' && message.content.substring(0,17) === 'Attention please,') {
  //      setTimeout(() => this.props.handleWin(),5000)
  //   }
  // }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
        if (el.user_name === "EvilHost") {
          return (
          <div className="ui green message" key={`chat_${el.id}`}>
            <div className="header">
              { el.user_name }: { el.content }
            </div>
          </div>
        )
        } else {
          return (
          <div className="ui blue message" key={`chat_${el.id}`}>
            <div className="header">
              { el.user_name }: { el.content }
            </div>
          </div>
        )
        }
    });
  }


  render() {
    const visible = this.state.visible
    return (
      <Transition visible={visible} duration={500}>
      <div >
        <h3>Messages</h3>
        <div className="height-500">
          {this.renderChatLog()}
        </div>
        <br />
        <form onSubmit={(ev) => this.handleSendEvent(ev)}>
        <div className="ui input">
          <input
            value={this.state.currentChatMessage}
            onChange={(ev) => this.updateCurrentChatMessage(ev)}
            type='text'
            placeholder='Enter your guess'
          />
        </div> &nbsp;
        <button class="ui icon button">
          <i class="arrow alternate circle right icon"></i>
        </button>
        </form>
      </div>
      </Transition>
    )
  }


}

export default Chatbox;

// <div class="ui message">
// <div class="header">
//   Changes in Service
// </div>
// <p></p>
// </div>
