import React from "react";
import {Link} from "react-router-dom";
import {
  Container ,
  Row ,
  Col ,

} from 'react-bootstrap';

import { Event, PageView} from './GlobalMisc/Tracking';



class Careers extends React.Component  {

  componentDidMount(){
    PageView() ;
  }


  render() {
    return(
      <Container >

        <h1 className="verdana-font">
          Careers With Apollo
        </h1>

        <hr />

        <p>
          If you are interested in what we're doing here, send us an email with your resume and skills at <a href="mailto:careers@apollo.com" onClick={() => Event("Careers Email Link" , "Click Careers Email Link" , "From Careers Page")}>careers@apollo.com</a>
        </p>

      </Container>
    )
  }
}



export default Careers ;
