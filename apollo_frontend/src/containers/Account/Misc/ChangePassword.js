import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import {
  Container ,
  Form ,
  Button ,
  Alert ,
  Card ,

} from 'react-bootstrap';
import {
  change_password_url ,

} from "../../../backend-urls.js" ;

import { Event }              from    '../../GlobalMisc/Tracking';
import ButtonLoaderSpinner    from    '../../GlobalMisc/ButtonLoaderSpinner';


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
  }



  handleChangePasswordWithGA = () => {
    Event("Change Password", "Change Password Attempt", "Change Password Attempt" )
    this.handleChangePassword() ;
  }

  handleChangePassword = () => {
    this.setState({
      loading: true
    });

    var password_data = new FormData();
    password_data.append('new_password1' , this.state.new_password1) ;
    password_data.append('new_password2' , this.state.new_password2) ;
    password_data.append('old_password' , this.state.old_password) ;

    for (const value of password_data.values()) {
       console.log("value: " + value);
    }
    const auth_token = 'Token ' + this.props.token ;
    axios
      .post( "/rest-auth/password/change/"  , password_data ,
        {
          headers: { Authorization: auth_token } //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        console.log("response: " + response.data )
        Event("Change Password", "Change Password SUCCESS", "Change Password SUCCESS" )
        this.setState({
          loading : false ,
          error : null ,
          reset_password : response.data.detail ,
          passwords_match : true ,
        })
      })
      .catch(error => {
        console.log("error: " + error.response.data )
        Event("Change Password", "Change Password FAIL", "Change Password FAIL" )
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
        <Card className="border-radius-25px " >
          <Card.Body>
            <Card.Title>
              <h5
                className="ubuntu-bold-font"
              >
                Change Your Password
              </h5>
            </Card.Title>
            <hr />
            <Form.Group >
              <Form.Control
                type="password"
                placeholder="Old Password"
                onChange={this.handleOldPassword}
                className="mb-2 s1-txt3 placeholder0 wrap-input100 "
              />
            </Form.Group>
            <Form.Group >
              <Form.Control
                type="password"
                placeholder="New Password"
                onChange={this.handlePassword}
                className="mb-2 s1-txt3 placeholder0 wrap-input100 "
               />
            </Form.Group>
            <Form.Group >
              <Form.Control
                type="password"
                placeholder="Confirm New Password"
                onChange={this.handleConfirmPassword}
                className="mb-2 s1-txt3 placeholder0 wrap-input100 "
               />
            </Form.Group>
            <Form.Group >
              {
                loading ?
                  <Button
                    block
                    bsSize="large"
                    disabled={
                      !(this.handleValidated())
                    }
                    className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
                  >
                    <ButtonLoaderSpinner />
                  </Button>
                :
                  <Button
                    block
                    bsSize="large"
                    disabled={
                      !(this.handleValidated())
                    }
                    onClick={this.handleChangePasswordWithGA}
                    className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
                  >
                    Change Your Password
                  </Button>
              }
            </Form.Group>

            {
              !passwords_match &&
                <React.Fragment>
                  <br/>
                  <Alert variant="danger">Your passwords must match</Alert>
                </React.Fragment>
            }
            {
              reset_password &&
                <React.Fragment>
                  <br/>
                  <Alert variant="success">
                    {reset_password}
                  </Alert>
                </React.Fragment>
            }
            {
              error &&
                <React.Fragment>
                  <br/>
                  <Alert variant="danger">
                    {
                      //loops through all the returned errors and prints them with a bullet
                      Object.keys(error).map(e => {
                        return <li>{error[e][0]}</li>
                      })
                    }
                  </Alert>
                </React.Fragment>
            }
          </Card.Body>
        </Card>
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
