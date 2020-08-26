import React from "react" ;
import {Link} from "react-router-dom";
import axios from "axios";

import {
  Card ,
  ListGroup ,
  Badge ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import { Event } from "../../GlobalMisc/Tracking";

// found at https://www.npmjs.com/package/react-bootstrap-icons
import { StarFill  } from 'react-bootstrap-icons';

import RichText from '../../GlobalMisc/RichText';

import "../../../content/css/App.css";



class PinnedArticle extends React.Component {

  render(){
    return(
      <ListGroup.Item className="bg-app" >
        <Link
          to={'blog/article/'+this.props.pinned_article.id}
          className="plain-link"
          onClick={() => Event("Routing", "Opening Pinned Article; id = " + this.props.pinned_article.id, "From Home Page")}
        >
          <Card
            className="width-100-percent border-radius-25px "
            id={this.props.pinned_article.id}
          >
            <Card.Body>
              <Card.Title className="roboto-bold-font">
                {this.props.pinned_article.title} <StarFill color="royalblue" className="float-right font-size-1-25em" />
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted roboto-regular-font">
                By {this.props.pinned_article.author}, <Badge>{new Date(this.props.pinned_article.created_date).toDateString() }</Badge>
              </Card.Subtitle>
              <Card.Text className="roboto-regular-font" >
                <RichText text={this.props.pinned_article.body +"..." } />
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </ListGroup.Item>

    )
  }

}


export default PinnedArticle ;
