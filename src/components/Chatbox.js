import React, {Component} from 'react';
import Cable from 'actioncable';

class Chatbox extends Component {
  constructor() {
    super()
    this.state = {
      currentChatMessage: '',
      chatLogs: []
    }
  }

  componentWillMount() {
    this.createSocket()
  }

  updateCurrentChatMessage(ev) {
    this.setState({
      currentChatMessage: ev.target.value
    })
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3000/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        this.setState({ chatLogs: chatLogs });
        this.CheckChatsForWin()
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

  CheckChatsForWin() {
    this.state.chatLogs.map((el) => {
      this.checkForWin(el)
    })
  }

  checkForWin(message) {
    if (message.user_name === 'EvilHost' && message.content.substring(0,17) === 'Attention please,') {
       alert('Hi Steve!')
       setTimeout(() => this.props.handleWin(),5000)
    }
  }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{ el.user_name }{': '}</span>
          <span className='chat-created-at'>{ el.content }</span>
        </li>
      );
    });
  }


  render() {
    return (
      <div className='stage'>
        <h1>Chat</h1>
        <ul className='chat-logs'>
        {this.renderChatLog()}
        </ul>
        <form onSubmit={(ev) =>  this.handleSendEvent(ev)}>
        <input
          value={this.state.currentChatMessage}
          onChange={(ev) => this.updateCurrentChatMessage(ev)}
          type='text'
          placeholder='Enter your message...'
          className='chat-input'/>
        <button className='ui button'>
          Send
        </button>
        </form>
      </div>
    )
  }


}

export default Chatbox;
