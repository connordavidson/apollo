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
//for ReactQuill (comment box). found at https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { connect } from "react-redux";


import ArticleComment from './ArticleComment'
import LoaderSpinner from './LoaderSpinner'
import CommentUpvote from './CommentUpvote'
import CommentDownvote from './CommentDownvote'
import RichText from './RichText'
import "../../content/css/App.css";

import {
  create_comment_url ,
  create_upvote_url ,

} from "../../backend-urls.js" ;



class CommentSection extends React.Component {

  state = {
    error : null , //stores any error that comes back from the database
    loading : null , //set to determine if the page is loading
    commenter_name : "" , //stores the anme of the person that is writing the comment
    comment_body : "" , //stores the body of the comment
    comment_submitted : false , //determines if the comment has been submitted.
    comment_upvoted : false , //determines if the comment is upvoted or not.
    comment_downvoted : false , //determines if the comment is downvoted or not.
  }



  handleCommentBody = (text) => {
    this.setState({
      comment_body : text
    })
  }

  handleCommenterName = (text) => {
    this.setState({
      commenter_name : text.target.value
    })
  }

  handlePostComment = () => {
    this.setState({
      loading: true
    })
    var comment_data = new FormData() ;
    comment_data.append('body' , this.state.comment_body )
    comment_data.append('author' , this.state.commenter_name)
    comment_data.append('article', this.props.article_id )

    axios
      .post(create_comment_url , comment_data)
      .then(response => {
        console.log('comment submitted')
        this.setState({
          loading: false ,
          commenter_name : "" ,
          comment_body : "" ,
          comment_submitted : true ,

        })
      })
      .catch(error => {
        this.setState({
          error: error.response.data ,
          loading: false ,
        })
      })
  }

  handleValidateComment = () => {
    return !(this.state.comment_body.length > 1 && this.state.commenter_name.length > 1)
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
      error ,
      comment_body ,
      commenter_name ,
      comment_submitted ,
      comment_downvoted ,
      comment_upvoted ,

    } = this.state

    const {
      comments ,
      user_id ,

    } = this.props



    // console.log(comments);

    return(
        <div >
          <h2 className="tahoma-font">Article Comments</h2>
          <hr />
          <Container>
            {
              comments  ?
                comments.map(comment => (
                    <ArticleComment comment={comment} />
                  )
                )
              :
                <Alert variant="dark">There are no comments yet! Leave one below</Alert>
            }
            <Card >
              <Card.Header as="h3">Add a Comment</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form>
                    <Form.Row>
                      <Form.Label>Name:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={commenter_name}
                        onChange={this.handleCommenterName}
                      />
                    </Form.Row>
                    <br/>
                    <Form.Row>
                      <Col>
                        <Form.Label>Comment:</Form.Label>
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
                  loading ?
                      <Button
                        disabled={true}
                        variant="primary"
                      >
                        <LoaderSpinner />
                      </Button>
                  :

                    <Button
                      onClick={this.handlePostComment}
                      disabled={this.handleValidateComment()}
                      variant="primary"
                    >
                      Add Comment
                    </Button>
                }
              </Card.Body>
            </Card>
            <br />
            {
              comment_submitted &&
                <Alert variant="success">You successfully added a comment!</Alert>
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
    user_id : state.auth.user_id
  };
};



export default
  connect(
    mapStateToProps ,

  )(CommentSection) ;
