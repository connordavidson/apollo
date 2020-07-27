import React from "react" ;
import {
  Container ,
  Navbar ,
  Nav ,

} from 'react-bootstrap';

import "../../content/css/App.css";


function Footer() {

  return (
    <Navbar sticky="bottom" className="footer">
      <Container>
        <Navbar.Text className="ubuntu-regular-font">&copy; {new Date().getFullYear()} - Apollo {/*- Cary, NC*/}</Navbar.Text>

        <Nav>
          {/* "Privacy" , "Store" , "Technology" , etc. */}
          <Nav.Item ><Nav.Link href="/store" className="ubuntu-regular-font">Store</Nav.Link></Nav.Item>
          <Nav.Item > <Nav.Link href="/blog" className="ubuntu-regular-font">Blog</Nav.Link>  </Nav.Item>
          <Nav.Item ><Nav.Link href="/careers" className="ubuntu-regular-font">Careers</Nav.Link></Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}



export default Footer;
