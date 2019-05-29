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

// =================== DRAWING FUNCTIONS =============================

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
        // console.log(this.state.paths[this.state.paths.length - 1].coords.push(x,y));
        this.state.paths[this.state.paths.length - 1].coords.push(x,y)
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
      ctx.globalCompositeOperation = 'source-over';
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
      this.sendPaths()
    }

    handleMouseLeave = (ev) => {
      // console.log("mouse leave")
      this.setState({
        isDrawing: false
      })
      this.sendPaths()
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
        coords: []
      }
    }

    sendPaths = () => {
      console.log("paths:", JSON.stringify(this.state.paths))

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

  render() {
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
