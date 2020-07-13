import React from 'react';
import axios from "axios";

import {
  Button,
  Popover ,
  OverlayTrigger ,
  Badge ,
  Row ,
  Col ,
  Form,

} from 'react-bootstrap';
import { CheckCircle }        from    'react-bootstrap-icons';

import { Event }              from    '../../GlobalMisc/Tracking';
import ButtonLoaderSpinner    from    '../../GlobalMisc/ButtonLoaderSpinner'


import "../../../content/css/App.css";
import {
  create_email_address_url ,

} from "../../../backend-urls.js" ;


//text is what gets passed in. should be used like : <RichText text={example_rich_text} />
class RegisterEmail extends React.Component {

  state = {
    error: null , //stores the error that comes from the backend
    loading : false , //to determine if the page is loading
    email: "" , //stores the email from the "add email" widget
    email_submitted : null , //stores the response value after a user submits their email

  }

  handlePostEmailWithGA = () => {
    Event("Register Email" , "Register Email Atempt")
    this.handlePostEmail()
  }
  handlePostEmail = () => {
    this.setState({
      loading: true ,
      error: null ,

    })

    var data = new FormData();
    data.append('email' , this.state.email) ;

    axios
      .post(create_email_address_url , data)
      .then(response => {

        Event("Register Email" , "Register Email SUCCESS" )
        this.setState({
          email_submitted : true ,
          loading:false ,
        })
      })
      .catch(error => {

        Event("Register Email" , "Register Email FAIL" )
        this.setState({
          error: error.response.data  ,
          loading: false ,
        })
      })
  }

   handleEmailValidated = () => {
    var email = this.state.email
    //these are the most abstract validations that I can think of.. length is greater than 5 (contains an @, a ., and a letter before/after each. ie "a@b.co" would pass (I'm not sure if there are top-level domains with single letter so i just required 2 for the tld))
    var email_length_more_than_four = email.length > 5
    var email_contains_at = email.includes("@")
    var email_contains_period = email.includes(".")

    return !(email_length_more_than_four && email_contains_at && email_contains_period )
  }

   handleEmail = (text) => {
    this.setState({
      email: text.target.value
    });
  }

  handleClosePopover = () => {
    document.getElementById("emailBadge").click()
  }

  render(){

    const {
      error ,
      loading ,
      email_submitted ,
    } = this.state

      //for email popover
      const email_popover = (
        <Popover
          id="popover-basic"
          className="max-width-800px"
          // onBlur={() => {
          //   document.getElementById("emailBadge").click()
          // }}
        >
          <Popover.Title as="h3">Email Updates</Popover.Title>
          <Popover.Content >
              <Row >
                <Col>
                  <Form.Control
                    // style={{width:'200px'}}
                    className="width-250px"
                    type="email"
                    placeholder="Enter email"
                    onChange={this.handleEmail}
                  />
                  {
                    error&&
                      <small style={{color:'red'}} >{error}</small>
                    }
                </Col>
                <Col>
                  {
                    email_submitted ?
                      <CheckCircle className="text-success font-size-2-5em" />
                    :
                      loading ?
                          <Button
                            disabled={true}
                            variant="primary"
                            type="submit"
                            onClick={this.handlePostEmailWithGA }
                            className="float-right"
                          >
                            <ButtonLoaderSpinner />
                          </Button>
                      :
                        <Button
                          disabled={this.handleEmailValidated()}
                          variant="primary"
                          type="submit"
                          onClick={this.handlePostEmailWithGA }
                          className="float-right"
                        >
                          Submit
                        </Button>
                  }
                </Col>
              </Row>
          </Popover.Content>
        </Popover>
      )



    return (
        <OverlayTrigger
          trigger='click'
          placement={this.props.direction}
          overlay={email_popover}

        >
          <Badge
            id="emailBadge"
            className="font-size-10px"
            style={{cursor: 'pointer' , }}
          >
            {this.props.text}
          </Badge>
        </OverlayTrigger>
    )

  }

}

export default RegisterEmail ;
