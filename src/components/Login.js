import React from 'react'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <form class="ui form">
                    <div class="field">
                        <label>Username </label>
                        <input type="text" name="first-name" placeholder="First Name"/>
                    </div>
                    <div class="field">
                        <div class="ui checkbox">
                        <input type="checkbox" tabindex="0" class="hidden"/>
                        <label>I agree to the pay the creaters of this game one hundred billion gazilion dollhairs</label>
                        </div>
                    </div>
                    <button class="ui button" type="submit">Submit</button>
                </form>
            </div>
         );
    }
}
 
export default Login;