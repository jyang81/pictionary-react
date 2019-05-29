import React, {Component} from 'react';
import Cable from 'actioncable';

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      isDrawing: false,
      curWidth: 1,
      curColor: "black",
      paths: []
    }
  }

  /////////////////////////// DRAWING FUNCTIONS //////////////////////////////////

    handleMouseDown = (ev) => {
      // console.log("mouse down")

      this.setState({
        isDrawing: true
      })
      this.drawLine(ev)
    }

    handleMouseMove = (ev) => {

      if (this.state.isDrawing) {
        this.drawLine(ev)
      }
    }

    drawLine = (ev) => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.lineWidth = this.state.curWidth;
      ctx.strokeStyle = this.state.curColor;
      // ctx.globalCompositeOperation = 'source-over';
      ctx.moveTo(ev.clientX - ctx.canvas.offsetLeft, ev.clientY - ctx.canvas.offsetTop);
      ctx.lineTo(ev.clientX - ctx.canvas.offsetLeft, ev.clientY - ctx.canvas.offsetTop);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    handleMouseUp = (ev) => {
      // console.log("mouse up")
      this.setState({
        isDrawing: false
      })
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


    clearArea() {
      console.log("cleared")
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      // ctx.canvas.width = ctx.canvas.width;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

  // draw = (x, y, isDown) => {
  //   let lastX, lastY;
  //   const canvas = document.getElementById('canvas');
  //   const ctx = canvas.getContext('2d');
  //
  //     if (isDown) {
  //         ctx.beginPath();
  //         ctx.strokeStyle = this.state.selColor;
  //         ctx.lineWidth = this.state.selWidth;
  //         ctx.lineJoin = "round";
  //         ctx.moveTo(lastX, lastY);
  //         ctx.lineTo(x, y);
  //         ctx.closePath();
  //         ctx.stroke();
  //     }
  //     lastX = x;
  //     lastY = y;
  //     // console.log("x:", x, lastX);
  //     // console.log("y:", y, lastY);
  // }

  render() {
    console.log('rerender')
    return (
      <div>
        <canvas
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseLeave}
          id="canvas"
          width="800"
          height="600">
        </canvas>
        <br/>
        <button onClick={this.clearArea}>Clear Area</button>
          Line width : <select id="selWidth" onChange={this.changeWidth}>
              <option value="1" selected="selected">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="9">9</option>
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


// componentWillMount() {
//   this.createSocket()
//   console.log('created socket')
// }

// createSocket() {
//   let cable = Cable.createConsumer('ws://localhost:3000/cable');
//   this.lines = cable.subscriptions.create({
//     channel: 'CanvasChannel'
//   }, {
//     connected: () => {},
//     received: (data) => {
//       let lines = this.state.JonTestLinesRecieved;
//       lines.push(data);
//       debugger
//       this.setState({ JonTestLinesRecieved : lines });
//     },
//     create: function(color, strokeWidth, coordinates) {

//       this.perform('create', {
//         color: color,
//         strokeWidth: strokeWidth,
//         coordinates: coordinates
//       });
//     }
//   });
// }