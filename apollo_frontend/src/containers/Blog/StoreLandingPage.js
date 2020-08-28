import React from "react" ;
import {Link} from "react-router-dom";
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
  Navbar ,
  Form ,
  InputGroup ,
  FormControl ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import { CheckCircle  } from 'react-bootstrap-icons';

import { Event, PageView } from "../GlobalMisc/Tracking";

import TwitterLogo      from    '../GlobalMisc/TwitterLogo';
import RedditLogo       from    '../GlobalMisc/RedditLogo';
import LinkedInLogo     from    '../GlobalMisc/LinkedInLogo';
import EmailLogo        from    '../GlobalMisc/EmailLogo';
import FacebookLogo     from    '../GlobalMisc/FacebookLogo';

import ButtonLoaderSpinner    from    '../GlobalMisc/ButtonLoaderSpinner'

import RocketToMoon     from    '../GlobalMisc/RocketToMoon/RocketToMoon';


import {
  create_email_address_url ,

} from "../../backend-urls.js" ;

import "../../content/css/App.css";



//base on one of these.... -> https://colorlib.com/wp/free-under-construction-templates/
//I like a mix of V02 and V05
class StoreLandingPage extends React.Component {

  state = {
    error : null , //stores the error that comes from the backend
    loading : false , //to determine if the page is loading
    email : "" , //stores the email from the "add email" widget
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
          loading: false ,
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

    // console.log(text.target.value)
    this.setState({
      email: text.target.value
    });

  }



  render(){
    const {
      error ,
      loading ,
      email_submitted ,
      email ,

    } = this.state

    console.log(email_submitted)

    const twitter_link = "https://twitter.com/intent/tweet?text=check%20out%20this%20new%20ecommerce%20startup!%20https%3A%2F%2Fwww.apollostore.co/store"
    const facebook_link = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse "
    //" https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
    const reddit_link = "https://www.reddit.com/submit?url=https%3A%2F%2Fwww.apollostore.co/store&title=Check%20Out%20This%20New%20Ecommerce%20Startup "
    const email_link = "mailto:?subject=Check Out This New Ecommerce Startup&body=Check Out This New Ecommerce Startup!%0A%0A They are the first ecommerce site that is accepting Bitcoin and they've got big plans!%0A%0A You can read more about them out at https%3A%2F%2Fwww.apollostore.co/store"
    const linkedin_link = "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.apollostore.co/store"

    return(

        <Container>
          <Row >

            <Col xs={{span: 12}} lg={{ span: 8, offset: 2 }}>

              <RocketToMoon />
              {/*
              <Row>
                <h3 className="l1-txt1 txt-center p-b-10">
                  Under
                </h3>
              </Row>
              <Row>
                <h3 className="l1-txt1 txt-center p-b-10">
                  Construction
                </h3>
              </Row>
              */}
              <Row>
                <h3 className="l1-txt1 txt-center p-b-10">
                  Coming
                </h3>
              </Row>
              <Row>
                <h3 className="l1-txt1 txt-center p-b-10">
                  Soon
                </h3>
              </Row>
              <Row>
                {/*this nav with the class is used to make the text grey*/}
                <nav className="navbar-light">
                  <Navbar.Text><h6 className=" ubuntu-regular-font font-size-24px">This part of our website is currently under development, sign up below for early access and special promotions!</h6></Navbar.Text>
                </nav>
              </Row>

              <hr />

              <br />
              <br />

              {/*<Form>*/}
                <Form.Row className="align-items-center">
                  <Col xs={7} s={9}>

                    <Form.Label htmlFor="inlineFormInput" srOnly>Email</Form.Label>
                    <Form.Control
                      type="email"
                      onChange={this.handleEmail}
                      value={email}
                      className="mb-2 s1-txt3 placeholder0 wrap-input100 width-100-percent "
                      placeholder="Email"
                    />
                  </Col>

                  <Col xs={5} s={3}>
                    {

                      loading ?
                        <Button
                          disabled={true}
                          type="submit"
                          className="mb-2 flex-c-m s1-txt4 size3 where1 how-btn width-100-percent "
                        >
                          <ButtonLoaderSpinner />
                        </Button>
                      :
                        <Button
                          disabled={this.handleEmailValidated() || email_submitted}
                          onClick={this.handlePostEmailWithGA }
                          type="submit"
                          className="mb-2 flex-c-m s1-txt4 size3 where1 how-btn width-100-percent "
                        >
                          Submit
                        </Button>
                    }
                  </Col>
                </Form.Row>
                <Form.Row >
                    {
                      email_submitted &&
                        <Col sm={{ span: 5, offset: 7 }} xs={{ span: 8, offset: 4 }} >
                          <small className="ubuntu-regular-font color-green " >
                            Submitted! You'll receive an email shortly
                          </small>
                        </Col>
                    }
                </Form.Row>
              {/*</Form>*/}

              <br />
              <br />
              <br />
              <br />

              <h6 className="txt-center">Share us on social media with the links below.</h6>
              <br />
              <Row    >
                <Col xs={{ span: 4, offset: 4 }} >
                  <div class="float-right width-300px" >
                    <a
                      class=" float-right margin-right-5-percent "
                      target="_blank"
                      href={twitter_link}
                      onClick={ () => Event("Store Page Sharing", "Sharing Store Page via Twitter Link", "From Store Page") }
                    >
                      <TwitterLogo />
                    </a>

                    <a
                      class=" float-right margin-right-5-percent "
                      target="_blank"
                      href={reddit_link}
                      onClick={ () => Event("Store Page Sharing", "Sharing Store Page via Reddit Link", "From Store Page") }
                    >
                      <RedditLogo />
                    </a>

                    <a
                      class=" float-right margin-right-5-percent "
                      target="_blank"
                      href={linkedin_link}
                      onClick={ () => Event("Store Page Sharing", "Sharing Store Page via Linkedin Link", "From Store Page") }
                    >
                      <LinkedInLogo />
                    </a>

                    <a
                      class=" float-right margin-right-5-percent "
                      target="_blank"
                      href={email_link}
                      onClick={ () => Event("Store Page Sharing", "Sharing Store Page via Email Link", "From Store Page") }
                    >
                      <EmailLogo />
                    </a>
                  </div>
                </Col>
              </Row>
              <br />
              <br />
              <br />
              <br />

            </Col>
          </Row >
        </Container>

    )
  }

}



export default StoreLandingPage ;
