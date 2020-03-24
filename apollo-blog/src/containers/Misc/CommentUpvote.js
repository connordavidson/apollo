import React from "react" ;
import axios from "axios";

import {
  Badge ,

} from 'react-bootstrap';
import { ChevronUp } from 'react-bootstrap-icons';

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






  handleUpvoteClick = ( text ) => {
    var auth_token = 'Token ' + this.props.token ;

    if(this.state.upvoted){

      axios
        .delete( remove_comment_upvote_url(this.state.upvote_id) ,
          {
            headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
          }
        )
        .then(response => {
          console.log('removed upvote ')
          this.setState({
            upvoted : false ,
            number_of_upvotes : this.state.number_of_upvotes - 1 ,

          })
        })
        .catch(error => {
          console.log('error removing upvote' + error )
        })

    }else{

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
          this.handleGetUpvotes()
        })
        .catch(error => {
          console.log('error creating upvote: ' + error.code)
        })

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

    // console.log( "number_of_upvotes : " + number_of_upvotes )
    return(

      <Badge
        onClick={this.handleUpvoteClick}
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
