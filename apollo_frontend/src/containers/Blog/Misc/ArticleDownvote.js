import React from "react" ;
import axios from "axios";
import {
  Badge ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import { ChevronDown } from 'react-bootstrap-icons';

import { Event } from 'containers/GlobalMisc/Tracking';

import {
  create_article_downvote_url ,
  remove_article_downvote_url ,
  get_article_downvotes_url ,

} from "backend-urls.js" ;



class ArticleDownvote extends React.Component {

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
      .get(get_article_downvotes_url(this.props.article_id))
      .then(response => {

        console.log("response: " + response.data )

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
      .delete( remove_article_downvote_url(this.state.downvote_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        Event("Downvote Article" , "Remove Downvote Article SUCCESS")
        this.handleGetDownvotes()
        console.log('removed downvote ')
        this.setState({
          downvoted : false ,

        })
      })
      .catch(error => {
        Event("Downvote Article" , "Remove Downvote Article FAIL")
        console.log('error removing downvote' + error )
      })

      //sets the ArticlePage state var "article_downvoted" to false
      this.props.article_downvoted(false) ;

  }


  handleCreateDownvote = () => {
    var auth_token = 'Token ' + this.props.token ;

    var downvote_data = new FormData() ;
    downvote_data.append('article' , this.props.article_id )
    downvote_data.append('user' , this.props.user_id)

    axios
      .post(create_article_downvote_url , downvote_data ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        Event("Downvote Article" , "Create Downvote Article SUCCESS")
        this.handleGetDownvotes()
      })
      .catch(error => {
        Event("Downvote Article" , "Create Downvote Article FAIL")
        console.log('error creating upvote: ' + error.code)
      })
      //sets the ArticlePage state var "article_downvoted" to true
      this.props.article_downvoted(true) ;
  }

  handleDownvoteClickWithGA = () => {
    Event("Downvote Article" , "Downvote Article Attempt")
    this.handleDownvoteClick()
  }


  handleDownvoteClick = ( text ) => {
    if(this.props.user_id === 0)
    {
      alert("You need to sign in to do this.")
    }else {
      if(this.state.downvoted){
        this.handleRemoveDownvote()
      }else{
        this.handleCreateDownvote()
      }
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

    //used to determine if the user has already downvoted this article and has just hit the upvote button.. removes the downvote if true
    if(this.props.article_upvoted && downvoted){
      this.handleRemoveDownvote() ;
    }

    return(
      <Badge
        onClick={this.handleDownvoteClickWithGA}
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

  )(ArticleDownvote) ;
