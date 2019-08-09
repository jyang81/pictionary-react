import React, {Component} from 'react';
import Cable from 'actioncable';
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Transition } from 'semantic-ui-react'

// == LOCAL URL ==
// const WS_URL = "ws://localhost:3000/cable"

// == HEROKU URL ==
const WS_URL = "wss://react-pictionary-backend.herokuapp.com/cable"

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      isDrawing: false,
      curWidth: 3,
      curColor: "black",
      paths: [],
      visible: false
    }
  }

  /////////////////////////// DRAWING FUNCTIONS //////////////////////////////////

  handleMouseDown = (ev) => {
    // console.log("mouse down")
    this.setState({
      isDrawing: true,
      paths: [...this.state.paths, this.makePath()]
    })
    // this.drawLine(ev)
  }

  handleMouseMove = (ev) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    if (this.state.isDrawing) {
      let x = ev.clientX - ctx.canvas.offsetLeft
      let y = ev.clientY - ctx.canvas.offsetTop
      let p = this.state.paths
      p[p.length - 1].coordinates.push(x,y)
      this.drawLine(p)
    }
  }

  drawLine = (p) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = this.state.curWidth;
    ctx.strokeStyle = this.state.curColor;
    ctx.beginPath();
    const c = p[p.length - 1].coordinates;
    ctx.moveTo(c[0], c[1]);
    for (let i = 2; i < c.length; i += 2) {
      ctx.lineTo(c[i], c[i+1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  handleMouseUp = (ev) => {
    // console.log("mouse up")
    let p = this.state.paths
    this.setState({
      isDrawing: false
    })
    // console.log(p[p.length - 1].color, p[p.length - 1].strokeWidth, p[p.length - 1].coordinates)
    this.paths.create(p[p.length - 1].color, p[p.length - 1].strokeWidth, p[p.length - 1].coordinates)
  }

  handleMouseLeave = (ev) => {
    // console.log("mouse leave")
    this.setState({
      isDrawing: false
    })
  }

  changeWidth = (ev) => {
    // console.log(ev.target.value)
    this.setState({
      curWidth: ev.target.value
    })
  }

  changeColor = (ev) => {
    // console.log(ev.target.value);
    this.setState({
      curColor: ev.target.value
    })
  }

// ========================================================================

    makePath = () => {
      return {
        color: this.state.curColor,
        strokeWidth: this.state.curWidth,
        coordinates: []
      }
    }

    clearArea = () => {
      // console.log("cleared")
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      // ctx.canvas.width = ctx.canvas.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({
        paths: []
      })
      // this.props.clearClientCanvas()
      this.paths.clear()
    }

    componentWillMount() {
      this.createSocket()
      // console.log('created socket')
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

    createSocket() {
      let cable = Cable.createConsumer(WS_URL)
      this.paths = cable.subscriptions.create({
        channel: 'CanvasChannel'
      }, {
        connected: () => {},
        create: function(color, strokeWidth, coordinates) {
          this.perform('create', {
            color: color,
            strokeWidth: strokeWidth,
            coordinates: coordinates,
          });
        },
        clear: function() {
          this.perform('clear');
        }
      });
    }

  render() {
    const visible = this.state.visible
    return (
      <Transition visible={visible} duration={1000}>
      <div className="ui small scale visible transition">
        <div className="word">Your word is: {this.props.word}</div>
        <canvas
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
          id="canvas"
          width="600"
          height="500">
        </canvas>
        <br/>
        <div>
          <button className="ui button" onClick={this.clearArea}>Clear Area</button>
          &nbsp;
          Line width: <select
                      className="ui selection dropdown width-4em"
                      id="selWidth"
                      onChange={this.changeWidth}>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="15">15</option>
              <option value="50">50</option>
          </select>
          &nbsp;
          Color: <select
                  className="ui selection dropdown width-4em"
                  id="selColor"
                  onChange={this.changeColor}>
              <option value="black">black</option>
              <option value="red">red</option>
              <option value="orange">orange</option>
              <option value="yellow">yellow</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
              <option value="purple">purple</option>
              <option value="brown">brown</option>
              <option value="gray">gray</option>
              <option value="white">white</option>
          </select>
        </div>
      </div>
      </Transition>
    )
  }

}

export default Canvas;
