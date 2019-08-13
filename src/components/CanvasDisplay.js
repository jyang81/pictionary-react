import React, {Component} from 'react';
import Cable from 'actioncable';
import { Transition } from 'semantic-ui-react'

// == LOCAL URL ==
// const WS_URL = "ws://localhost:3000/cable"

// == HEROKU URL ==
const WS_URL = "wss://react-pictionary-backend.herokuapp.com/cable"
const linesURL = 'https://react-pictionary-backend.herokuapp.com/api/v1/lines'


class CanvasDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paths: [],
      visible: false
    }
  }

// ===========  THIS CANVAS WILL ONLY RENDER WHAT THE DRAWER DRAWS =======================

    iterateOverLines = (lines) => {
      lines.forEach(line => {
        this.drawLine(line)
      })
    }

    drawLine = (data) => {

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
          ctx.lineTo(c[i], c[i+1]);
        }
        // ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }  
    };

    clearArea = () => {
      // console.log("cleared")
      const canvas = document.getElementById('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        // ctx.canvas.width = ctx.canvas.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.setState({
          paths: []
        })
      }
    }


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
      // console.log('created socket')
      fetch(linesURL)
      .then(res => res.json())
      .then(json => this.iterateOverLines(json))
    }

    componentDidMount() {
      // console.log('mounted')
      this.setState({
        visible: true
      })
    }

    createSocket() {
      let cable = Cable.createConsumer(WS_URL);
      this.paths = cable.subscriptions.create({
        channel: 'CanvasChannel'
      }, {
        connected: () => {},
        received: (data) => {
          // let paths = this.state.paths;
          // paths.push(data);
          if (this.props.gameJoined) {
            if (data.clear) {
              this.clearArea()
            }
            else {
            this.drawLine(data)
            }
          }
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

    transitionOut() {
      this.setState({
        visible: false
      })
    }

    // static getDerivedStateFromProps(props,state) {

    // }


  render() {
    const { visible } = this.state
    // if (this.props.gameWillEnd) {this.transitionOut()}
    return (
      <Transition visible={visible} duration={1000}>
        <div className="ui small scale visible transition">
          <div className="word"><i className="pencil alternate icon drawIcon"></i> {this.props.drawer} is Drawing</div>
          <canvas
            id="canvas"
            width="600"
            height="500">
          </canvas>
        </div>
      </Transition>
    )
  }

}

export default CanvasDisplay;
