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
        <Navbar.Text >&copy; {new Date().getFullYear()} - Apollo</Navbar.Text>
        <Nav>
          <Navbar.Text ><Nav.Link href="#">Legal</Nav.Link></Navbar.Text>
          <Navbar.Text ><Nav.Link href="#">Privacy</Nav.Link></Navbar.Text>
          <Navbar.Text ><Nav.Link href="/careers">Careers</Nav.Link></Navbar.Text>
        </Nav>
      </Container>
    </Navbar>
  );
}



export default Footer;
