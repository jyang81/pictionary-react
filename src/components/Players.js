import React from 'react'
import { Transition } from 'semantic-ui-react'

class Players extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: false
        }
    }

    componentDidMount() {
        this.setState({
          visible: true
        })
    }

    handleLogout() {
        this.setState({
            visible: false
        })
        this.props.logout()
    }

    render() {
        const visible = this.state.visible
        return (
            <Transition visible={visible} duration={600}>
            <div className="div4 ui small scale visible transition">
            <div className="ui card">
                <div className="content">
                <div className="meta">
                    <span className="date">Current players:</span>
                </div>
                <br></br>

                </div>

            </div>
            </div>
            </Transition>
            );
        }
}

export default Players;
