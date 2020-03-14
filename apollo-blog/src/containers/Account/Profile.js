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
    selected_button : "info" , //changes whenever a user selected a button. is on the top button by default

  }

  componentDidMount(){
    console.log('token: ' + this.props.token)
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
    var article_data = new FormData();
    article_data.append('username' , "connordavidson") ;
    article_data.append('first_name' , "Connor") ;
    article_data.append('last_name' , "Davidson") ;

    axios
      .get( 'http://127.0.0.1:8000/rest-auth/user/' , article_data ,
        {
          headers: { Authorization: 'Token ' + this.props.token } //DRF requires the token in the header to retrieve user's info
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
        console.log("error: " + error)
        this.setState({
          loading: false ,

        })
      })
  }


  handleChangePassword = () => {
    this.setState({
      loading: true
    });

    console.log("handle change password with hardcoded data")

    var password_data = new FormData();
    password_data.append('new_password1' , "password_11") ;
    password_data.append('new_password2' , "password_11") ;
    password_data.append('old_password' , "password_1") ;

    axios
      .post("http://127.0.0.1:8000/rest-auth/password/change/" , password_data ,
        {
          headers: { Authorization: 'Token ' + this.props.token } //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        console.log("response: " + response )
        this.setState({
          loading: false
        })
      })
      .catch(error => {
        console.log("error: " + error )
      })


  }



  handleProfileInfo = () => {
    switch(this.state.selected_button){
      case "info" :
        return(
          <React.Fragment>
            {/*<Container>
              <h5>Change Your Password</h5>
              <hr />
              <Form.Group >
                <Form.Label>Old Password</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group >
                <Form.Label>Confirm Old Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group >
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Button onClick={this.handleChangePassword}>Change Your Password </Button>
            </Container>
            */}
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

    console.log('username: ' + username)
    console.log('token: ' + token)


    console.log(selected_button)
    return(
      <React.Fragment>
        {
          authenticated  ?
            <Container>
              <h4>Account info for {username}</h4>
              <Row>
                <Col sm={{ span: 3 }}>
                  <Card>
                    <ListGroup variant="flush">
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
  withRouter(
    connect(
      mapStateToProps ,

    )(Profile)
  );
