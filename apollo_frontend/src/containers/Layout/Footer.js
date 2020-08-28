import React from "react" ;
import {
  Container ,
  Navbar ,
  Nav ,

} from 'react-bootstrap';

import "content/css/App.css";


function Footer() {

  return (
    <Navbar sticky="bottom" className="footer">
      <Container>
        <Navbar.Text className="ubuntu-regular-font">&copy; {new Date().getFullYear()} - Apollo {/*- Cary, NC*/}</Navbar.Text>

        <Nav>
          {/* "Privacy" , "Store" , "Technology" , etc. */}
          <Nav.Item >
            <Nav.Link
              href="/store"
              className="ubuntu-regular-font"
              onClick={() => Event("Routing", "Opening Store Page",  "From Footer")}
            >
              Store
            </Nav.Link>
          </Nav.Item>
          <Nav.Item >
            <Nav.Link
              href="/blog"
              className="ubuntu-regular-font"
              onClick={() => Event("Routing", "Opening Blog Page",  "From Footer")}
            >
              Blog
            </Nav.Link>
          </Nav.Item>
          <Nav.Item >
            <Nav.Link
              href="/contribute"
              className="ubuntu-regular-font"
              onClick={() => Event("Routing", "Opening Contribute Page",  "From Footer")}
            >
              Contribute
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}



export default Footer;
