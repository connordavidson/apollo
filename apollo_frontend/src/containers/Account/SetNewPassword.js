import React from "react";
import axios from "axios";
import {
  Button ,
  FormGroup ,
  FormControl ,
  Badge ,
  Alert ,

} from "react-bootstrap";


import { Event, PageView}   from    'containers/GlobalMisc/Tracking';
import LoaderSpinner        from    'containers/GlobalMisc/LoaderSpinner'

import "content/css/App.css";

import {
  set_new_password_url ,

} from "backend-urls.js" ;


class SetNewPassword extends React.Component {

  state = {
    loading : false , //determines if the page is laoding
    error : null , //holds the error that gets returned from the database
    password : "" , //holds the password value
    confirm_password : "" , //holds the confirm_password value
    passwords_match : true , //if the passwords match
    success_message : "" , //holds the success message from the server
  }

  componentDidMount(){
    PageView();
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
    var password_valid = this.state.password.length > 8
    var confirm_password_valid = this.state.confirm_password.length > 8
    var passwords_match = this.state.password_valid === this.state.confirm_password_valid
    return password_valid && confirm_password_valid && passwords_match && this.state.passwords_match  ;
  }


  handleSubmitWithGA = () => {
    Event("Set New Password", "Set New Password Reset Attempt", "From Set New Password Page") ;
    this.handleSubmit()
  }


  handleSubmit = (event) => {
    this.setState({
      loading: true
    })
    event.preventDefault();
    var uid = this.props.match.params.uid ;
    var token = this.props.match.params.token;

    console.log(uid + " : " +token)
    // creates a new FormData object and adds all the form data to it
    var password_data = new FormData();
    password_data.append('new_password1' , this.state.password) ;
    password_data.append('new_password2' , this.state.confirm_password) ;
    password_data.append('uid' , uid) ;
    password_data.append('token' , token) ;

    axios
      .post(set_new_password_url , password_data)
      .then(response => {
        console.log(response)
        Event("Set New Password", "Set New Password Reset SUCCESS", "From Set New Password Page") ;
        this.setState({
          loading: true ,
          success_message : response.data.detail
        })
      })
      .catch(error => {
        console.log(error)
        Event("Set New Password", "Set New Password Reset FAIL", "From Set New Password Page") ;
        this.setState({
          loading: false ,
          error: error.response.data ,

        })
      })

    // const {email, username, password , confirm_password} = this.state;
    // console.log(email) ;
    // this.props.signup(username, email, password , confirm_password)
  }



  render(){
    const {
        error ,
        loading ,
        password ,
        confirm_password ,
        passwords_match ,
        success_message ,

    } = this.state

    return(

      <div className="account-form bg-app">
        <form>
          <h5>Enter New Password </h5>
            <hr />
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
              Confirm Password
              <FormControl
                placeholder="Confirm Password"
                required
                value={confirm_password}
                onChange={this.handleConfirmPassword}
                type="password"
                className="mb-2 s1-txt3 placeholder0 wrap-input100 "
              />
            </FormGroup>

            <Button block bsSize="large" disabled={!this.handleValidated()} onClick={this.handleSubmit}>
              Set New Password
            </Button>

            <br/>

            {
              !passwords_match &&
              <Alert variant="danger">Your passwords must match</Alert>
            }
            {
              success_message &&
              <Alert variant="success">{success_message}</Alert>
            }
            {
              error &&
              <Alert variant="danger">
                {
                  //loops through all the returned errors and prints them with a bullet
                  Object.keys(error).map(e => {
                    return <li>{error[e][0]}</li>
                  })
                }
              </Alert>
            }

          </form>
      </div>
    )
  }


}


export default SetNewPassword ;
