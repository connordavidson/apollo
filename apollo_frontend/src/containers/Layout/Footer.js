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
        <Navbar.Text >&copy; {new Date().getFullYear()} - Apollo {/*- Cary, NC*/}</Navbar.Text>

        <Nav>
          {/* "Privacy" , "Store" , "Technology" , etc. */}
          <Nav.Item ><Nav.Link href="/store">Store</Nav.Link></Nav.Item>
          <Nav.Item > <Nav.Link href="/blog">Blog</Nav.Link>  </Nav.Item>
          <Nav.Item ><Nav.Link href="/careers">Careers</Nav.Link></Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}



export default Footer;
