import React from "react";
import axios from 'axios';
import {
  Container ,
  Col ,
  Row ,
  Form ,
  Button ,
  Card ,
  Alert ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import {withRouter} from 'react-router';

//for ReactQuill. found at https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import "../content/css/App.css";
import {
  create_article_url ,

} from "../backend-urls.js" ;





class CreateArticle extends React.Component  {

  state = {
    error: null , //stores the error that comes from the backend
    loading : false , //to determine if the page is loading
    author : "" , //stores the author (from the author input)
    title : "" , //stores the title (from the title input)
    body : "" , //stores the body (from the body input)
    article_submitted : false , //to determine if the article was successfully submitted (if true, display a banner at the bottom of the page and redirect the user)
    countdown: 3 , //countdown to redirect, after the article gets submitted

  }



  componentDidMount(){
    this.setState({
      author: this.props.username ,
      loading : false
    })
  }

  handleAuthor = (text) => {
    this.setState({
      author: text.target.value
    });
  }

  handleTitle = (text) => {
    this.setState({
      title: text.target.value
    });
  }

  handleBody = (text) => {
    this.setState({
      body: text
    });
  }

  submitForm = () => {

    // creates a new FormData object and adds all the form data to it
    var article_data = new FormData();
    article_data.append('author' , this.props.username) ;
    article_data.append('title' , this.state.title) ;
    article_data.append('body' , this.state.body) ;


    axios
      .post(create_article_url , article_data ,
        {
          headers: { Authorization: 'Token ' + this.props.token } //DRF requires the token in the header to create an article
        }
      )
      .then(response => {
        this.setState({
          article_submitted : true
        })
        console.log(response.data);
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: error ,
          loading : false
        })
      }) ;
  }

  countdown = ( s ) => {
      s -= 1 ;
      this.setState({
        countdown : s
      }) ;
  }


  handleValidated = () => {
    // return (this.state.author.length > 1 && this.state.title.length > 1 && this.state.body.length > 1)
    return !(this.state.title.length > 1 && this.state.body.length > 1)

  }


  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]


  render(){
    const {
      author ,
      title ,
      body ,
      article_submitted ,
      countdown ,
      error ,

    } = this.state ;

    const {
      authenticated ,
      token ,

    } = this.props ;



    //for counting down the "redirect" (redirect in 3.. 2.. 1..)
    // article_submitted &&
    //   setInterval(function(){
    //     s = 5 ;
    //     this.setState({
    //
    //     })
    //   }  , 1000 );


    return(

      <Container>
        <Row>
            <Col xs={2}>
            </Col>
            <Col xs={8} >

            {
              !authenticated ? (
                <React.Fragment>
                   {/*<meta http-equiv="refresh" content="3;url=/" />*/}
                  <Alert variant="danger">
                    How did you get here? oops. <a href="/">go home</a>
                  </Alert>
                </React.Fragment>
              )
              :
              (
                <React.Fragment>
                <Card >
                  <Card.Header><h3>Add an Article</h3></Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <Form>
                        {/*
                          <Form.Row>
                            <Form.Label>Your Name:</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter Name"
                              // onChange = {this.handleAuthor}
                            />
                          </Form.Row>
                        */}
                        <br />
                        <Form.Row>
                          <Form.Label>Article Title:</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Enter Name"
                            onChange = {this.handleTitle}
                          />
                        </Form.Row>
                        <br/>
                        <Form.Row>
                          <Col>
                            <Form.Label>Article Body:</Form.Label>
                            <ReactQuill
                              required
                              placeholder="Start Writing..."
                              onChange={this.handleBody}
                              className="editor_form_control"
                              modules={this.modules}
                              formats={this.formats}
                              theme="snow"
                            />
                          </Col>
                        </Form.Row>
                      </Form>

                    </Card.Text>
                    <br/>
                    <Button
                      variant="primary"
                      onClick={this.submitForm}
                      disabled={this.handleValidated()}
                    >
                      Add Article
                    </Button>
                  </Card.Body>
                </Card>

                {
                  error &&
                    <React.Fragment>
                      <br/>
                      <meta http-equiv="refresh" content="3;url=/" />
                      <Alert variant="danger">
                        Nice try buddy
                      </Alert>
                    </React.Fragment>
                }
                {
                  article_submitted  &&
                    <React.Fragment>
                      <br/>
                      <meta http-equiv="refresh" content="3;url=/" />
                      <Alert variant="success">
                        You successfully created an article! You will be redirected in {countdown} seconds
                      </Alert>
                    </React.Fragment>
                }
                </React.Fragment>
              )
            }
            </Col>
        </Row>
      </Container>
    )
  }

}

const mapStateToProps = state => {
  console.log(state.auth.token)
  return {
    loading: state.auth.loading ,
    error: state.auth.error ,
    token: state.auth.token ,
    username: state.auth.username ,
    authenticated: state.auth.token !== null ,
  };
};

export default
  withRouter(
    connect(
      mapStateToProps,

    )(CreateArticle)
  );
