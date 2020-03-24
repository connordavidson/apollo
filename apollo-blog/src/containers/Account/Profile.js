import React from 'react';
import axios from "axios";

import {
  Container ,
  Card ,
  ListGroup ,
  Button,
  Col ,
  Badge ,
  Alert ,
  Row ,
  Grid ,
  Form ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import {withRouter} from 'react-router';
import ChangePassword from './ChangePassword'





class Profile extends React.Component {
  state = {
    error : null , //holds the error
    loading : true , //to determine if the page is loading
    account_info : [] , //holds the account info
    selected_button : "change_password" , //changes whenever a user selected a button. is on the top button by default

  }

  componentDidMount(){
    console.log('token CDM : ' + this.props.token)
    console.log('username CDM: ' + this.props.username)
    this.setState({
      loading: true ,
      // token : this.props.token ,
    })

    // this.handleGetAccount() ;
  }

  handleGetAccount = () => {
    this.setState({
      loading: true ,

    })
    console.log('username: ' + this.props.username)
    // creates a new FormData object and adds all the form data to it
    var account_data = new FormData();
    account_data.append('username' , "connordavidson") ;
    account_data.append('first_name' , "Connor") ;
    account_data.append('last_name' , "Davidson") ;

    for (var value of account_data.values()) {
       console.log("value: " + value);
    }

    var auth_token = 'Token ' + this.props.token ;

    console.log('auth token account info: ' + auth_token)
    axios
      .post( 'http://127.0.0.1:8000/rest-auth/user/' , account_data ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        console.log("response: " + response )
        this.setState({
          loading: false ,
          //account_info : response
        })
      })
      .catch(error => {
        console.log("error: " + error.data)
        this.setState({
          loading : false ,
          erorr : error.data
        })
      })
  }


  handleProfileInfo = () => {
    switch(this.state.selected_button){
      case "change_password" :
        return(
          <React.Fragment>
            <ChangePassword />
          </React.Fragment>
          )
        break ;
      case "email_preferences" :
        return(
          <Container>
            <h5>Change Your Email Preferences</h5>
            <hr />
            <Form.Check
              type='checkbox'
              label={`New product alerts`}
            />
            <br />
            <Form.Check
              type='checkbox'
              label={`Updates on the progress of our website`}
            />
            <br />
            <Form.Check
              type='checkbox'
              label={`Hot Deals`}
            />
          </Container>

        )
        break;
      default :
        return(
          <h5>
          default case
          </h5>
        )
    }
  }

  render(){
    const {
      error ,
      loading ,
      account_info ,
      selected_button ,

    } = this.state

    const {
      username ,
      authenticated ,
      token ,

    } = this.props

    // console.log('username: ' + username)
    // console.log('token: ' + token)


    console.log(selected_button)
    return(
      <React.Fragment>
        {
          authenticated  ?
            <Container>
              <h4>Account Information for {username}</h4>
              <hr />
              <Row>
                <Col sm={{ span: 3 }}>
                  <Card>
                    <ListGroup variant="flush">
                      {/*
                      <ListGroup.Item
                        active={selected_button === "info"}
                        onClick={() => {
                            this.setState({
                              selected_button : "info"
                            })
                          }
                        }
                        style={{cursor:"pointer"}}
                      >
                        Account Info
                      </ListGroup.Item>
                      */}
                      <ListGroup.Item
                        active={selected_button !== "change_password"}

                        style={{cursor:"pointer"}}
                      >
                        Change Password
                      </ListGroup.Item>
                      {/*
                      <ListGroup.Item
                        active={selected_button === "email_preferences"}
                        onClick={() => {
                            this.setState({
                              selected_button : "email_preferences"
                            })
                          }
                        }
                        style={{cursor:"pointer"}}
                      >
                        Email Preferences
                      </ListGroup.Item>
                      */}
                    </ListGroup>
                  </Card>
                </Col>
                <Col sm={{ span: 6}} >
                  {this.handleProfileInfo()}
                </Col>
              </Row>
            </Container>
          :
            <h5>how'd you get here??</h5>
        }
      </React.Fragment>
    )
  }

}



const mapStateToProps = (state) => {
  return {
    username : state.auth.username ,
    token : state.auth.token ,
    authenticated: state.auth.token !== null ,
  }
}

export default
  // withRouter(
    connect(
      mapStateToProps ,

    )(Profile) ;
  // );
