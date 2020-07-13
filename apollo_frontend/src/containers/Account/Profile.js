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

import ChangePassword           from    './Misc/ChangePassword' ;
import UserInformation          from    './Misc/UserInformation';
import UserEmailPreferences     from    './Misc/UserEmailPreferences';
import UserArticleInteractions  from    './Misc/UserArticleInteractions';

import AdminCard                from    '../Admin/AdminCard.js' ;

import { PageView , Event }     from    '../GlobalMisc/Tracking';
import LoaderSpinner            from    '../GlobalMisc/LoaderSpinner';


import {
  get_user_details_url ,

} from "../../backend-urls.js" ;


class Profile extends React.Component {
  state = {
    error : null , //holds the error
    loading : true , //to determine if the page is loading
    account_info : [] , //holds the account info
    // selected_button : "change_password" , //changes whenever a user selected a button. is on the top button by default

  }

  componentDidMount(){
    // console.log('token CDM : ' + this.props.token)
    // console.log('username CDM: ' + this.props.username)
    this.setState({
      loading: false ,
    })

    PageView() ;
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



    console.log(selected_button)

    return(
      <React.Fragment>
        {
          authenticated  ?
            <Container>
              <h4>{username}</h4>
              <hr />
              <Row>
                <Col sm={{ span: 6 }}>
                  <ListGroup variant="flush" className="bg-app">
                  {
                    !loading &&
                      <React.Fragment>
                        <ListGroup.Item className="bg-app">
                          <UserInformation token={token} />
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-app">
                          <UserArticleInteractions token={token} />
                        </ListGroup.Item>
                        {/*only display the admin card if the user is me (that is my token)*/
                          token === "8eb05e1e2a096148f4686c071328cd1fbdec1904" &&
                            <ListGroup.Item className="bg-app">
                              <AdminCard />
                            </ListGroup.Item>
                        }
                      </React.Fragment>
                  }
                  </ListGroup>
                </Col>
                <Col sm={{ span: 6}} >
                  <ListGroup variant="flush" className="bg-app">
                    <ListGroup.Item className="bg-app">
                      <ChangePassword />
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-app">
                      <UserEmailPreferences />
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>

            </Container>
          :
            <React.Fragment>


              <Alert variant="secondary" >
                <Alert.Heading>Oops! How'd you get here? </Alert.Heading>
                <hr/>
                <p className="mb-0">
                  Are you lost? You can <Alert.Link href="/login" onClick={() => Event("Routing", "Opening Login Page", "From 'user not logged in' section of Profile Page")}>login</Alert.Link> or <Alert.Link href="/signup" onClick={() => Event("Routing", "Opening Signup Page", "From 'user not logged in' section of Profile Page") }>signup</Alert.Link>.
                </p>

              </Alert>

            </React.Fragment>

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
