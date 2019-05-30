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


    drawLine = (data) => {

      const canvas = document.getElementById('canvas-display');
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
        ctx.lineTo(c[i], c[i+1]);
      }
      // ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };



// ========================================================================

    // handleReceivedPaths = (paths) => {
    //   console.log("handleReceivedPaths:", paths)
    //   this.setState({
    //     paths: paths._json
    //   })
    // }
    //

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
        received: (data) => {
          // let paths = this.state.paths;
          // paths.push(data);
          this.drawLine(data)
          // this.setState({ paths })
        },
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

        <canvas
          id="canvas-display"
          width="600"
          height="500">
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

// drawLine = (paths) => {
//
//   const canvas = document.getElementById('canvas-display');
//   const ctx = canvas.getContext('2d');
//   ctx.save();
//   ctx.lineJoin = "round";
//   ctx.lineCap = "round";
//
//   this.state.paths.forEach(path => {
//     ctx.lineWidth = path.strokeWidth;
//     ctx.strokeStyle = path.color;
//     ctx.beginPath();
//     const c = path.coords;
//     ctx.moveTo(c[0], c[1]);
//     for (let i = 2; i < c.length; i += 2) {
//       ctx.lineTo(c[i], c[i+1]);
//     }
//     ctx.closePath();
//     ctx.stroke();
//   })
//   ctx.restore();
// };
