import React from "react" ;
import {
  Container ,
  Navbar ,
  Nav ,

} from 'react-bootstrap';

import "../../content/css/App.css";


function Footer() {

  return (
    <Container className="footer">
      &copy; {new Date().getFullYear()}
      -
      Apollo
      -
      <a href="" > Legal </a>
      -
      <a href="" > Privacy </a>
      -
      <a href=""> Careers </a>

    </Container>

  );
}



export default Footer;
