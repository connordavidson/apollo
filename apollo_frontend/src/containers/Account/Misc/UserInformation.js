import React from 'react';
import axios from "axios";

import {
  Container ,
  Col ,
  Row ,
  Card ,

} from 'react-bootstrap';


import LoaderSpinner    from    '../../GlobalMisc/LoaderSpinner';


import {
  get_user_details_url ,

} from "../../../backend-urls.js" ;



class UserInformation extends React.Component {

  state = {
    error : null , //holds the error
    loading : true , //to determine if the page is loading
    account_info : [] , //holds the account info
    // selected_button : "change_password" , //changes whenever a user selected a button. is on the top button by default

  }
  componentDidMount(){
    this.setState({
      loading: true ,
    })

    this.handleGetAccount() ;
  }

  handleGetAccount = () => {
    this.setState({
      loading: true ,
    })

    var auth_token = 'Token ' + this.props.token ;
    axios
      .get( get_user_details_url ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log("response: " + response.data)
        this.setState({
          loading : false ,
          account_info : response.data
        })

      })
      .catch(error => {
        // console.log("error: " + error.data)
        this.setState({
          loading : false ,
          erorr : error.data
        })
      })
  }


  render(){

    const {
      error ,
      loading ,
      account_info ,

    } = this.state


    return(
      <Container>
        <Card>
          <Card.Body>
            <Card.Title><h5>Account Information</h5></Card.Title>
            <hr />
            {
              loading ?
                <LoaderSpinner />
              :
                <Row>
                    <Col sm={{ span: 4 }}>
                      <b>Email:</b>
                    </Col>
                    <Col sm={{ span: 8 }}>
                      {account_info['email']}
                    </Col>
                    <Col sm={{ span: 4 }}>
                      <b>Username:</b>
                    </Col>
                    <Col sm={{ span: 8 }}>
                      {account_info['username']}
                    </Col>
                    <Col sm={{ span: 4 }}>
                      <b>Joined:</b>
                    </Col>
                    <Col sm={{ span: 8 }}>
                      {!loading && new Date(account_info['date_joined']).toDateString()}
                    </Col>
                    <Col sm={{ span: 4 }}>
                      <b>Last Login:</b>
                    </Col>
                    <Col sm={{ span: 8 }}>
                      {!loading && new Date(account_info['last_login']).toDateString()}
                    </Col>
                </Row>
            }
          </Card.Body>
        </Card>
      </Container>
    )
  }

}



export default (UserInformation) ;
