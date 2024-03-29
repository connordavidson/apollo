import React from 'react';
import axios from "axios";
import { connect } from "react-redux";

import {
  Container ,
  Col ,
  Row ,
  Card ,

} from 'react-bootstrap';

import LoaderSpinner    from    'containers/GlobalMisc/LoaderSpinner';

import {
  get_user_article_upvotes_url ,
  get_user_article_downvotes_url ,
  get_user_comment_upvotes_url ,
  get_user_comment_downvotes_url ,
  get_user_read_article_url ,

} from "backend-urls.js" ;



class UserArticleInteractions extends React.Component {

  state = {
    error : null , //holds the error
    loading : true , //to determine if the page is loading
    article_upvotes : null , //holds the user's upvotes
    article_downvotes : null , //holds the user's downvotes
    comment_upvotes : null , //holds the number of comment upvotes from the user
    comment_downvotes : null , //holds the number of downvotes from the user
    // selected_button : "change_password" , //changes whenever a user selected a button. is on the top button by default
    articles_read : null , //holds the number of articles that the user has read
  }
  componentDidMount(){
    // console.log('token CDM : ' + this.props.token)
    // console.log('username CDM: ' + this.props.username)
    this.setState({
      loading: true ,
    })

    this.handleGetUserArticleUpvotes() ;
    this.handleGetUserArticleDownvotes() ;
    this.handleGetUserCommentUpvotes() ;
    this.handleGetUserCommentDownvotes() ;
    this.handleGetUserReadArticle() ;
  }

  handleGetUserArticleUpvotes = () => {
    this.setState({
      loading: true ,
    })

    const user_id = this.props.user_id ;
    const auth_token = 'Token ' + this.props.token ;
    axios
      .get( get_user_article_upvotes_url(user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log("response: " + response.data.length )
        this.setState({
          loading : false , //is true bc getting the downvotes comes right after getting this
          article_upvotes : response.data.length
        })

      })
      .catch(error => {
        // console.log("error: " + error.data)
        this.setState({
          loading : true ,
          error : error.data
        })
      })
  }



  handleGetUserArticleDownvotes = () => {
    this.setState({
      loading: true ,
    })

    var auth_token = 'Token ' + this.props.token ;
    axios
      .get( get_user_article_downvotes_url(this.props.user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log("response: " + response.data.length )
        this.setState({
          loading : false ,
          article_downvotes : response.data.length
        })

      })
      .catch(error => {
        // console.log("error: " + error.data)
        this.setState({
          loading : false ,
          error : error.data
        })
      })
  }

  handleGetUserCommentUpvotes = () => {
    this.setState({
      loading: true ,
    })

    var auth_token = 'Token ' + this.props.token ;
    axios
      .get( get_user_comment_upvotes_url(this.props.user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log("response: " + response.data.length )
        this.setState({
          loading : false ,
          comment_upvotes : response.data.length
        })

      })
      .catch(error => {
        // console.log("error: " + error.data)
        this.setState({
          loading : false ,
          error : error.data
        })
      })
  }


  handleGetUserCommentDownvotes = () => {
    this.setState({
      loading: true ,
    })

    var auth_token = 'Token ' + this.props.token ;
    axios
      .get( get_user_comment_downvotes_url(this.props.user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log("article interactions response: " + response.data.length )
        this.setState({
          loading : false ,
          comment_downvotes : response.data.length
        })

      })
      .catch(error => {
        // console.log("article interactions error: " + error.data)
        this.setState({
          loading : false ,
          error : error.data
        })
      })
  }

  handleGetUserReadArticle = () => {
    this.setState({
      loading: true ,
    })

    var auth_token = 'Token ' + this.props.token ;
    axios
      .get( get_user_read_article_url(this.props.user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log("response: " + response.data )
        this.setState({
          loading : false ,
          articles_read : response.data.length
        })

      })
      .catch(error => {
        console.log("error: " + error.data)
        this.setState({
          loading : false ,
          error : error.data
        })
      })
  }
  render(){

    const {
      error ,
      loading ,
      article_upvotes ,
      article_downvotes ,
      comment_upvotes ,
      comment_downvotes ,
      articles_read ,

    } = this.state


    return(
      <Container>
        <Card className="border-radius-25px  " >
          <Card.Body>
            <Card.Title>
              <h5
                className="ubuntu-bold-font"
              >
                Article Interactions
              </h5>
            </Card.Title>
            <hr />
            {
            loading ?
              <LoaderSpinner />
            :
              <React.Fragment>
                <Row>
                    <Col sm={{ span: 6 }} className="open-sans-bold-font">
                      Articles Read:
                    </Col>
                    <Col sm={{ span: 6 }} className="open-sans-italic-font">
                      {articles_read}
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 6 }} className="open-sans-bold-font">
                      Articles Upvoted:
                    </Col>
                    <Col sm={{ span: 6 }} className="open-sans-italic-font">
                      {article_upvotes}
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 6 }} className="open-sans-bold-font">
                      Articles Downvoted:
                    </Col>
                    <Col sm={{ span: 6 }} className="open-sans-italic-font">
                      {article_downvotes}
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 6 }} className="open-sans-bold-font">
                      Comments Upvoted:
                    </Col>
                    <Col sm={{ span: 6 }} className="open-sans-italic-font">
                      {comment_upvotes}
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 6 }} className="open-sans-bold-font">
                      Comments Downvoted:
                    </Col>
                    <Col sm={{ span: 6 }} className="open-sans-italic-font">
                      {comment_downvotes}
                    </Col>
                </Row>
              </React.Fragment>
            }
          </Card.Body>
        </Card>
      </Container>
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

  )(UserArticleInteractions) ;
