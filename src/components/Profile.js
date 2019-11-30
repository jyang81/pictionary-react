import React from 'react'
import { Transition } from 'semantic-ui-react'

class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: false
        }
    }

    componentDidMount() {
        this.setState({ visible: true })
    }

    handleLogout() {
        this.setState({ visible: false })
        this.props.logout()
    }

    render() {
        const visible = this.state.visible
        return (
            <Transition visible={visible} duration={600}>
                <div className="width-250 ui small scale visible transition">
                    <div className="ui card">
                        <div className="content">
                        <div className="meta">
                            <span className="date">Username:</span>
                        </div>
                        <br></br>
                        <h3 className="header">{this.props.username}</h3>
                        </div>
                        <div className="extra content">
                            <i className="trophy icon"></i>
                            Games Won: {this.props.gamesWon === null ? 0 : this.props.gamesWon}
                            <br></br><br></br>
                            <button onClick={() => this.handleLogout()} className="ui button">Logout</button>
                        </div>
                    </div>
                </div>
            </Transition>
            );
        }
}

export default Profile;
