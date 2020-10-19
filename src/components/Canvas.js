import React, { Component } from 'react';
import Cable from 'actioncable';
import Word from "./Word";
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
      curColor: '#000000',
      paths: [],
      visible: false
    }
  }

  /////////////////////////// DRAWING FUNCTIONS //////////////////////////////////

  handleMouseDown = (ev) => {
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
      p[p.length - 1].coordinates.push(x, y)
      this.drawPartialLine(p)
    }
  }

  drawPartialLine = (p) => {
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
      ctx.lineTo(c[i], c[i + 1]);
    }
    ctx.stroke();
    ctx.restore();
  }

  drawFullLine = (data) => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = data.strokeWidth;
      ctx.strokeStyle = data.color;
      ctx.beginPath();
      const c = data.coordinates;
      ctx.moveTo(c[0], c[1]);
      for (let i = 2; i < c.length; i += 2) {
        ctx.lineTo(c[i], c[i + 1]);
      }
      // ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };

  handleMouseUp = (ev) => {
    let p = this.state.paths
    this.setState({
      isDrawing: false
    })
    this.paths.create(p[p.length - 1].color, p[p.length - 1].strokeWidth, p[p.length - 1].coordinates)
  }

  handleMouseLeave = (ev) => {
    if (this.state.isDrawing === true) {
      let p = this.state.paths
      this.setState({
        isDrawing: false
      })
      this.paths.create(
        p[p.length - 1].color,
        p[p.length - 1].strokeWidth,
        p[p.length - 1].coordinates
      );
    }
  }

  changeWidth = (ev) => {
    this.setState({
      curWidth: ev.target.value
    })
  }

  changeColor = (ev) => {
    this.setState({
      curColor: ev.target.value
    })
  }

  // ========================================================================

  iterateOverPaths = () => {
    this.state.paths.forEach(path => {
      this.drawFullLine(path)
    })
  }

  handleClear = () => {
    this.clearArea()
    this.setState({ paths: [] })
    this.paths.clear()
  }

  makePath = () => {
    return {
      color: this.state.curColor,
      strokeWidth: this.state.curWidth,
      coordinates: []
    }
  }

  undo = () => {
    this.paths.undo()
    let paths = this.state.paths
    paths.pop()
    this.setState({ paths }, () => {
      this.clearArea()
      this.iterateOverPaths()
    })
  }

  clearArea = () => {
    // console.log("cleared")
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // this.props.clearClientCanvas()
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
      visible: false,
      paths: []
    })
  }

  createSocket() {
    let cable = Cable.createConsumer(WS_URL)
    this.paths = cable.subscriptions.create({
      channel: 'CanvasChannel'
    }, {
        connected: () => { },
        create: function (color, strokeWidth, coordinates) {
          this.perform('create', {
            color: color,
            strokeWidth: strokeWidth,
            coordinates: coordinates,
          });
        },
        clear: function () {
          this.perform('clear');
        },
        undo: function () {
          this.perform('undo');
        }
      });
  }

  render() {
    const visible = this.state.visible
    return (
      <Transition visible={visible} duration={1000}>
        <div className="ui small scale visible transition">
          <Word word={this.props.word} />
          <canvas
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
            id="canvas"
            width="600"
            height="500"
          ></canvas>
          <br />
          <div className="controls">
            <button className="ui button" onClick={this.handleClear}>
              Clear Area
            </button>

            <button className="ui button" onClick={this.undo}>
              Undo
            </button>

            <div className="controls">
              <div className="label">Line Width:</div>
              <div>
                <input
                  id="slider"
                  type="range"
                  name="width"
                  min="1"
                  max="50"
                  value={this.state.curWidth}
                  onChange={this.changeWidth}
                ></input>
              </div>
            </div>

            <div className="controls">
              <div className="label">Color:</div>
              <div>
                <input
                  id="selColor"
                  type="color"
                  name="selColor"
                  value={this.state.curColor}
                  onChange={this.changeColor}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    );
  }

}

export default Canvas;
