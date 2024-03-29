
import React from "react";
import {
  Button ,
  FormGroup ,
  FormControl ,
  Badge ,
  Alert ,
  Form ,

} from "react-bootstrap";
import { connect }            from "react-redux";
import { NavLink, Redirect }  from "react-router-dom";

import {withRouter}           from 'react-router';
import { Event, PageView}     from 'containers/GlobalMisc/Tracking';

import "content/css/App.css";
import { authLogin }          from "store/actions/auth";




class Login extends React.Component {
  state = {
    username: "" , //stores the username that is getting entered
    password: "" , //stores the password that is getting entered

  }
  componentDidMount(){
    PageView();
  }

  handleUsername = e => {
    this.setState({ username : e.target.value });
  };

  handlePassword = e => {
    this.setState({ password : e.target.value });
  };

  //
  validateForm = () =>  {
    console.log(this.state.email.length)
    console.log(this.state.email.length > 0 && this.state.password.length > 8)
    return this.state.email.length > 0 && this.state.password.length > 8;
  }

  handleSubmit = (event) => {

    event.preventDefault();
    const {username, password} = this.state;
    this.props.login(username, password)
  }

  render(){
    const { error, loading, token } = this.props;
    const { username, password } = this.state;

    //redirects the user to the home page if they are logged in
    if(token){
      return <Redirect to='/' />
    }


    // if(error){
    //   var errors = error.response.data
    // }


    return (

      <div className="account-form bg-app">

        <form onSubmit={this.handleSubmit}>
          <h3
            className="ubuntu-bold-font"
          >
            Login
          </h3>
          <hr />
          <FormGroup controlId="email" bsSize="large">
            <Form.Label htmlFor="inlineFormInput" srOnly>
              Username
            </Form.Label>
            <FormControl
              placeholder="Username"
              required
              autoFocus
              value={username}
              onChange= {this.handleUsername}
              className="mb-2 s1-txt3 placeholder0 wrap-input100 "
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <Form.Label htmlFor="inlineFormInput" srOnly>
              Password
            </Form.Label>
            <FormControl
              placeholder="Password"
              required
              value={password}
              onChange= {this.handlePassword}
              className="mb-2 s1-txt3 placeholder0 wrap-input100 "
              type="password"
            />
          </FormGroup>
          <Button
            block
            onClick={() => Event("Login" , "Login Attempt" , "Hit Login Button")}
            type="submit"
            className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
          >
            Login
          </Button>
          <Badge>
            New to Apollo? <NavLink to="/signup" onClick={() => Event("Routing", "Opening Signup Page", "From Login Page") } >Signup </NavLink>
          </Badge>
          <br/>
          <Badge>
            <NavLink
              to="/reset"
              onClick={() => Event("Routing", "Opening reset-password Page", "From Login Page")}
            >
              Forgot your password?
            </NavLink>
          </Badge>
          <br />
          {
            error &&
              <Alert variant="danger">
                {
                  //loops through all the returned errors and prints them with a bullet
                  Object.keys(error).map(e => {
                    return <li>{error[e][0]}</li>
                  })
                }
                {/*error*/}
              </Alert>

          }
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(authLogin(username, password)),
    // mergeCartOnLogin: () => dispatch(mergeCartOnLogin()),

  };
};

export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Login)
  );
