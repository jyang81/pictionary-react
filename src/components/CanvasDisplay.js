import React, {Component} from 'react';
import Cable from 'actioncable';

class CanvasDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paths: []
    }
  }

// ===========  THIS CANVAS WILL ONLY RENDER WHAT THE DRAWER DRAWS =======================


    drawLine = (paths) => {
      const canvas = document.getElementById('canvas-display');
      const ctx = canvas.getContext('2d');
      this.ctx.save();
      this.ctx.lineJoin = "round";
      this.ctx.lineCap = "round";

      this.ctx.globalCompositeOperation = 'source-over';
      this.state.paths.forEach(path => {
        this.ctx.lineWidth = path.strokeWidth;
        this.ctx.strokeStyle = path.color;
        this.ctx.beginPath();
        const c = path.coords;
        this.ctx.moveTo(c[0], c[1]);
        for (let i = 2; i < c.length; i += 2) {
          this.ctx.lineTo(c[i], c[i+1]);
        }
        this.ctx.closePath();
        this.ctx.stroke();
      })
      this.ctx.restore();
    };



// ========================================================================

    handleReceivedPaths = (paths) => {
      console.log("handleReceivedPaths:", paths)
      this.setState({
        paths: paths._json
      })
    }




  render() {
    return (
      <div>

        <canvas
          id="canvas-display"
          width="800"
          height="600">
        </canvas>

      </div>
    )
  }

}

export default CanvasDisplay;


// <ActionCable
//   channel={{channel: "CanvasChannel"}}
//   onReceived={this.handleReceivedPaths}
// />
