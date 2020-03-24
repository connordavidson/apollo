import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import {
  Container ,
  Form ,
  Button ,
  Alert ,

} from 'react-bootstrap';
import {
  change_password_url ,

} from "../../backend-urls.js" ;

import LoaderSpinner from '../Misc/LoaderSpinner'


class ChangePassword extends React.Component {


  state = {
    error : null , //holds error
    loading : false , //loading
    old_password : "" , //holds the old password from the user input
    new_password1 : "" , //holds the first password from the user input
    new_password2 : "" , //holds the confirm password from user input
    reset_password : null , //holds the success message from the backen
    passwords_match : true , //determines if the new passwords match

  }


  handleOldPassword = (text) => {
    console.log("old password :" + text.target.value)
    this.setState({
      old_password: text.target.value
    });
  }

  handlePassword = (text) => {
    if(this.state.confirm_password != text.target.value)
    {
      this.setState({
        passwords_match : false ,
        new_password1 : text.target.value
      });
    }else{
      this.setState({
        passwords_match : true ,
        new_password1 : text.target.value
      });
    }
  }

  handleConfirmPassword = (text) => {

    if(this.state.password != text.target.value)
    {
      this.setState({
        passwords_match : false ,
        new_password2 : text.target.value
      });
    }else{
      this.setState({
        passwords_match : true ,
        new_password2 : text.target.value
      });
    }
    // console.log("new password 2 :" + text.target.value)
    // this.setState({
    //   new_password2: text.target.value
    // });
  }


  handleChangePassword = () => {
    this.setState({
      loading: true
    });

    var password_data = new FormData();
    password_data.append('new_password1' , this.state.new_password1) ;
    password_data.append('new_password2' , this.state.new_password2) ;
    password_data.append('old_password' , this.state.old_password) ;

    for (var value of password_data.values()) {
       console.log("value: " + value);
    }
    var auth_token = 'Token ' + this.props.token ;
    axios
      .post( "http://127.0.0.1:8000/rest-auth/password/change/"  , password_data ,
        {
          headers: { Authorization: auth_token } //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        console.log("response: " + response.data )
        this.setState({
          loading : false ,
          error : null ,
          reset_password : response.data.detail ,
          passwords_match : true ,
        })
      })
      .catch(error => {
        console.log("error: " + error.response.data )
        this.setState({
          loading: false ,
          error : error.response.data ,
          passwords_match : true ,
        })
      })
  }

  handleValidated = () => {
    return (this.state.old_password.length > 1 && this.state.new_password2.length > 1 && this.state.new_password1.length > 1 && this.state.new_password2 == this.state.new_password1)
  }



  render(){
    const {
      error ,
      loading ,
      new_password1 ,
      new_password2 ,
      old_password ,
      reset_password ,
      passwords_match ,

    } = this.state ;

    const {
      token ,

    } = this.props



    return(


      <Container>
        <h5>Change Your Password</h5>
        <hr />
        <Form.Group >
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter old password"
            onChange={this.handleOldPassword}
          />
        </Form.Group>
        <Form.Group >
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="New Password"
            onChange={this.handlePassword}
           />
        </Form.Group>
        <Form.Group >
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            onChange={this.handleConfirmPassword}
           />
        </Form.Group>

        {
          loading ?
            <Button
              block
              bsSize="large"
              disabled={
                !(this.handleValidated())
              }
              onClick={this.handleChangePassword}
            >
              <LoaderSpinner />
            </Button>
          :
            <Button
              block
              bsSize="large"
              disabled={
                !(this.handleValidated())
              }
              onClick={this.handleChangePassword}
            >
              Change Your Password
            </Button>

        }

        <br/>
        <br />
        {
          !passwords_match &&
          <Alert variant="danger">Your passwords must match</Alert>
        }

        {
          reset_password &&

            <Alert variant="success">
              {reset_password}
            </Alert>
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

      </Container>




    )
  }
}




const mapStateToProps = (state) => {
  return {
    // username : state.auth.username ,
    token : state.auth.token ,
    // authenticated: state.auth.token !== null ,
  }
}




export default
    connect(
      mapStateToProps ,

    )(ChangePassword) ;
