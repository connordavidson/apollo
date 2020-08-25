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

import Error404GraphicSVG from "./Error404GraphicSVG" ;
//should get triggered if the user enteres a URL that is nonexistant..
//if they enter "apollo.com/buystuff" it'll redirect here. try something with wildcards?? idk
// or with something like this.  <Route exact path="*" component={Error} />

// inspired by -> https://codepen.io/kdbkapsere/pen/oNXLbqQ

function Error404() {
  return(

      <Container>
        <Row>
          <Col xs="6">
            <Error404GraphicSVG />
          </Col>
          {/*<Col xs={{ span: 8, offset: 2 }}>*/}
          <Col xs={{ span: 6 }}>
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
              >
                Home
              </Button>
            </Row>
            <hr />

            <br />
            <br />
          </Col>
        </Row>
      </Container>
  )
}

export default Error404 ;
