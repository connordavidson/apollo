import React from "react" ;
import axios from "axios";
import {
  Badge ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import {
  create_upvote_url ,
  remove_upvote_url ,
  get_upvotes_url ,

} from "../../backend-urls.js" ;

class Downvote extends React.Component {

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
      .get(get_upvotes_url(this.props.comment_id))
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




  handleDownvoteClick = ( text ) => {
    var auth_token = 'Token ' + this.props.token ;

    if(this.state.downvoted){

      axios
        .delete( remove_upvote_url(this.state.downvote_id) ,
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

    }else{

      var downvote_data = new FormData() ;
      downvote_data.append('comment' , this.props.comment_id )
      downvote_data.append('user' , this.props.user_id)

      axios
        .post(create_upvote_url , downvote_data ,
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

    }


  }





  render(){
    const {
      upvoted ,
      number_of_downvotes ,

    } = this.state

    const {
      comment_id ,
      user_id ,
    } = this.props



    return(
      <Badge
        onClick={this.handleDownvoteClick}
        className={(this.state.downvoted ? "cursor-pointer color-red " : "cursor-pointer" )}
        >
        Downvote { number_of_downvotes}
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

  )(Downvote) ;
