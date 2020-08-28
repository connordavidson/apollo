import React from "react" ;
import {Link} from "react-router-dom";
import axios from "axios";

import {
  CardDeck ,
  ListGroup ,
  Badge ,

} from 'react-bootstrap';

import { connect } from "react-redux";
// found at https://www.npmjs.com/package/react-bootstrap-icons
import { StarFill  } from 'react-bootstrap-icons';

import { Event } from "containers/GlobalMisc/Tracking";
import HomeCard from 'containers/Blog/Misc/HomeCard';

import "content/css/App.css";



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
