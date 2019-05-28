import React, {Component} from 'react';

// var isDrawing = false;
// var lastX, lastY;
// var ctx;

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      isDrawing: false
    }

  }

  handleMouseDown = (ev) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    this.setState({
      isDrawing: true
    })
    ctx.moveTo(ev.clientX, ev.clientY);
  }

  handleMouseMove = (ev) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    if (this.state.isDrawing) {
      ctx.lineTo(ev.clientX, ev.clientY);
      ctx.stroke();
    }
  }

  handleMouseUp = (ev) => {
    this.setState({
      isDrawing: false
    })
  }

/////////////////////////// DRAWING FUNCTIONS /////////////////////////////////////



  // function InitThis() {
  //     ctx = document.getElementById('canvas').getContext("2d");
  //
  //     $('#canvas').mousedown(function (e) {
  //         isDrawing = true;
  //         Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
  //     });
  //
  //     $('#canvas').mousemove(function (e) {
  //         if (isDrawing) {
  //             Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
  //         }
  //     });
  //
  //     $('#canvas').mouseup(function (e) {
  //         isDrawing = false;
  //     });
  // 	    $('#canvas').mouseleave(function (e) {
  //         isDrawing = false;
  //     });
  // }
  //
  // function Draw(x, y, isDown) {
  //     if (isDown) {
  //         ctx.beginPath();
  //         ctx.strokeStyle = $('#selColor').val();
  //         ctx.lineWidth = $('#selWidth').val();
  //         ctx.lineJoin = "round";
  //         ctx.moveTo(lastX, lastY);
  //         ctx.lineTo(x, y);
  //         ctx.closePath();
  //         ctx.stroke();
  //     }
  //     lastX = x; lastY = y;
  // }
  //
  // function clearArea() {
  //     // Use the identity matrix while clearing the canvas
  //     ctx.setTransform(1, 0, 0, 1, 0, 0);
  //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // }

//////////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div>
        <canvas
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          id="canvas"
          width="800"
          height="600">
        </canvas>
        <br/>
        <button onclick="javascript:clearArea();return false;">Clear Area</button>
          Line width : <select id="selWidth">
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="9" selected="selected">9</option>
              <option value="11">11</option>
          </select>
          Color : <select id="selColor">
              <option value="black">black</option>
              <option value="blue" selected="selected">blue</option>
              <option value="red">red</option>
              <option value="green">green</option>
              <option value="yellow">yellow</option>
              <option value="gray">gray</option>
          </select>
      </div>
    )
  }

}

export default Canvas;
