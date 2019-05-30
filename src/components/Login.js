import React from 'react'

class Login extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {  }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.username = React.createRef()
    }

    handleSubmit(ev) {
        ev.preventDefault()
        let username = this.username.current.value
        this.props.loginNewUser(username)
    }


    render() {
        return (
            <div>
                <form className="ui form" onSubmit={this.handleSubmit} >
                    <div className="field">
                        <label><h3>Enter Your Username</h3></label>
                        <input type="text" name="username" placeholder="Username" required ref={this.username}/>
                    </div>


                    <button className="ui button" type="submit">Submit</button>
                </form>
            </div>
         );
    }
}

export default Login;
