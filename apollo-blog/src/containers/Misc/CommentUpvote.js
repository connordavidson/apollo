import React from "react" ;
import axios from "axios";

import {
  Badge ,

} from 'react-bootstrap';
import { ChevronUp } from 'react-bootstrap-icons';
import { Event } from './Tracking';

import { connect } from "react-redux";

import {
  create_comment_upvote_url ,
  remove_comment_upvote_url ,
  get_comment_upvotes_url ,

} from "../../backend-urls.js" ;
//should get triggered if the user enteres a URL that is nonexistant..
//if they enter "apollo.com/buystuff" it'll redirect here. try something with wildcards?? idk
// or with something like this.  <Route exact path="*" component={Error} />

class CommentUpvote extends React.Component {

  state = {
    upvoted : false , //if the user has given this comment an upvote
    upvote_id : null , //holds the upvote id if the user has already upvoted this comment
    number_of_upvotes : null , //displays the number of upvotes
    upvotes : null , //holds the upvote objects
  }

  componentDidMount(){
    this.handleGetUpvotes()

  }

  handleGetUpvotes = () => {
    axios
      .get(get_comment_upvotes_url(this.props.comment_id))
      .then(response => {
        // console.log("response: " + response.data )
        response.data.forEach( upvote => {
          if(upvote.user === parseInt(this.props.user_id) ){
            this.setState({
              upvoted : true ,
              upvote_id : upvote.id
            })
          }
        })

        this.setState({
          number_of_upvotes : response.data.length ,
          upvotes : response.data
        })

      })
      .catch(error => {
        console.log("error: " + error )
      })
  }


  handleRemoveUpvote = () => {
    var auth_token = 'Token ' + this.props.token ;

    axios
      .delete( remove_comment_upvote_url(this.state.upvote_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        console.log('removed upvote ')
        Event("Upvote Comment" , "Remove Upvote Comment SUCCESS")
        this.setState({
          upvoted : false ,
          number_of_upvotes : this.state.number_of_upvotes - 1 ,
        })
      })
      .catch(error => {
        Event("Upvote Comment" , "Remove Upvote Comment FAIL")
        console.log('error removing upvote' + error )
      })

      //sets the CommentSection state var "comment_upvoted" to false
      this.props.comment_upvoted(false)
  }



  handleCreateUpvote = () => {
      var auth_token = 'Token ' + this.props.token ;
      var upvote_data = new FormData() ;
      upvote_data.append('comment' , this.props.comment_id )
      upvote_data.append('user' , this.props.user_id)

      axios
        .post(create_comment_upvote_url , upvote_data ,
          {
            headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
          }
        )
        .then(response => {
          Event("Upvote Comment" , "Create Upvote Comment SUCCESS")
          this.handleGetUpvotes()
        })
        .catch(error => {
          Event("Upvote Comment" , "Create Upvote Comment FAIL")
          console.log('error creating upvote: ' + error.code)
        })
        //sets the CommentSection state var "comment_upvoted" to true
        this.props.comment_upvoted(true) ;
  }



  handleUpvoteClickWithGA = () => {
    Event("Upvote Comment" , "Upvote Comment Attempt")
    this.handleUpvoteClick() ;
  }

  handleUpvoteClick = ( text ) => {
    if(this.props.user_id === 0)
    {
      alert("You need to sign in to do this.")
    }else {
      if(this.state.upvoted){
        this.handleRemoveUpvote()
      }else{
        this.handleCreateUpvote()
      }
    }
  }


  render(){
    const {
      upvoted ,
      number_of_upvotes ,

    } = this.state

    const {
      comment_id ,
      user_id ,
    } = this.props


    //used to determine if the user has already upvoted this article and has just hit the downvote button.. removes the upvote if true
    if(this.props.comment_downvoted && upvoted){
      this.handleRemoveUpvote() ;
    }

    return(

      <Badge
        onClick={this.handleUpvoteClickWithGA}
        className={(upvoted ? "cursor-pointer color-green " : "cursor-pointer" )}
        >
        <ChevronUp size={25}/> {number_of_upvotes}
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

  )(CommentUpvote) ;
