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
      },
      create: function(chatContent) {
        this.perform('create', {
          content: chatContent
        });
      }
    });
  }

  handleSendEvent(ev) {
    ev.preventDefault();
    this.chats.create(this.state.currentChatMessage);
    this.setState({
      currentChatMessage: ''
    });
  }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{ el.content }</span>
          <span className='chat-created-at'>{ el.created_at }</span>
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
        <input
          value={this.state.currentChatMessage}
          onChange={(ev) => this.updateCurrentChatMessage(ev)}
          type='text'
          placeholder='Enter your message...'
          className='chat-input'/>
        <button 
        onClick={(ev) =>  this.handleSendEvent(ev)}
        className='send'>
          Send
        </button>
      </div>
    )
  }


}

export default Chatbox;
