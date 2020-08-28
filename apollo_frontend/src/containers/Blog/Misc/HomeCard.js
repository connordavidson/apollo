import React from "react" ;
import {Link} from "react-router-dom";
import axios from "axios";

import {
  Card ,
  ListGroup ,
  Badge ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import { Event } from "containers/GlobalMisc/Tracking";

// found at https://www.npmjs.com/package/react-bootstrap-icons
import { StarFill  } from 'react-bootstrap-icons';

// import RichText from '../../GlobalMisc/RichText';
import  RichText  from "containers/GlobalMisc/RichText";

import "content/css/App.css";

class HomeCard extends React.Component {

  render(){
    return(

        <Card
          as="a"
          href={'blog/article/'+this.props.article.id}
          className="plain-link border-radius-25px "
        >

          <Card.Img
            variant="top"
            src={require("content/images/apollo_calibri_light_grey_bkg_md.png") }
            className="border-radius-25px-top-corners "
          />

          <Card.Body>
            <Card.Title className="roboto-bold-font">
              {this.props.article.title}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted roboto-regular-font">
              By {this.props.article.author}, <Badge>{new Date(this.props.article.created_date).toDateString() } </Badge>
            </Card.Subtitle>
            <Card.Text>
              <RichText text={this.props.article.body.substring(0, 175) + '...'} />
            </Card.Text>
          </Card.Body>

        </Card>

    )
  }
}


export default HomeCard ;
