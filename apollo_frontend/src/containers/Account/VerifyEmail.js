import React from "react";
import axios from "axios";
import {
  Button ,
  FormGroup ,
  FormControl ,
  Badge ,
  Alert ,

} from "react-bootstrap";
import { NavLink, Redirect }  from    "react-router-dom";

import { Event, PageView}     from    '../GlobalMisc/Tracking';

import LoaderSpinner          from    '../GlobalMisc/LoaderSpinner'


import "../../content/css/App.css";
import {
  verify_email_url ,

} from "../../backend-urls.js" ;


class VerifyEmail extends React.Component {

  state = {
    loading : false , //determines if the page is laoding
    error : null , //holds the error that gets returned from the database
    password : "" , //holds the password value
    email_confirmed : null , //holds the return value if the key was confirmed (if the user opens the link)
  }

  componentDidMount(){
    PageView();
    this.handlePostAccountKey();
  }


  handlePostAccountKey = () => {

    this.setState({
      loading: true ,
      error: null ,

    })

    Event("Register Account" , "Register Account Atempt")

    var key = this.props.match.params.key ;

    var data = new FormData();
    data.append('key' , key) ;

    axios
      .post(verify_email_url , data)
      .then(response => {
        console.log(response.data)
        Event("Register Account" , "Register Account SUCCESS" )
        this.setState({
          email_confirmed : true ,
          loading:false ,
        })

      })
      .catch(error => {
        console.log(error.data)
        console.log(error)
        Event("Register Account" , "Register Account FAIL" )
        this.setState({
          error: error.response.data  ,
          loading: false ,
        })

      })
  }


  render(){
    const {
        error ,
        loading ,
        password ,
        email_confirmed ,


    } = this.state

    return(

      <React.Fragment>

        <div className="account-form bg-app">

          <h3>Account Verification</h3>
          <hr />

          {
            loading ?
              <LoaderSpinner />
            :
              email_confirmed &&
                <Alert variant="success">Your account has been confirmed! <NavLink to="/login" onClick={() => Event("Routing", "Opening Login Page", "From Verify Email Page") }>Login </NavLink></Alert>
          }

          {
            error &&
              <Alert variant="danger">There was an error with confirming your account. The link you tried may be expired or incorrect. You can try to <NavLink to="/signup" onClick={() => Event("Routing", "Opening Signup Page", "From Verify Email Page") }>signup </NavLink> again.</Alert>
          }
        </div>

      </React.Fragment>




    )

  }

}


export default VerifyEmail ;
