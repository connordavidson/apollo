import React from 'react';
import axios from "axios";
import { connect } from "react-redux";
import {
  Container ,
  Form ,
  Button ,
  Alert ,
  Card ,

} from 'react-bootstrap';
import {
  get_user_email_preferences_url ,
  update_user_email_preferences_url ,

} from "../../../backend-urls.js" ;


import { Event }              from    '../../GlobalMisc/Tracking';
import ButtonLoaderSpinner    from    '../../GlobalMisc/ButtonLoaderSpinner';
import LoaderSpinner          from    '../../GlobalMisc/LoaderSpinner';

//stores the values of the
var changed_prefs_data = {}

class UserEmailPreferences extends React.Component {

  state = {
    error : null , //holds error
    loading : false , //loading
    updated : false , //determines if the user successfully updated their preferences
    update_loading : false , //set to true while sending new prefs to db.. used to turn on the spinner in the button while loading
    email_preferences : null , //holds the email preferences objects
    prefs_edited : false , //determines if preferences were changed. Used to determine if save button should be disabled or not

  }

  componentDidMount(){
    this.setState({
      loading: true
    })
    this.handleGetUserEmailPreferences()
  }

  handleGetUserEmailPreferences = () => {
    this.setState({
      loading: true ,
    })

    const user_id = this.props.user_id ;
    const auth_token = 'Token ' + this.props.token ;

    axios
      .get( get_user_email_preferences_url(user_id) ,
        {
          headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        }
      )
      .then(response => {
        // console.log(response.data  )
        //assign the response data into the state. this is used to set the boxes as checkedor u
        Object.entries( response.data[0] ).map(([key, value]) => {
            this.setState({
              [key] : value
            })
            //ternary based on value... backend doesn't like "True" or "False"... wants 1/0
            changed_prefs_data[key] =  value ? 1 : 0
            // console.log(changed_prefs_data)
          }
        )

        this.setState({
          loading : false ,
          email_preferences : response.data[0] //have to use [0] because it returns an object of all the preferences. There will only ever be 1 because there will only be 1 User Preferences row per user
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

  // handleInputChangeWithGA = () => {
  //   Event("Change Email Preferences", "Change Email Preferences Checkbox", "From Profile Page") ;
  //   this.handleInputChange()
  // }

  //handle here -> https://reactjs.org/docs/forms.html#handling-multiple-inputs
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.checked ;
    const name = target.name;

    Event("Change Email Preferences", "Change Email Preferences Checkbox", name) ;

    this.setState({
      [name]: value ,
      prefs_edited : true ,
      updated : false
    });
    //ternary based on value... backend doesn't like "True" or "False"... wants 1/0
    changed_prefs_data[name] = value ? 1 : 0

    // console.log(changed_prefs_data)
  }


  handleUpdatePreferencesWithGA = () => {
    Event("Change Email Preferences", "Submit New Email Preferences Attempt", "From Profile Page") ;
    this.handleUpdatePreferences()
  }

  handleUpdatePreferences = () => {
    // console.log(changed_prefs_data)
    this.setState({
      update_loading : true
    })


    const user_id = this.props.user_id ;
    const auth_token = 'Token ' + this.props.token ;

    axios
      .put( update_user_email_preferences_url( user_id ) , changed_prefs_data ,
          {
            headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
          }
        )
      .then(response => {
        this.setState({
          loading : false ,
          updated : true ,
          update_loading : false

        })
        Event("Change Email Preferences", "Submit New Email Preferences SUCCESS", "From Profile Page") ;


      })
      .catch(error => {
        // console.log("update email prefs error: " + error.data)
        this.setState({
          loading : false ,
          error : error.data ,
          update_loading : false

        })
        Event("Change Email Preferences", "Submit New Email Preferences FAIL", "From Profile Page") ;

      })


  }


  render(){
    const {
      error ,
      loading ,
      updated ,
      email_preferences ,
      prefs_edited ,
      update_loading ,
    } = this.state ;

    const {
      token ,

    } = this.props


    return(
      <Container>
      
        <Card className="border-radius-25px  " >
          <Card.Body>
            <Card.Title>
              <h5
                className="ubuntu-bold-font"
              >
                Email Preferences
              </h5>
            </Card.Title>
            <hr />
            {
              loading ?
                <LoaderSpinner />
              :
                email_preferences &&
                    Object.entries(email_preferences).map(([key, value]) => {
                        //replaces the underscores from the value and capitalizes the first letter
                        const key_with_spaces = key.replace(/_/g , " ")
                        const key_with_spaces_and_capitalized = key_with_spaces.replace( key_with_spaces.charAt(0) , key_with_spaces.charAt(0).toUpperCase() )

                        return(
                          <Form.Group >
                            <Form.Check
                              name={key}
                              checked={this.state[key]}
                              type={"checkbox"}
                              label={key_with_spaces_and_capitalized}
                              onChange={this.handleInputChange}
                              bsPrefix="form-check open-sans-regular-font"
                            />
                          </Form.Group >
                        )
                      }
                    )
            }
            {
              !loading &&
                //couldn't fit this inside the ternary above so I had to put it in it's own "loading" conditional... idk why (didn't want to cooperate with the React.Fragment)
                (
                  update_loading ?
                  <Form.Group >
                    <Button
                      block
                      bsSize="large"
                      disabled={true}
                      className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
                    >
                      <ButtonLoaderSpinner />
                    </Button>
                  </Form.Group >
                :
                  <Form.Group >
                    <Button
                      block
                      bsSize="large"
                      disabled={!prefs_edited}
                      onClick={this.handleUpdatePreferencesWithGA}
                      className="mb-2 s1-txt4 flex-c-m size3-without-width how-btn "
                    >
                      Save
                    </Button>
                  </Form.Group >
                )
            }
            {
              updated &&
                <Alert variant="success">Your preferences have been updated</Alert>
            }
          </Card.Body>
        </Card>
      </Container>
    )

  }


}


const mapStateToProps = (state) => {
  return {
    user_id : state.auth.user_id ,
    token : state.auth.token ,
    // authenticated: state.auth.token !== null ,
  }
}




export default
    connect(
      mapStateToProps ,

    )(UserEmailPreferences) ;
