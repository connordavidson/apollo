import React from "react" ;
import axios from "axios";
import {
  Badge ,

} from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';

import { connect } from "react-redux";
import {
  create_comment_downvote_url ,
  remove_comment_downvote_url ,
  get_comment_downvotes_url ,

} from "../../backend-urls.js" ;

class CommentDownvote extends React.Component {

  state = {
    downvoted : false , //if the user has given this comment an upvote
    downvote_id : null , //holds the upvote id if the user has already upvoted this comment
    number_of_downvotes : null , //displays the number of upvotes
    downvotes : null , //holds the upvote objects
  }


  componentDidMount(){

    this.handleGetDownvotes()

  }

  handleGetDownvotes = () => {
    axios
      .get(get_comment_downvotes_url(this.props.comment_id))
      .then(response => {

        // console.log("response: " + response.data )
        response.data.forEach( downvote => {
          if(downvote.user === parseInt(this.props.user_id) ){
            this.setState({
              downvoted : true ,
              downvote_id : downvote.id
            })
          }
        })

        this.setState({
          number_of_downvotes : response.data.length ,
          downvotes : response.data
        })

      })
      .catch(error => {
        console.log("error: " + error )
      })
  }

  handleRemoveDownvote = () => {
    var auth_token = 'Token ' + this.props.token ;

    axios
      .delete( remove_comment_downvote_url(this.state.downvote_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        console.log('removed downvote ')
        this.setState({
          downvoted : false ,
          number_of_downvotes : this.state.number_of_downvotes - 1 ,

        })
      })
      .catch(error => {
        console.log('error removing downvote' + error )
      })

      //sets the CommentSection state var "comment_downvoted" to false
      this.props.comment_downvoted(false) ;
  }


  handleCreateDownvote = () => {
    var auth_token = 'Token ' + this.props.token ;

    var downvote_data = new FormData() ;
    downvote_data.append('comment' , this.props.comment_id )
    downvote_data.append('user' , this.props.user_id)

    axios
      .post(create_comment_downvote_url , downvote_data ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        this.handleGetDownvotes()
      })
      .catch(error => {
        console.log('error creating upvote: ' + error.code)
      })

      //sets the CommentSection state var "comment_downvoted" to true
      this.props.comment_downvoted(true) ;
  }




  handleDownvoteClick = ( text ) => {

    if(this.state.downvoted){
      this.handleRemoveDownvote()
    }else{
      this.handleCreateDownvote()
    }
  }


  render(){
    const {
      downvoted ,
      number_of_downvotes ,

    } = this.state

    const {
      comment_id ,
      user_id ,
    } = this.props

    //used to determine if the user has already downvoted this comment and has just hit the upvote button.. removes the downvote if true
    if(this.props.comment_upvoted && downvoted){
      this.handleRemoveDownvote() ;
    }


    return(
      <Badge
        onClick={this.handleDownvoteClick}
        className={(this.state.downvoted ? "cursor-pointer color-red " : "cursor-pointer" )}
        >
        <ChevronDown size={25}/> {number_of_downvotes}
      </Badge>
    )
  }
}


const mapStateToProps = state => {
  return {
    loading : state.auth.loading ,
    error : state.auth.error ,
    token : state.auth.token ,
    user_id : state.auth.user_id
  };
};


export default
  connect(
    mapStateToProps ,

  )(CommentDownvote) ;
