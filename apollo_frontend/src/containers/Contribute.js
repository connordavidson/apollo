import React from "react";
import {Link} from "react-router-dom";
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
import { CheckCircle  } from 'react-bootstrap-icons';

import { Event, PageView} from './GlobalMisc/Tracking';

import TwitterLogo      from    './GlobalMisc/TwitterLogo';
import RedditLogo       from    './GlobalMisc/RedditLogo';
import LinkedInLogo     from    './GlobalMisc/LinkedInLogo';
import EmailLogo        from    './GlobalMisc/EmailLogo';
import FacebookLogo     from    './GlobalMisc/FacebookLogo';

import ButtonLoaderSpinner    from    './GlobalMisc/ButtonLoaderSpinner'



class Contribute extends React.Component  {

  state = {
    error: null , //stores the error that comes from the backend
    loading : false , //to determine if the page is loading
    email: "" , //stores the email from the "add email" widget
    email_submitted : null , //stores the response value after a user submits their email

  }

  componentDidMount(){
    PageView() ;
  }


  render() {
    const {
      error ,
      loading ,
      email_submitted ,
      email ,

    } = this.state


    const twitter_link = "https://twitter.com/intent/tweet?text=check%20out%20this%20new%20ecommerce%20startup!%20https%3A%2F%2Fwww.apollostore.co/store"
    // const facebook_link = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse "
    //" https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
    const reddit_link = "https://www.reddit.com/submit?url=https%3A%2F%2Fwww.apollostore.co/store&title=Check%20Out%20This%20New%20Ecommerce%20Startup "
    const share_email_link = "mailto:?subject=Check Out This New Ecommerce Startup&body=Check Out This New Ecommerce Startup!%0A%0A They are the first ecommerce site that is accepting Bitcoin and they've got big plans!%0A%0A You can read more about them out at https%3A%2F%2Fwww.apollostore.co/blog"
    const linkedin_link = "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.apollostore.co/blog"
    const email_link = "mailto:connor@apollostore.co?subject=I%27m Interested in helping with Apollo!"

    return(

        <Container>

          <Col xs={{ span: 8, offset: 2 }}>
            <br />
            <br />
            <br />
            <br />
            <Row>
              <h3 className="l1-txt1 txt-center p-b-10">
                Interested?
              </h3>
            </Row>
            <hr />
{/*
            <Row>
              <h3 className="l1-txt1 txt-center p-b-10">
                Help us!
              </h3>
            </Row>
*/}
            <Row>

              {/*  this nav with the class is used to make the text grey  */}
              <nav className="navbar-light">
                <Navbar.Text>
                  <h6 class=" ubuntu-regular-font font-size-24px">
                    Are you interested in what we are doing here at Apollo and want to help create the future of ecommmerce?
                  </h6>

                  <h6 class=" ubuntu-regular-font font-size-24px">
                   Send an email to <a class=" ubuntu-regular-font font-size-24px" target="_blank" href={email_link}>contribute@apollostore.co</a> with detailing any skills that can contribute to any of the following
                  </h6>
                  <br />

                  <div className="ubuntu-bold-font font-size-24px ">
                    <ul className="centered-ul">
                      <li>
                        writing & research
                      </li>
                      <li>
                        software development
                      </li>
                      <li>
                        project management
                      </li>
                      <li>
                        any other areas where you think can help
                      </li>
                    </ul>
                  </div>
                  <br />
                  <h6 class=" ubuntu-regular-font font-size-24px">
                    Do you know someone that would be interested in contributing? Feel free to share our site with them.
                  </h6>
                </Navbar.Text>
              </nav>
            </Row>

            <hr />

            <br />
            <br />
            <br />

            <h6 className="ubuntu-regular-font txt-center">Share us on social media with the links below.</h6>
            <br />
            <Row    >
              <Col xs={{ span: 4, offset: 4 }} >
                <div class="float-right width-300px" >
                  <a
                    class=" float-right margin-right-5-percent "
                    target="_blank"
                    href={twitter_link}
                    onClick={ () => Event("Article Sharing", "Sharing Article via Twitter Link in Left Sidebar", "From Article Page") }
                  >
                    <TwitterLogo />
                  </a>

                  <a
                    class=" float-right margin-right-5-percent "
                    target="_blank"
                    href={reddit_link}
                    onClick={ () => Event("Article Sharing", "Sharing Article via Reddit Link in Left Sidebar", "From Article Page") }
                  >
                    <RedditLogo />
                  </a>

                  <a
                    class=" float-right margin-right-5-percent "
                    target="_blank"
                    href={linkedin_link}
                    onClick={ () => Event("Article Sharing", "Sharing Article via Linkedin Link in Left Sidebar", "From Article Page") }
                  >
                    <LinkedInLogo />
                  </a>

                  <a
                    class=" float-right margin-right-5-percent "
                    target="_blank"
                    href={share_email_link}
                    onClick={ () => Event("Article Sharing", "Sharing Article via Email Link in Left Sidebar", "From Article Page") }
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

        </Container>

    )
  }
}



export default Contribute ;
