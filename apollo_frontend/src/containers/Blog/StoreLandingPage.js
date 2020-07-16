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
import { Event, PageView } from "../GlobalMisc/Tracking";

import { ConeStriped  } from 'react-bootstrap-icons';

import TwitterLogo      from    '../GlobalMisc/TwitterLogo';
import RedditLogo       from    '../GlobalMisc/RedditLogo';
import LinkedInLogo     from    '../GlobalMisc/LinkedInLogo';
import EmailLogo        from    '../GlobalMisc/EmailLogo';
import FacebookLogo     from    '../GlobalMisc/FacebookLogo';




import "../../content/css/App.css";

//base on one of these.... -> https://colorlib.com/wp/free-under-construction-templates/
//I like a mix of V02 and V05
class StoreLandingPage extends React.Component {




  render(){
    const twitter_link = "https://twitter.com/intent/tweet?text=check%20out%20this%20new%20ecommerce%20startup!%20https%3A%2F%2Fwww.apollostore.co/store"
    const facebook_link = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse "
    //" https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
    const reddit_link = "https://www.reddit.com/submit?url=https%3A%2F%2Fwww.apollostore.co/store&title=Check%20Out%20This%20New%20Ecommerce%20Startup "
    const email_link = "mailto:?subject=Check Out This New Ecommerce Startup&body=Check Out This New Ecommerce Startup!%0A%0A They are the first ecommerce site that is accepting Bitcoin and they've got big plans!%0A%0A You can read more about them out at https%3A%2F%2Fwww.apollostore.co/store"
    const linkedin_link = "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.apollostore.co/store"

    return(
      <React.Fragment>
        <Container>

          <Col xs={{ span: 8, offset: 2 }}>
              {' '}
              {' '}
              {' '}

            <Row>
              <h1 className="verdana-font">
                Under
              </h1>
            </Row>
            <Row>
              <h1 className="verdana-font">
                Construction
              </h1>
            </Row>
            <Row>
              {/*this nav with the class is used to make the text grey*/}
              <nav className="navbar-light">
                <Navbar.Text><h6 className="verdana-font ">This part of our website is currently under construction, follow us below for updates!</h6></Navbar.Text>
              </nav>
            </Row>

            <hr />

            <Form>
              <Form.Row className="align-items-center">
                <Col xs={9}>

                  <Form.Label htmlFor="inlineFormInput" srOnly>
                    Name
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    id="inlineFormInput"
                    placeholder="Jane Doe"
                  />
                </Col>

                <Col xs={3}>
                  <Button block type="submit" className="mb-2">
                    Submit
                  </Button>
                </Col>

              </Form.Row>
            </Form>

            <h6>Share us on social media with the links below.</h6>
            <Row>
              <a target="_blank" href={twitter_link} onClick={ () => Event("Article Sharing", "Sharing Article via Twitter Link in Left Sidebar", "From Article Page") }>
                <TwitterLogo />
              </a>
              <br />
              <a target="_blank" href={reddit_link} onClick={ () => Event("Article Sharing", "Sharing Article via Reddit Link in Left Sidebar", "From Article Page") }>
                <RedditLogo />
              </a>
              <br />
              <a target="_blank" href={linkedin_link} onClick={ () => Event("Article Sharing", "Sharing Article via Linkedin Link in Left Sidebar", "From Article Page") }>
                <LinkedInLogo />
              </a>
              <br />
              <a target="_blank" href={email_link} onClick={ () => Event("Article Sharing", "Sharing Article via Email Link in Left Sidebar", "From Article Page") }>
                <EmailLogo />
              </a>
            </Row>

          </Col>

          {/*
          <Row>
            <h1
              className="verdana-font"
              style={{  left: '50%' }}
            >
              Under Construction
            </h1>
          </Row>
          */}


        </Container>



      </React.Fragment>
    )
  }

}



export default StoreLandingPage ;
