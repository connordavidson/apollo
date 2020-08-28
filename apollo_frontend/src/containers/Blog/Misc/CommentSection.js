import React from 'react';
import axios from "axios";

import {
  Container ,
  Card ,
  Button,
  Col ,
  Form,
  Alert ,
  Badge ,

} from 'react-bootstrap';
import { connect }            from      "react-redux";

//for ReactQuill (comment box). found at https://github.com/zenoamaro/react-quill
import ReactQuill             from      'react-quill';
import 'react-quill/dist/quill.snow.css';


import ArticleComment         from      'containers/Blog/Misc/ArticleComment'
import CommentUpvote          from      'containers/Blog/Misc/CommentUpvote'
import CommentDownvote        from      'containers/Blog/Misc/CommentDownvote'
import LoaderSpinner          from      'containers/GlobalMisc/LoaderSpinner'
import ButtonLoaderSpinner    from      'containers/GlobalMisc/ButtonLoaderSpinner'
import { Event }              from      'containers/GlobalMisc/Tracking';
import RichText               from      'containers/GlobalMisc/RichText'



import "content/css/App.css";

import {
  create_comment_url ,
  create_upvote_url ,
  comments_url ,

} from "backend-urls.js" ;



class CommentSection extends React.Component {

  state = {
    error : null , //stores any error that comes back from the database
    loading : true , //set to determine if the page is loading
    submit_button_loading : false , //set to determine if the page is loading
    commenter_name : "" , //stores the anme of the person that is writing the comment
    comment_body : "" , //stores the body of the comment
    comment_submitted : false , //determines if the comment has been submitted.
    comment_upvoted : false , //determines if the comment is upvoted or not.
    comment_downvoted : false , //determines if the comment is downvoted or not.
    comments : null , //holds the comments for the comment section
  }


  componentDidMount(){
    this.setState({
      loading: true
    })
    this.handleGetComments()

  }

  handleGetComments = () => {
    axios
      .get(comments_url(this.props.article_id))
      .then(response => {
        // console.log("response: " + response)
        // console.log("response.data: " response.data)
        this.setState({
          loading: false ,
          comments : response.data  ,

        })
      })
      .catch(error => {
        // console.log("error: " + error)
        // console.log("error.data: " + error.data)
        this.setState({
          loading: false ,
          error : error.data  ,

        })
      })
  }

  handleCommentBody = (text) => {
    this.setState({
      comment_body : text
    })
  }

  // handleCommenterName = (text) => {
  //   this.setState({
  //     commenter_name : text.target.value
  //   })
  // }

  handlePostCommentWithGA = () => {
    Event("Create Article Comment", "Create Comment Attempt", "From Article Comment Section")
    this.handlePostComment() ;
  }

  handlePostComment = () => {
    this.setState({
      submit_button_loading: true
    })
    var comment_data = new FormData() ;
    comment_data.append('body' , this.state.comment_body )
    comment_data.append('user' , this.props.user_id)//this.state.commenter_name)
    comment_data.append('article', this.props.article_id )

    axios
      .post(create_comment_url , comment_data)
      .then(response => {
        console.log('comment submitted')
        Event("Create Article Comment", "Create Comment SUCCESS", "From Article Comment Section")
        this.setState({
          submit_button_loading: false ,
          commenter_name : "" ,
          comment_body : "" ,
          comment_submitted : true ,
        })
        this.handleGetComments() ;
      })
      .catch(error => {
        Event("Create Article Comment", "Create Comment FAIL", "From Article Comment Section" )
        this.setState({
          error: error.response.data ,
          submit_button_loading: false ,
          comment_body : "" ,
        })
      })
  }

  handleValidateComment = () => {
    console.log( "comment body : " + (this.state.comment_body ) )
    return (this.state.comment_body.length > 11)
  }



  /***the following two functions (handleCommentUpvoteClick & handleArticleDownvoteClick) are used when a user has upvoted a comment and then hits the downvote button (and vise versa)***/

  //callback function for CommentUpvote component. if the user is creating an upvote, it sets it to true. and false if the upvote is being removed (by the user hitting downvote)
  handleCommentUpvoteClick = (value) => {
    console.log("handleCommentUpvoteClick value : " + value)
    this.setState({
      comment_upvoted : value ,
    })
  }
  //callback function for CommentDownvote component. if the user is creating a downvote, it sets it to true. and flase if the downvote is being removed (by the user hitting upvote)
  handleCommentDownvoteClick = (value) => {
    console.log("handleCommentDownvoteClick value : " + value )
    this.setState({
      comment_downvoted : value ,
    })
  }



  render(){

    const {
      loading ,
      submit_button_loading ,
      error ,
      comment_body ,
      comment_submitted ,
      comment_downvoted ,
      comment_upvoted ,
      comments ,

    } = this.state

    const {
      user_id ,
      username ,
      authenticated ,

    } = this.props



    console.log("loading : " + loading );

    return(
        <div >
          <h2 className="roboto-bold-font">Comments</h2>
          <hr />
          <Container>
            {
              loading &&
                <LoaderSpinner />
            }
            {
              !loading ?
                  comments  ?
                    comments.map(comment => (
                        <ArticleComment comment={comment} />
                      )
                    )
                  :
                    <Alert variant="dark">There are no comments yet! Leave one below</Alert>
                :
                  <br />
            }
            {
              authenticated ?
                  <Card className="border-radius-25px ">
                    <Card.Body>
                      <Card.Title className="roboto-bold-font" >
                        Add a Comment
                      </Card.Title>
                      <hr />
                      <Card.Text>
                        <Form>
                          <Form.Row>
                            <Col>
                              {/*<Form.Label>Comment:</Form.Label>*/}
                              <ReactQuill

                                placeholder="Start Writing..."
                                onChange={this.handleCommentBody}
                                value={comment_body}
                              />
                            </Col>
                          </Form.Row>
                        </Form>
                      </Card.Text>
                      {
                        submit_button_loading ?
                          <Button
                            disabled={true}
                            variant="primary"
                            className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
                          >
                            <ButtonLoaderSpinner />
                          </Button>
                        :
                          <Button
                            onClick={this.handlePostCommentWithGA}
                            disabled={!this.handleValidateComment()}
                            variant="primary"
                            className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
                          >
                            Add Comment
                          </Button>

                        }
                    </Card.Body>
                  </Card>
                :
                  <Alert variant="dark" className="roboto-regular-font">
                    You need to <a href="/login" onClick={() => Event("Routing", "Opening Login Page", "From Article Comment Section")}>Login</a> or <a href="/signup" onClick={() => Event("Routing", "Opening Signup Page", "From Article Comment Section") }>Signup</a> to leave a comment.
                  </Alert>
            }
            {
              comment_submitted &&
                <React.Fragment>
                  <br />
                  <Alert
                    variant="success"
                    className="roboto-bold-font"
                  >
                    Your comment has been added!
                  </Alert>
                </React.Fragment>
            }
          </Container>

        </div>

    )
  }


}



const mapStateToProps = state => {
  return {
    loading : state.auth.loading ,
    error : state.auth.error ,
    authenticated : state.auth.token !== null ,
    user_id : state.auth.user_id ,
    username : state.auth.username
  };
};



export default
  connect(
    mapStateToProps ,

  )(CommentSection) ;
