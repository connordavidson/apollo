import React from 'react';
import {
  Card ,

} from 'react-bootstrap';


import CommentUpvote      from    'containers/Blog/Misc/CommentUpvote'
import CommentDownvote    from    'containers/Blog/Misc/CommentDownvote'
import RichText           from    'containers/GlobalMisc/RichText'


import "content/css/App.css";



class ArticleComment extends React.Component {

  state = {
    comment_upvoted : false , //determines if the comment is upvoted or not.
    comment_downvoted : false , //determines if the comment is downvoted or not.
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
      comment_upvoted ,
      comment_downvoted ,
    } = this.state

    console.log("this.props.comment.author: " + this.props.comment.author )

    return(
      <React.Fragment>
        <Card className="border-radius-25px ">
          <Card.Body>
            <Card.Title className="roboto-bold-font" >
              {this.props.comment.author}
              <div className="float-right" >
                <CommentUpvote comment_id={this.props.comment.id} comment_downvoted={comment_downvoted} comment_upvoted={this.handleCommentUpvoteClick} />
                {' '}
                <CommentDownvote comment_id={this.props.comment.id} comment_upvoted={comment_upvoted} comment_downvoted={this.handleCommentDownvoteClick} />
              </div>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted roboto-regular-font">
              { new Date(this.props.comment.created_date).toDateString() }
            </Card.Subtitle>

            <Card.Text className="roboto-regular-font" >
              <RichText text={this.props.comment.body} />
            </Card.Text>

          </Card.Body>
        </Card>
        <hr />

      </React.Fragment>


    )

  }

}

export default ArticleComment ;
