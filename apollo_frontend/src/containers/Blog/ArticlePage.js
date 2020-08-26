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
import { Event, PageView} from '../GlobalMisc/Tracking';

// found at https://www.npmjs.com/package/react-bootstrap-icons

import TwitterLogo      from    '../GlobalMisc/TwitterLogo';
import RedditLogo       from    '../GlobalMisc/RedditLogo';
import LinkedInLogo     from    '../GlobalMisc/LinkedInLogo';
import EmailLogo        from    '../GlobalMisc/EmailLogo';
import FacebookLogo     from    '../GlobalMisc/FacebookLogo';

import RichText         from    '../GlobalMisc/RichText';
import LoaderSpinner    from    '../GlobalMisc/LoaderSpinner';
import Error404    from    '../GlobalMisc/Error404';

import RegisterEmail    from    './Misc/RegisterEmail';
import CommentSection   from    './Misc/CommentSection' ;
import ArticleUpvote    from    './Misc/ArticleUpvote' ;
import ArticleDownvote  from    './Misc/ArticleDownvote' ;


import "../../content/css/App.css";
import {
  article_url,
  create_user_read_article_url ,

} from "../../backend-urls.js" ;




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
        console.log(error.response.status)

        this.setState({
          error: error.response.status ,
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
      error ,
      article_upvoted ,
      article_downvoted ,
      window_width ,

    } = this.state

    const {
      authenticated ,

    } = this.props

    console.log(error)

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

    }

    const twitter_link = "https://twitter.com/intent/tweet?text=check%20out%20this%20new%20ecommerce%20startup!%20https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
    const facebook_link = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse "
    //" https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flocalhost%3A3000%2Fblog%2Farticle%2F"+article_data['id']
    const reddit_link = "https://www.reddit.com/submit?url=https%3A%2F%2Fwww.apollo-blog-269301.appspot.com%2Fblog%2Farticle%2F"+article_data['id']+"&title=Check%20Out%20This%20New%20Ecommerce%20Startup "
    const email_link = "mailto:?subject=Check Out This New Ecommerce Startup&body=Check Out This New Ecommerce Startup!%0A%0A They are the first ecommerce site that is accepting Bitcoin and they've got big plans!%0A%0A You can read more about them out at https%3A%2F%2Fwww.apollo-blog-269301.appspot.com%2Fblog%2Farticle%2F"+article_data['id']
    const linkedin_link = "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.apollo-blog-269301.appspot.com%2Fblog%2Farticle%2F"+article_data['id']


    return (

      <React.Fragment>
        {
          error == 404 || error ?
            (
              <Error404 />
            )
            :
            (
              <Row>
                {
                  window_width  &&
                    <Col lg={2} >

                      <ListGroup
                        variant="flush"
                        className="sticky-top BeforeScroll "
                      >
                        <div id="apollo_widget_left_sidebar">
                          <ListGroup.Item className="bg-app border-width-0px ">
                            <h4
                              className="roboto-regular-font"
                              onClick={this.handleHomeButtonClickWithGA }
                              style={{cursor: 'pointer'}}
                            >
                                Apollo
                            </h4>

                          </ListGroup.Item>

                          <ListGroup.Item className="bg-app border-width-0px ">

                            {
                              !loading &&
                                <React.Fragment>
                                  <ArticleUpvote article_id={this.props.match.params.article_id} article_downvoted={article_downvoted} article_upvoted={this.handleArticleUpvoteClick} />
                                  <ArticleDownvote article_id={this.props.match.params.article_id} article_upvoted={article_upvoted} article_downvoted={this.handleArticleDownvoteClick} />
                                </React.Fragment>
                            }

                            <br />

                            <a
                              class="margin-top-5-percent"
                              target="_blank"
                              href={twitter_link}
                              onClick={ () => Event("Article Sharing", "Sharing Article via Twitter Link in Left Sidebar", "From Article Page") }
                            >
                              <TwitterLogo />
                            </a>
                            <br />
                            <br />
                            <a
                              class="margin-top-5-percent"
                              target="_blank"
                              href={reddit_link}
                              onClick={ () => Event("Article Sharing", "Sharing Article via Reddit Link in Left Sidebar", "From Article Page") }
                            >
                              <RedditLogo />
                            </a>
                            <br />
                            <br />
                            <a
                              class="margin-top-5-percent"
                              target="_blank"
                              href={linkedin_link}
                              onClick={ () => Event("Article Sharing", "Sharing Article via Linkedin Link in Left Sidebar", "From Article Page") }
                            >
                              <LinkedInLogo />
                            </a>
                            <br />
                            <br />
                            <a
                              class="margin-top-5-percent"
                              target="_blank"
                              href={email_link}
                              onClick={ () => Event("Article Sharing", "Sharing Article via Email Link in Left Sidebar", "From Article Page") }
                            >
                              <EmailLogo />
                            </a>

                            {
                              !authenticated &&
                                <React.Fragment>
                                  <br />
                                  <br />
                                  <Link to="/signup" className="plain-link" onClick={() => Event("Routing", "Opening Signup Page", "From Article Page") }>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      className="roboto-bold-font"
                                    >
                                      Signup
                                    </Button>
                                  </Link>

                                </React.Fragment>
                            }
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
                              <h1 className="roboto-bold-font">
                                {  article_data['title'] }
                              </h1>

                              <h6 className="padding-left-10px roboto-regular-font">
                                By { article_data['author']}, <Badge>{ article_date }</Badge>
                                <div class="float-right width-300px" >

                                  <a
                                    class=" float-right margin-right-5-percent "
                                    target="_blank"
                                    href={reddit_link}
                                    onClick={ () => Event("Article Sharing", "Sharing Article via Reddit Link in Left Sidebar", "From Article Page") }
                                  >
                                    <RedditLogo />
                                  </a>

                                  <a
                                    class=" float-right margin-right-5-percent "
                                    target="_blank"
                                    href={linkedin_link}
                                    onClick={ () => Event("Article Sharing", "Sharing Article via Linkedin Link in Left Sidebar", "From Article Page") }
                                  >
                                    <LinkedInLogo />
                                  </a>

                                  <a
                                    class=" float-right margin-right-5-percent "
                                    target="_blank"
                                    href={email_link}
                                    onClick={ () => Event("Article Sharing", "Sharing Article via Email Link in Left Sidebar", "From Article Page") }
                                  >
                                    <EmailLogo />
                                  </a>

                                  <a
                                    class=" float-right margin-right-5-percent "
                                    target="_blank"
                                    href={twitter_link}
                                    onClick={ () => Event("Article Sharing", "Sharing Article via Twitter Link in Title", "From Article Page") }
                                  >
                                    <TwitterLogo />
                                  </a>




                                </div>
                              </h6>

                              <hr />

                              {/*Displays the body of the article in Rich Text*/}
                              <div id="article_body">
                                <RichText text={article_data['body']} classes=" font-size-19px "/>
                              </div>

                            </React.Fragment>
                          :
                            <Alert variant="dark">There was an issue loading this article</Alert>
                        }

                        <br />

                      <CommentSection  article_id={this.props.match.params.article_id}/>

                    </React.Fragment>
                  }
                </Col>
              </Row>
            )
        }
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
