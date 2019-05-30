import React, {Component} from 'react';
import Cable from 'actioncable';

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      isDrawing: false,
      curWidth: 3,
      curColor: "black",
      paths: []
    }
  }

  /////////////////////////// DRAWING FUNCTIONS //////////////////////////////////

  handleMouseDown = (ev) => {
    // console.log("mouse down")
    this.setState({
      isDrawing: true,
      paths: [...this.state.paths, this.makePath()]
    })
    this.drawLine(ev)
  }

  handleMouseMove = (ev) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    if (this.state.isDrawing) {
      let x = ev.clientX - ctx.canvas.offsetLeft
      let y = ev.clientY - ctx.canvas.offsetTop
      let p = this.state.paths
      p[p.length - 1].coordinates.push(x,y)
      this.drawLine(ev)
    }
  }

  drawLine = (ev) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.lineWidth = this.state.curWidth;
    ctx.strokeStyle = this.state.curColor;
    ctx.moveTo(ev.clientX - ctx.canvas.offsetLeft, ev.clientY - ctx.canvas.offsetTop);
    ctx.lineTo(ev.clientX - ctx.canvas.offsetLeft, ev.clientY - ctx.canvas.offsetTop);
    ctx.closePath();
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
    console.log(ev.target.value)
    this.setState({
      curWidth: ev.target.value
    })
  }

  changeColor = (ev) => {
    console.log(ev.target.value);
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
      console.log("cleared")
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      // ctx.canvas.width = ctx.canvas.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.setState({
        paths: []
      })
    }

    componentWillMount() {
      this.createSocket()
      console.log('created socket')
    }

    createSocket() {
      let cable = Cable.createConsumer('ws://localhost:3000/cable');
      this.paths = cable.subscriptions.create({
        channel: 'CanvasChannel'
      }, {
        connected: () => {},
        // received: (data) => {
          // let paths = this.state.paths;
          // paths.push(data);
          // debugger
          // this.setState({ paths });
        // },
        create: function(color, strokeWidth, coordinates) {

          this.perform('create', {
            color: color,
            strokeWidth: strokeWidth,
            coordinates: coordinates
          });
        }
      });
    }

  render() {
    return (
      <div>
        <div>The word is {this.props.word}</div>
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
        <button onClick={this.clearArea}>Clear Area</button>
          Line width : <select id="selWidth" onChange={this.changeWidth}>
              <option value="3" selected="selected">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="30">30</option>
          </select>
          Color : <select id="selColor" onChange={this.changeColor}>
              <option value="black" selected="selected">black</option>
              <option value="blue">blue</option>
              <option value="red">red</option>
              <option value="green">green</option>
              <option value="yellow">yellow</option>
              <option value="orange">orange</option>
              <option value="gray">gray</option>
              <option value="white">white</option>
          </select>
      </div>
    )
  }

}

export default Canvas;
