import React from "react";
import {Link} from "react-router-dom";
import {
  Container ,
  Badge ,
  Col ,
  Row ,
  Form ,
  ListGroup ,
  Button ,
  Alert ,

} from 'react-bootstrap';
import axios from "axios";
import { connect } from "react-redux";
// found at https://www.npmjs.com/package/react-bootstrap-icons


import TwitterLogo from './Misc/TwitterLogo';
import FacebookLogo from './Misc/FacebookLogo';
import RegisterEmail from './Misc/RegisterEmail';
import RichText from './Misc/RichText';
import LoaderSpinner from './Misc/LoaderSpinner';
import CommentSection from './Misc/CommentSection' ;
import "../content/css/App.css";
import {
  article_url,

} from "../backend-urls.js" ;




class ArticlePage extends React.Component  {

  state = {
    loading : false , //to determine if the page is loading
    error : null , //stores the error that comes from backend
    article_data: [] , //stores the article information

  }

  componentDidMount(){
    this.setState({
      loading: true ,
    })

    this.handleGetArticle() ;

  }



  handleGetArticle = () => {
    var article_id = this.props.match.params.article_id
    axios
      .get(article_url(article_id) )
      .then(response => {
        // console.log(response.data);
        this.setState({
          loading: false ,
          article_data: response.data ,
        })
      })
      .catch(error => {
        this.setState({
          error: error ,
          loading : false
        })
      })
  }




  render(){

    const {
      article_data ,
      loading ,

    } = this.state

    const {
      authenticated ,

    } = this.props

    // console.log(comment_body)
    // console.log(commenter_name)

    // console.log(  article_data['comments'] )


    const article_date = new Date(article_data['created_date']).toDateString()  ;

    var apollo_div = document.getElementById("apollo_widget_left_sidebar")
    var sm_div = document.getElementById("sm_links_left_sidebar")
    //gets the first element with the tag name "body" aka, the entire page
    var body= document.getElementsByTagName("body")[0];
    body.onscroll = function(e){
      //documentElement.scrollTop gets the number of elements from the top
      if( document.documentElement.scrollTop >= 70){
        //makes the "apollo" thing appear after they scroll more than 70 px. (approx the height of the nav bar)
        apollo_div.classList.add("AfterScroll")  ;
      }else {
        //removes the "apollo" thing if the navbar comes into view
        apollo_div.classList.remove("AfterScroll") ;
      }

      if(document.documentElement.scrollTop >= 225)
      {
        sm_div.classList.add("AfterScroll");
      }else{
        sm_div.classList.remove("AfterScroll");
      }


    }

var twitter_link = "https://twitter.com/intent/tweet?text=check%20out%20this%20new%20cryptocurrency%20startup!%20https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
var facebook_link = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']

    return (

      <React.Fragment>

        <Container >

          <Row>
            <Col xs={2}>

              <ListGroup

                variant="flush"
                className="sticky-top BeforeScroll "
              >
                <div id="apollo_widget_left_sidebar">
                  <ListGroup.Item className="bg-app">
                    <h4
                      className="verdana-font"
                      onClick={() => this.props.history.push('/')}
                      style={{cursor: 'pointer'}}
                    >
                        Apollo
                    </h4>
                  </ListGroup.Item>

                  {
                    !authenticated &&
                    <ListGroup.Item className="bg-app">
                      <Link to="/signup" className="article-link">
                        <Badge >
                          Create an account
                        </Badge>
                      </Link>
                      <RegisterEmail text="Get email updates" direction="right"/>
                    </ListGroup.Item>
                  }
                </div>

                  <ListGroup.Item >
                    <div id="sm_links_left_sidebar">
                      <a href={twitter_link} >
                        <TwitterLogo />
                      </a>

                      <a href={facebook_link}>
                        <FacebookLogo />
                      </a>
                    </div>
                  </ListGroup.Item>

              </ListGroup>
            </Col>

            <Col xs={8} >

              {
                loading ?
                  <LoaderSpinner />
                :
                  <React.Fragment>
                    {
                      article_data  ?
                        <React.Fragment>
                          <h1 className="times-new-roman-font">
                            {  article_data['title'] }
                          </h1>

                            <h6 className="padding-left-10px">
                              By { article_data['author']} <Badge>{ article_date }</Badge>
                              <div className="float-right">
                                <a href={twitter_link} >
                                  <TwitterLogo />
                                </a>


                                <a href={facebook_link}>
                                  <FacebookLogo />
                                </a>
                              </div>
                            </h6>


                          <hr />
                          {/*Displays the body of the article in Rich Text*/}

                          <RichText  text={article_data['body']} classes="times-new-roman-font"/>
                        </React.Fragment>
                      :
                        <Alert variant="dark">There was an issue loading this article</Alert>
                    }

                    <br />
                    {
                      /*only displays the "sign up for email updates" if they aren't signed in*/
                      !authenticated &&
                        <div style={{backgroundColor:"lightgrey" , paddingTop:"8px" , paddingBottom:"3px", paddingLeft:"8px" , borderRadius:"4px"}}>
                          <text >Like what you see? Subscribe for updates on our website</text>
                          <Form >
                            <Form.Row>
                              <Col>
                                <Form.Control type="email" placeholder="Enter email" />
                              </Col>
                              <Col>
                                <Button variant="primary" type="submit">
                                  Submit
                                </Button>
                              </Col>
                            </Form.Row>
                            <small>We will never sell your information </small>
                          </Form>
                          <br />
                        </div>

                    }

                  <CommentSection comments={article_data['comments']} article_id={this.props.match.params.article_id}/>
                </React.Fragment>
              }
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading ,
    error: state.auth.error ,
    authenticated: state.auth.token !== null ,
  };
};

export default
    connect(
      mapStateToProps,

    )(ArticlePage);
