import React from "react" ;
import {withRouter} from 'react-router';
import {
  Navbar ,
  Nav ,
  Container ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import {
  logoutUser ,

} from "../../store/actions/auth";


class NavigationBar extends React.Component {

  render(){
    const { error, loading , authenticated , username } = this.props;

    return (
      <React.Fragment >
        <Navbar expand="lg" className="bg-navbar">
          <Container >
            <Navbar.Brand

              onClick={() => this.props.history.push('/')}
              style={{cursor: 'pointer'}}
            >
              <h4 className="verdana-font ">
                Apollo
              </h4>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end " id="basic-navbar-nav">
                {
                  authenticated ?
                    <React.Fragment>
                      <Navbar.Text>
                        <Nav.Link href="/profile">Hello, {username}!</Nav.Link>
                      </Navbar.Text>
                      <Navbar.Text>
                        <Nav.Link onClick={ () => this.props.logout() }>Logout</Nav.Link>
                      </Navbar.Text>
                    </React.Fragment>
                  :
                    <React.Fragment>
                      <Navbar.Text>
                        <Nav.Link href="/login">Login</Nav.Link>
                      </Navbar.Text>
                      <Navbar.Text>
                        <Nav.Link href="/signup">Signup</Nav.Link>
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
