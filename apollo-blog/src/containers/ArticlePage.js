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
// import { Event } from "./Misc/Tracking";
import { Event, PageView} from './Misc/Tracking';

// found at https://www.npmjs.com/package/react-bootstrap-icons


import TwitterLogo from './Misc/TwitterLogo';
import FacebookLogo from './Misc/FacebookLogo';
import RegisterEmail from './Misc/RegisterEmail';
import RichText from './Misc/RichText';
import LoaderSpinner from './Misc/LoaderSpinner';
import CommentSection from './Misc/CommentSection' ;
import ArticleUpvote from './Misc/ArticleUpvote' ;
import ArticleDownvote from './Misc/ArticleDownvote' ;

import "../content/css/App.css";
import {
  article_url,
  create_user_read_article_url ,

} from "../backend-urls.js" ;




class ArticlePage extends React.Component  {

  state = {
    loading : false , //to determine if the page is loading
    error : null , //stores the error that comes from backend
    article_data: [] , //stores the article information
    article_upvoted : false , //determines if the article is upvoted or not.
    article_downvoted : false , //determines if the article is downvoted or not.
    window_width : null , // stores the width of the window. used to determine if the left sidebar should be hidden
  }

  componentDidMount(){
    //resize event listener so the app knows when to remove the left sidebar. found at => https://gist.github.com/nma/33f8057e4899bdb55440a693a02c431b
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.updateWindowDimensions();

    this.setState({
      loading: true ,
    })
    PageView();
    this.handleGetArticle() ;
    this.handleCreateUserReadArticle() ;


  }


  updateWindowDimensions() {
      this.setState({ window_width: window.innerWidth >= 992, height: window.innerHeight });
  }



