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



import LoaderSpinner from './LoaderSpinner'
import Upvote from './Upvote'
import Downvote from './Downvote'
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




  // handleUpvote = ( comment_id , user_id , comment ) => {
  //
  //   console.log('upvote')
  //   var voted = false
  //   for(var i = 0 ;  i < comment.upvotes.length ; i++){
  //     console.log(comment.upvotes[i].user)
  //     if(comment.upvotes[i].user === user_id){
  //       voted = true ;
  //       console.log('voted')
  //       break;
  //     }
  //   }
  //
  //   var upvote_data = new FormData() ;
  //   upvote_data.append('comment' , comment_id )
  //   upvote_data.append('user' , user_id)
  //   axios
  //     .post(create_upvote_url , upvote_data)
  //     .then(response => {
  //       console.log('upvote created for ' + upvote_data.comment.author)
  //
  //     })
  //     .catch(error => {
  //       console.log('error creating upvote: ' + upvote_data.comment)
  //     })
  // }




  render(){

    const {
      loading ,
      error ,
      comment_body ,
      commenter_name ,
      comment_submitted ,

    } = this.state

    const {
      comments ,
      user_id ,
    } = this.props



    console.log(comments);
    // console.log(user_id) ;

    return(
        <div >
          <h1 className="tahoma-font">Article Comments</h1>
          <hr />
          <Container>
                {
                  comments  ?
                    comments.map(comment => (

                      <React.Fragment>
                        <Card >
                          <Card.Body>
                            <Card.Title>{comment.author}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {
                                 new Date(comment.created_date).toDateString()
                              }
                            </Card.Subtitle>
                            <Card.Text>
                              <RichText text={comment.body} />
                            </Card.Text>

                            <Upvote upvotes={comment.upvotes} comment_id={comment.id} />
                            {' '}

                            <Downvote upvotes={comment.upvotes} comment_id={comment.id} />
                            {/*
                              <Badge
                              onClick={(id ,e) => this.handleUpvote(comment.id)}
                              style={{cursor: 'pointer' , }}
                            >
                              Downvote
                            </Badge>
                            */}

                          </Card.Body>
                        </Card>
                        <hr />
                      </React.Fragment>
                      )
                    )
                  :
                    <Alert variant="dark">There are no comments yet! Leave one below</Alert>

                }



            <Card >
              <Card.Header><h3>Add a Comment</h3></Card.Header>
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
