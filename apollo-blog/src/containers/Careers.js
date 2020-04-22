import React from "react";
import {Link} from "react-router-dom";
import {
  Container ,
  Row ,
  Col ,

} from 'react-bootstrap';

import { Event, PageView} from './Misc/Tracking';



class Careers extends React.Component  {

  componentDidMount(){
    PageView() ;
  }


  render() {
    return(
      <Container >

        <h1 className="verdana-font">
          Careers with Apollo
        </h1>

        <hr />

        <p>If you are interested in what we're doing here, send us an email with your resume and interests at <a href="mailto:apollo-team@apollo.com" onClick={() => Event("Careers Email Link" , "Click Careers Email Link" , "From Careers Page")}>apollo-team@apollo.com</a>
        </p>

      </Container>
    )
  }
}



export default Careers ;
