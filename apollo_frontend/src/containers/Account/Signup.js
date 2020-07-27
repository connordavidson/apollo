
import React from "react";
import {
  Button ,
  FormGroup ,
  FormControl ,
  Badge ,
  Alert ,

} from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { Event, PageView} from '../GlobalMisc/Tracking';
import "../../content/css/App.css";
import { authSignup } from "../../store/actions/auth";
import ButtonLoaderSpinner from '../GlobalMisc/ButtonLoaderSpinner'

class  Signup extends React.Component  {
  state = {
    loading: null , //for whne the page is loading
    error: null , //holds any error with submitting the form
    email : "" , //holds the email value
    username : "" , //holds the email value
    password : "" , //holds the password value
    confirm_password : "" , //holds the confirm_password value
    passwords_match : true ,

  }
  componentDidMount(){
    PageView();
  }

  //sets the email in the state
  handleEmail = (e) => {
    this.setState({
      email : e.target.value
    })
  }

  //sets the username in the state
  handleUsername = (e) => {
    this.setState({
      username : e.target.value
    })
  }

  //sets the password into the state and determines if the two password fields match
  handlePassword = (e) => {
    if(this.state.confirm_password !== e.target.value){
      this.setState({
        passwords_match : false ,
        password : e.target.value
      })
    }else{
      this.setState({
        passwords_match : true ,
        password : e.target.value
      })
    }
  }

  //sets the confirm_password into the state and determines if the two password fields match
  handleConfirmPassword = (e) => {
    if(this.state.password !== e.target.value){
      this.setState({
        passwords_match : false ,
        confirm_password : e.target.value
      })
    }else{
      this.setState({
        passwords_match : true ,
        confirm_password : e.target.value
      })
    }
  }

  //does a simple validation of the user's input and returns true or false
  handleValidated = () => {
    var email_valid = this.state.email.length > 0
    var username_valid = this.state.username.length > 0
    var password_valid = this.state.password.length > 8
    var confirm_password_valid = this.state.confirm_password.length > 8
    var passwords_match = this.state.password_valid === this.state.confirm_password_valid
    return email_valid && username_valid && password_valid && confirm_password_valid && passwords_match && this.state.passwords_match  ;
  }


  handleSubmit = (event) => {
    event.preventDefault();
    const {email, username, password , confirm_password} = this.state;
    // console.log(email) ;
    this.props.signup(username, email, password , confirm_password)
  }

  render(){

    const {
      email ,
      username ,
      password ,
      confirm_password ,
      passwords_match ,

    } = this.state ;

    const {
      error ,
      token ,
      loading ,
      success_message ,

    } = this.props ;




    if(error){
      var errors = error.response.data
    }

    if(token){
      return <Redirect to='/' />
    }

    // console.log("error: " , error)
    return (
      <div className="account-form bg-app">

        <form onSubmit={this.handleSubmit}>
          <h3
            className="ubuntu-bold-font"
          >
            Signup
          </h3>
          <hr />
          <FormGroup controlId="email" bsSize="large">
            <FormControl
              placeholder="Email"
              required
              autoFocus
              type="email"
              value={email}
              onChange={this.handleEmail}
              className="mb-2 s1-txt3 placeholder0 wrap-input100 "
            />
          </FormGroup>
          <FormGroup controlId="username" bsSize="large">
            <FormControl
              placeholder="Username"
              required
              value={username}
              onChange={this.handleUsername}
              className="mb-2 s1-txt3 placeholder0 wrap-input100 "
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormControl
              placeholder="Password"
              required
              value={password}
              onChange={this.handlePassword}
              type="password"
              className="mb-2 s1-txt3 placeholder0 wrap-input100 "
            />
          </FormGroup>
          <FormGroup controlId="confirm_password" bsSize="large">
            <FormControl
              placeholder="Confirm Password"
              required
              value={confirm_password}
              onChange={this.handleConfirmPassword}
              type="password"
              className="mb-2 s1-txt3 placeholder0 wrap-input100 "
            />
          </FormGroup>

          {
            loading ?
              <Button
                block
                bsSize="large"
                disabled={true}
                type="submit"
                className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
               >
                <ButtonLoaderSpinner />
              </Button>
            :
              <Button
                block
                bsSize="large"
                disabled={!this.handleValidated()}
                onClick={() => Event("Signup" , "Signup Attempt" , "Hit Signup Button")}
                type="submit"
                className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
               >
                Signup
              </Button>

          }

          <Badge>
            Already have an account?
            <NavLink
              to="/login"
              onClick={() => Event("Routing", "Opening Login Page", "From Signup Page") }
            >
              Login
            </NavLink>
          </Badge>

          {
            !passwords_match &&
              <Alert variant="danger">Your passwords must match</Alert>
          }
          {
            success_message &&
              <Alert variant="success">
                {
                  //loops through all the returned errors and prints them with a bullet
                  Object.keys(success_message).map(e => {
                    return <li>{success_message[e] }</li>
                  })
                }
              </Alert>
          }
          {
            error &&
              <Alert variant="danger">
                {
                  //loops through all the returned errors and prints them with a bullet
                  Object.keys(errors).map(e => {
                    return <li>{errors[e][0]}</li>
                  })
                }
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
    success_message : state.auth.success_message ,

  };
};


const mapDispatchToProps = dispatch => {
  return {
    signup: (email, username, password1 , password2) => dispatch(authSignup(email, username, password1 , password2)),

  };
};

export default
  connect(
    mapStateToProps ,
    mapDispatchToProps
  )(Signup) ;
