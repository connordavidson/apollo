import React from "react";
import axios from "axios";
import {
  Button ,
  FormGroup ,
  FormControl ,
  Badge ,
  Alert ,

} from "react-bootstrap";
import LoaderSpinner from '../Misc/LoaderSpinner'
import ButtonLoaderSpinner from '../Misc/ButtonLoaderSpinner'

import { Event, PageView} from '../Misc/Tracking';


import "../../content/css/App.css";
import {
  reset_password_url ,

} from "../../backend-urls.js" ;


class ForgotPassword extends React.Component {

  state = {
    loading : false , //stores the loading page
    error : null , //stores any error that would get returned from the backend
    email : "" , //stores the email from the input
    email_submitted : null , //stores response after user submits their email
    message : null , //stores the response message

  }

  componentDidMount(){
    PageView();
  }

  handleEmail = (e) => {
    console.log(e.target.value) ;
    this.setState({email : e.target.value}) ;
  }

  handleValidated = () => {
    return !(this.state.email.length > 1  )
  }

  handleSubmitWithGA = () => {
    Event("Forgot Password", "Forgot Password Reset Attempt", "From Forgot Password Page") ;
    this.handleSubmit()
  }

  handleSubmit = () => {
    this.setState({
      loading: true ,

    })

    var data = new FormData() ;
    data.append('email' , this.state.email) ;
    axios
      .post(reset_password_url , data)
      .then(response => {
        console.log(response)
        Event("Forgot Password", "Forgot Password Reset SUCCESS", "From Forgot Password Page") ;
        this.setState({
          email_submitted : true ,
          loading : false ,
          message : response.data.message
        })
      })
      .catch(error => {
        console.log(error)
        Event("Forgot Password", "Forgot Password Reset FAIL", "From Forgot Password Page") ;
        this.setState({
          error : error.response.data ,
          loading : false ,

        })
      })
  }


  render(){
    const {
      loading ,
      error ,
      email ,
      email_submitted ,
      message ,

    } = this.state ;

    return(

      <div className="account-form bg-app">

          <h3>Reset Password </h3>
          <hr />
          <FormGroup controlId="email" bsSize="large">
            Email
            <FormControl
              required
              autoFocus
              value={email}
              onChange= {this.handleEmail}
            />
          </FormGroup>

          {
            loading ?
                <Button
                  block
                  bsSize="large"
                  disabled={true}
                >
                  <ButtonLoaderSpinner />
                </Button>
            :
              <Button
                block
                bsSize="large"
                disabled={
                  (this.handleValidated())
                }
                onClick={this.handleSubmitWithGA}
              >
                Submit
              </Button>
          }

          <br />
          {
            email_submitted &&
              <Alert variant="success">
                {message}
              </Alert>
          }
          {
            error &&
              <Alert variant="danger">
                There was an error with your submitted email :
                {error}
              </Alert>
          }

      </div>

    )
  }



}

export default ForgotPassword;
