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

import { connect }            from "react-redux";
import {withRouter}           from 'react-router';

import {
  get_user_email_preferences_url ,
  create_promotional_email_url ,

} from "../../../backend-urls.js" ;

import { PageView , Event }   from    '../../GlobalMisc/Tracking';
import LoaderSpinner          from    "../../GlobalMisc/LoaderSpinner"

//for ReactQuill. found at https://github.com/zenoamaro/react-quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';





class SendEmail extends React.Component  {

  state = {
    error: null , //stores the error that comes from the backend
    loading : false , //to determine if the page is loading
    email_option : "" , //stores the option ( col from UserEmailPreferences) of which users to send to
    subject : "" , //stores the subject (from the subject input)
    body : "" , //stores the body (from the body input)
    recipient : "" , //stores the recipients of the email (from the select box)
    article_submitted : false , //to determine if the article was successfully submitted (if true, display a banner at the bottom of the page and redirect the user)
    countdown: 3 , //countdown to redirect, after the article gets submitted
    email_preferences_options : "" , //stores the options for the select

  }

  componentDidMount(){
    this.setState({
      loading : true
    })

    PageView() ;

  }

  //has to check that the prop for token has changed (it is originally null)
  componentDidUpdate(prevProps) {
    if (this.props.token !== prevProps.token) {
      this.handleGetEmailPreferencesOptions()
    }
  }

  handleGetEmailPreferencesOptions = () => {

    this.setState({
      loading: true ,
    })

    console.log("inside handleGetEmailPreferencesOptions")

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

        this.setState({
          loading : false ,
          email_preferences_options : response.data[0] , //have to use [0] because it returns an object of all the preferences. There will only ever be 1 because there will only be 1 User Preferences row per user
          recipient : Object.keys( response.data[0] )[0] , //set the recipient (value) of the select box to the first key from the response.data. This is so the value is stored in the state even if the user doesn't change the select box
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

  handleChangeRecipients = (option) => {
    // console.log(option.target.value)
    this.setState({
      recipient: option.target.value
    });
  }


  submitForm = () => {


    Event("Send Promotional Email", "Send Promotional Email Attempt", "From Send Email Page") ;

    console.log("subject : " + this.state.subject)
    console.log("body : " + this.state.body)
    console.log("recipient : " +  this.state.recipient)

    // creates a new FormData object and adds all the form data to it
    var email_data = new FormData();
    email_data.append('subject' , this.state.subject) ;
    email_data.append('body' , this.state.body) ;
    email_data.append('recipients' , this.state.recipient) ;
    email_data.append('user' , this.props.user_id) ;

    var token = 'Token ' + this.props.token ;

    console.log('token : ' + token  ) ;
    axios
      .post(create_promotional_email_url , email_data ,
        {
          headers: { Authorization: token } //DRF requires the token in the header
        }
      )
      .then(response => {

        Event("Send Promotional Email", "Send Promotional Email SUCCESS", "From Send Email Page") ;

        console.log(response.data);
        this.setState({
          article_submitted : true
        })

      })
      .catch(error => {

        Event("Send Promotional Email", "Send Promotional Email FAIL", "From Send Email Page") ;

        console.log(error)
        this.setState({
          error: error ,
          loading : false
        })
      }) ;

  }

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
      loading ,
      recipient ,


    } = this.state ;

    const {
      authenticated ,
      token ,

    } = this.props ;


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
                    How did you get here? Oops. Click here to go <a href="/blog">home.</a>
                  </Alert>
                </React.Fragment>
              )
              :
              (
                loading ?
                  <LoaderSpinner />

                :
                <React.Fragment>
                  <Card className="border-radius-25px " >
                    <Card.Body>
                      <Card.Title as="h3" className="roboto-bold-font" >
                        Send an Email
                      </Card.Title>
                      <hr />
                      <Card.Text>
                        <Form>
                          <Form.Row>
                            <Form.Label>Email Subject:</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Enter Subject"
                              onChange = {this.handleSubject}
                            />
                          </Form.Row>
                          <br/>
                          <Form.Row>
                            <Form.Label>Recipients</Form.Label>
                            <Form.Control
                              as="select"
                              onChange={this.handleChangeRecipients}
                              value={recipient}
                            >
                              {
                                Object.entries(email_preferences_options).map(([key, value]) => {
                                    // replaces the underscores from the value and capitalizes the first letter
                                    const key_with_spaces = key.replace(/_/g , " ")
                                    const key_with_spaces_and_capitalized = key_with_spaces.replace( key_with_spaces.charAt(0) , key_with_spaces.charAt(0).toUpperCase() )

                                    return(
                                            <option value={key}>{key_with_spaces_and_capitalized}</option>
                                          )
                                        }
                                      )
                              }
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
                        className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
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
                          Error sending email
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
  // console.log(state.auth.token)
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

    )(SendEmail)
  );
