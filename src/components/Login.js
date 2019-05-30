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
                        <label>Username </label>
                        <input type="text" name="username" placeholder="First Name" required ref={this.username}/>
                    </div>
                    <div className="field">
                        <div className="ui checkbox">
                        <input type="checkbox" checked={true} tabindex="0" class="hidden"/>
                        <label>I agree to the pay the creaters of this game one hundred billion gazilion dollhairs</label>
                        </div>
                    </div>
                    <button className="ui button" type="submit">Submit</button>
                </form>
            </div>
         );
    }
}

export default Login;
