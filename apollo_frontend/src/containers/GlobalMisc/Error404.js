import React from "react" ;

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

import Error404GraphicSVG from "containers/GlobalMisc/Error404GraphicSVG" ;
import { Event, PageView } from 'containers/GlobalMisc/Tracking';
//should get triggered if the user enteres a URL that is nonexistant..
//if they enter "apollo.com/buystuff" it'll redirect here. try something with wildcards?? idk
// or with something like this.  <Route exact path="*" component={Error} />

// inspired by -> https://codepen.io/kdbkapsere/pen/oNXLbqQ

class Error404 extends React.Component  {

    componentDidMount(){

      PageView();

    }

  render(){
    return(

        <Container>


          <Row className="padding-top-test">

            {/*
              * align-self-center : keeps it horizontally aligned with the svg to the left as the width of the window shrinks
            */}
            <Col lg={{ span: 6 }} className="align-self-center">
              <br />
              <br />
              <br />
              <br />
              <Row>
                <h1 className="l1-txt1 txt-center p-b-10">
                  404
                </h1>
              </Row>

              <Row>
                <h3 className="l1-txt1-fs-40px txt-center p-b-10">
                  Uh oh! You must be lost
                </h3>
              </Row>

              <Row>
                {/*this nav with the class is used to make the text grey*/}
                <nav className="navbar-light">
                  <Navbar.Text><h6 className=" ubuntu-regular-font font-size-24px">The page you are looking for does not exist. How you got here is a mystery. But you can click the button below to go back to the homepage.</h6></Navbar.Text>
                </nav>
              </Row>

              <Row>
                <Button
                  className="mb-2 flex-c-m s1-txt4 size3 where1 how-btn "
                  href="/blog"
                  onclick={Event("Routing", "Opening Home Page", "From 404 Page")}
                >
                  Home
                </Button>
              </Row>
              <hr />

              <br />
              <br />

            </Col>
            <Col  lg={{ span: 6 , order: "first" }} className="align-self-center" >
              <Error404GraphicSVG />
            </Col>
          </Row>
        </Container>
    )
  }
}

export default Error404 ;
