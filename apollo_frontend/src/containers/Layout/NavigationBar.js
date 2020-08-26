import React from "react" ;
import {withRouter} from 'react-router';
import {
  Navbar ,
  Nav ,
  Container ,

} from 'react-bootstrap';
import { Event } from "../GlobalMisc/Tracking";

import { connect } from "react-redux";
import {
  logoutUser ,

} from "../../store/actions/auth";


class NavigationBar extends React.Component {

  handleHomeButtonClickWithGA = () => {
    // this.props.history.push('/') ;
    Event("Routing", "Opening Home Page", "From Navbar")
  }

  handleLogoutClickWithGA = () => {
    this.props.logout()
    this.props.history.push('/') ;
    Event("Logout", "Logging out", "From Navbar"  )
  }



  render(){
    const { error, loading , authenticated , username } = this.props;

    return (
      <React.Fragment >
        <Navbar expand="lg" className="bg-navbar">
          <Container >
            <Navbar.Brand
              onClick={this.handleHomeButtonClickWithGA   }
              style={{cursor: 'pointer'}}
              href="/"
            >
              <h4 className="ubuntu-regular-font">
                Apollo
              </h4>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end " id="basic-navbar-nav">
              {
                authenticated ?
                  <React.Fragment>
                    <Navbar.Text>
                      <Nav.Link
                        href="/profile"
                        onClick={() => Event("Routing", "Opening Profile Page",  "From Navbar")}
                        className="ubuntu-regular-font"
                      >
                        Hello, {username}!
                      </Nav.Link>
                    </Navbar.Text>
                    <Navbar.Text>
                      <Nav.Link
                        onClick={ this.handleLogoutClickWithGA }
                        className="ubuntu-regular-font"
                      >
                        Logout
                      </Nav.Link>
                    </Navbar.Text>
                  </React.Fragment>
                :
                  <React.Fragment>
                    <Navbar.Text>
                      <Nav.Link
                        href="/login"
                        onClick={() => Event("Routing", "Opening Login Page", "From Navbar")}
                        className="ubuntu-regular-font"
                      >
                        Login
                      </Nav.Link>
                    </Navbar.Text>
                    <Navbar.Text>
                      <Nav.Link
                        href="/signup"
                        onClick={() => Event("Routing", "Opening Signup Page", "From Navbar")}
                        className="ubuntu-regular-font"
                      >
                        Signup
                      </Nav.Link>
                    </Navbar.Text>
                  </React.Fragment>
              }
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <br/>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading ,
    error: state.auth.error ,
    authenticated: state.auth.token !== null ,
    username : state.auth.username ,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (token) => dispatch(logoutUser(token))
  };
};


export default
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
    (NavigationBar)
  );
