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

import {
  get_user_email_preferences_url ,

} from "../../../backend-urls.js" ;

//for ReactQuill. found at https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import "../../../content/css/App.css";






class SendEmail2 extends React.Component  {

  state = {
    error: null , //stores the error that comes from the backend
    loading : false , //to determine if the page is loading
    email_option : "" , //stores the option ( col from UserEmailPreferences) of which users to send to
    subject : "" , //stores the subject (from the subject input)
    body : "" , //stores the body (from the body input)
    article_submitted : false , //to determine if the article was successfully submitted (if true, display a banner at the bottom of the page and redirect the user)
    countdown: 3 , //countdown to redirect, after the article gets submitted
    email_preferences_options : "" , //stores the options for the select

  }



  componentDidMount(){
    this.setState({
      loading : true
    })

  }


componentWillReceiveProps(nextProps){
 if(this.props.token !== nextProps.token){
    this.handleGetEmailPreferencesOptions()

 }
}



  handleGetEmailPreferencesOptions = () => {

    this.setState({
      loading: true ,
    })

    const user_id = this.props.user_id ;
    const auth_token = 'Token ' + this.props.token ;

    console.log(user_id + " " + auth_token)
    //utilizes the same url from UserEmailPreferences Component becuase that already verifies the user's id and Token. We just will be ignoring this user's preferences and only look at the columns
    axios
      .get( get_user_email_preferences_url(user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // // console.log(response.data  )
        // //assign the response data into the state. this is used to set the boxes as checkedor u
        // Object.entries( response.data[0] ).map(([key, value]) => {
        //     this.setState({
        //       [key] : value
        //     })
        //     //ternary based on value... backend doesn't like "True" or "False"... wants 1/0
        //     changed_prefs_data[key] =  value ? 1 : 0
        //     // console.log(changed_prefs_data)
        //   }
        // )

        this.setState({
          loading : false ,
          email_preferences_options : response.data[0] //have to use [0] because it returns an object of all the preferences. There will only ever be 1 because there will only be 1 User Preferences row per user
        })
      })
      .catch(error => {
        console.log("email prefs error: " + error.data)
        this.setState({
          loading : false ,
          error : error.data
        })
      })



  }


  handleSubject = (text) => {
    this.setState({
      subject: text.target.value
    });
  }

  handleBody = (text) => {
    this.setState({
      body: text
    });
  }

  handleEmailOption = (text) => {
    this.setState({
      email_option: text.target.value
    });
  }


  submitForm = () => {

    // // creates a new FormData object and adds all the form data to it
    // var article_data = new FormData();
    // article_data.append('author' , this.props.username) ;
    // article_data.append('title' , this.state.title) ;
    // article_data.append('body' , this.state.body) ;
    //
    // var token = 'Token ' + this.props.token ;
    // console.log('token : ' + token  ) ;
    // axios
    //   .post(create_article_url , article_data ,
    //     {
    //       headers: { Authorization: token } //DRF requires the token in the header to create an article
    //     }
    //   )
    //   .then(response => {
    //     this.setState({
    //       article_submitted : true
    //     })
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     this.setState({
    //       error: error ,
    //       loading : false
    //     })
    //   }) ;
  }

  // countdown = ( s ) => {
  //     s -= 1 ;
  //     this.setState({
  //       countdown : s
  //     }) ;
  // }


  //determines if the inputs are valid. Used to toggle the disable on the submit button
  handleValidated = () => {
    return !(this.state.subject.length > 1 && this.state.body.length > 1)
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
      email_preferences_options ,
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


                  <Alert variant="danger">
                    How did you get here? Oops. Click here to <a href="/blog">go to Home.</a>
                  </Alert>
                </React.Fragment>
              )
              :
              (
                <React.Fragment>
                  <Card >
                    <Card.Header as="h3">Send an Email</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <Form>
                          <Form.Row>
                            <Form.Label>Email Subject:</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter Title"
                              onChange = {this.handleTitle}
                            />
                          </Form.Row>
                          <br/>
                          <Form.Row>
                            <Form.Label>Recipients</Form.Label>
                            <Form.Control as="select">
                              {
                                Object.entries(email_preferences_options).map(([key, value]) => {
                                    //replaces the underscores from the value and capitalizes the first letter
                                    // const key_with_spaces = key.replace(/_/g , " ")
                                    // const key_with_spaces_and_capitalized = key_with_spaces.replace( key_with_spaces.charAt(0) , key_with_spaces.charAt(0).toUpperCase() )

                                    return(
                                            <option>{key}</option>
                                          )
                                        }
                                      )
                              }
                              {/*
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                              */}
                            </Form.Control>
                          </Form.Row>
                          <br />
                          <Form.Row>
                            <Col>
                              <Form.Label>Email Body:</Form.Label>
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
                        Send Email
                      </Button>
                    </Card.Body>
                  </Card>

                  {
                    error &&
                      <React.Fragment>
                        <br/>
                        {/*<meta http-equiv="refresh" content="3;url=/" />*/}
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
                          You successfully sent an email! You will be redirected in {countdown} seconds
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
    user_id : state.auth.user_id ,
    username: state.auth.username ,
    authenticated: state.auth.token !== null ,
  };
};

export default
  withRouter(
    connect(
      mapStateToProps,

    )(SendEmail2)
  );
