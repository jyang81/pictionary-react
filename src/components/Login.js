import React from 'react'
import { Transition } from 'semantic-ui-react'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            visible: false
         }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.username = React.createRef()
    }

    handleSubmit(ev) {
        ev.preventDefault()
        this.setState({
            visible: false
        })
        let username = this.username.current.value
        this.props.loginNewUser(username)
    }

    componentDidMount() {
        this.setState({
            visible: true
        }) 
    }


    render() {
        const { visible } = this.state
        return (
            <Transition visible={visible} duration={400}>
            <div className="ui small visible transition">
                <form className="ui form" onSubmit={this.handleSubmit} >
                    <div className="field">
                        <label><h3>Enter Your Username</h3></label>
                        <input type="text" name="username" placeholder="Username" required ref={this.username}/>
                    </div>
                    <button className="ui button" type="submit">Submit</button>
                </form>
            </div>
            </Transition>
         );
    }
}

export default Login;