  handleGetArticle = () => {
    var article_id = this.props.match.params.article_id
    axios
      .get(article_url(article_id) )
      .then(response => {
        console.log(response.data);
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

  handleCreateUserReadArticle = () => {
    // var user_id = null ;
    //gets the user_id from local storage. difficulty getting user_id from redux-store

    var user_read_article_data = new FormData() ;
    user_read_article_data.append('article' , this.props.match.params.article_id )
    if(localStorage.getItem("user_id") != null){
      // user_id = localStorage.getItem("user_id")
      user_read_article_data.append('user' , localStorage.getItem("user_id"))
    }

    console.log("this.props.match.params.article_id : " + this.props.match.params.article_id) ;
    // console.log("this.props.user_id : " + user_id) ;

    axios
      .post(create_user_read_article_url , user_read_article_data)
      .then( response => {
        console.log("Create userreadarticle: " + response.data)
      })
      .catch(error => {
        console.log("error userreadarticle: " + error.data )
      })
  }


  /***the following two functions (handleArticleUpvoteClick & handleArticleDownvoteClick) are used when a user has upvoted an article and then hits the downvote button (and vise versa)***/

  //callback function for ArticleUpvote component. if the user is creating an upvote, it sets it to true. and false if the upvote is being removed (by the user hitting downvote)
  handleArticleUpvoteClick = (value) => {
    console.log("handleArticleUpvoted value : " + value)
    this.setState({
      article_upvoted : value ,
    })
  }
  //callback function for ArticleDownvote component. if the user is creating a downvote, it sets it to true. and flase if the downvote is being removed (by the user hitting upvote)
  handleArticleDownvoteClick = (value) => {
    console.log("handleArticleDownvoted value : " + value )
    this.setState({
      article_downvoted : value ,
    })
  }


  handleHomeButtonClickWithGA = () => {
    this.props.history.push('/') ;
    Event("Routing", "Opening Home Page", "From Article Page")
  }



  render(){

    const {
      article_data ,
      loading ,
      article_upvoted ,
      article_downvoted ,
      window_width ,

    } = this.state

    const {
      authenticated ,

    } = this.props

    // console.log("window_width : " + window_width)
    // console.log(commenter_name)

    // console.log(  article_data['comments'] )


    const article_date = new Date(article_data['created_date']).toDateString()  ;

    var apollo_div = document.getElementById("apollo_widget_left_sidebar")
    // var sm_div = document.getElementById("sm_links_left_sidebar")
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

      // if(document.documentElement.scrollTop >= 225)
      // {
      //   sm_div.classList.add("AfterScroll");
      // }else{
      //   sm_div.classList.remove("AfterScroll");
      // }


    }

    var twitter_link = "https://twitter.com/intent/tweet?text=check%20out%20this%20new%20cryptocurrency%20startup!%20https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
    var facebook_link = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse "
    //" https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']

    return (

      <React.Fragment>

        <Container >

          <Row>

            {
              window_width  &&
                <Col lg={2} >

                  <ListGroup
                    variant="flush"
                    className="sticky-top BeforeScroll "
                  >
                    <div id="apollo_widget_left_sidebar">
                      <ListGroup.Item className="bg-app">
                        <h4
                          className="verdana-font"
                          onClick={this.handleHomeButtonClickWithGA }
                          style={{cursor: 'pointer'}}
                        >
                            Apollo
                        </h4>

                      </ListGroup.Item>



                        <ListGroup.Item className="bg-app">

                          {
                            !loading &&

                                <React.Fragment>
                                  <ArticleUpvote article_id={article_data['id']} article_downvoted={article_downvoted} article_upvoted={this.handleArticleUpvoteClick} />
                                  <ArticleDownvote article_id={article_data['id']} article_upvoted={article_upvoted} article_downvoted={this.handleArticleDownvoteClick} />
                                </React.Fragment>
                          }

                          {
                            !authenticated &&
                              <React.Fragment>
                                <br />
                                <br />
                                <Link to="/signup" className="article-link" onClick={() => Event("Routing", "Opening Signup Page", "From Article Page") }>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                  >
                                    Signup
                                  </Button>
                                </Link>
                                {/* <RegisterEmail text="Get email updates" direction="right" onClick={() => Event("Register", "Register Email Button", "From Article Page")}/> */}

                              </React.Fragment>

                          }
                          <br />
                          <br />


                          <a target="_blank" href={twitter_link} onClick={ () => Event("Article Sharing", "Sharing Article via Twitter Link in Left Sidebar", "From Article Page") }>
                            <TwitterLogo />
                          </a>

                          {/*
                          <a target="_blank" href={facebook_link} onClick={ () => Event("Article Sharing", "Sharing Article via Facebook Link in Left Sidebar", "From Article Page") }>
                            <FacebookLogo />
                          </a>
                          */}
                        </ListGroup.Item>
                    </div>

                  </ListGroup>
                </Col>
            }
            <Col lg={8} md={12}  >

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
                            By { article_data['author']}, <Badge>{ article_date }</Badge>
                            <div className="float-right">
                              <a target="_blank" href={twitter_link} onClick={ () => Event("Article Sharing", "Sharing Article via Twitter Link in Title", "From Article Page") } >
                                <TwitterLogo />
                              </a>
                              {/*
                              <a target="_blank" href={facebook_link} onClick={ () => Event("Article Sharing", "Sharing Article via Facebook Link in Title", "From Article Page") } >
                                <FacebookLogo />
                              </a>
                              */}
                            </div>
                          </h6>

                          <hr />

                          {/*Displays the body of the article in Rich Text*/}
                          <RichText text={article_data['body']} classes="times-new-roman-font font-size-19px"/>
                        </React.Fragment>
                      :
                        <Alert variant="dark">There was an issue loading this article</Alert>
                    }

                    <br />
                    {
                      /*only displays the "sign up for email updates" if they aren't signed in*/
                      /*
                      !authenticated &&
                        <div style={{backgroundColor:"lightgrey" , paddingTop:"8px" , paddingBottom:"3px", paddingLeft:"8px" , borderRadius:"4px"}}>
                          <text >Like what you see? Subscribe for updates </text>
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
                        </div>
                        <br/>

                      */
                    }
                  <CommentSection  article_id={this.props.match.params.article_id}/>

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
