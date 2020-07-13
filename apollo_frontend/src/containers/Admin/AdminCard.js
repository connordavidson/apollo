import React from 'react';
import axios from "axios";


import {
  Container ,
  Col ,
  Row ,
  Card ,
  Button ,
  Form ,

} from 'react-bootstrap';

import {Link} from "react-router-dom";
import { connect } from "react-redux";
import {withRouter} from 'react-router';


import LoaderSpinner    from    '../GlobalMisc/LoaderSpinner';




class AdminCard extends React.Component {

  state = {
    error : null , //holds the error
    loading : true , //to determine if the page is loading

  }
  componentDidMount(){
    this.setState({
      loading: false ,
    })

  }


  render(){

    const {
      error ,
      loading ,

    } = this.state

    const {
      token ,

    } = this.props

    return(
      <Container>
        <Card>
          <Card.Body>
            <Card.Title><h5>Admin</h5></Card.Title>
            <hr />
            {
              loading ?
                <LoaderSpinner />
              :
                token === "8eb05e1e2a096148f4686c071328cd1fbdec1904" &&
                  <React.Fragment>
                      <Row>
                        <Button
                          block
                          variant="outline-secondary"
                          href="/create-article"
                        >
                          Write an Article
                        </Button>
                      </Row>
                      <br />
                      <Row>
                        <Button
                          block
                          variant="outline-secondary"
                          href="/send-email"
                        >
                          Send an Email
                        </Button>
                      </Row>
                  </React.Fragment>
            }
          </Card.Body>
        </Card>
      </Container>
    )
  }

}


const mapStateToProps = state => {
  console.log(state.auth.token)
  return {
    loading: state.auth.loading ,
    error: state.auth.error ,
    token: state.auth.token ,
    username: state.auth.username ,
    authenticated: state.auth.token !== null ,
  };
};

export default
  withRouter(
    connect(
      mapStateToProps,

    )(AdminCard)
  );
