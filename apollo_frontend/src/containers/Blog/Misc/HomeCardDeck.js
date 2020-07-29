import React from "react" ;
import {Link} from "react-router-dom";
import axios from "axios";

import {
  CardDeck ,
  ListGroup ,
  Badge ,

} from 'react-bootstrap';

import { connect } from "react-redux";
import { Event } from "../../GlobalMisc/Tracking";

// found at https://www.npmjs.com/package/react-bootstrap-icons
import { StarFill  } from 'react-bootstrap-icons';

// import RichText from '../../GlobalMisc/RichText';

import HomeCard from './HomeCard';


import "../../../content/css/App.css";



class HomeCardDeck extends React.Component {

  render(){
    return(

        <CardDeck>
          <HomeCard article={this.props.articles[0]} />
          <HomeCard article={this.props.articles[1]} />
          <HomeCard article={this.props.articles[2]} />
        </CardDeck>



    )
  }

}


export default HomeCardDeck ;
