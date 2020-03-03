import React from "react" ;
import {withRouter} from 'react-router';
import {
  Navbar ,
  Nav ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import {
  logoutUser ,

} from "../../store/actions/auth";


class NavigationBar extends React.Component {

  render(){
    const { error, loading , authenticated , username } = this.props;

    return (
      <React.Fragment>
        <div>
            <Navbar expand="lg" variant="light" bg="light" >
              <Navbar.Brand
                onClick={() => this.props.history.push('/')}
                style={{cursor: 'pointer'}}
              >
                <h4 className="verdana-font">
                  Apollo
                </h4>
              </Navbar.Brand>
              <Navbar.Collapse className="justify-content-end ">
                  {
                    authenticated ?
                      <React.Fragment>
                        <Nav.Link href="/profile">Hello, {username}!</Nav.Link>
                        <Nav.Link onClick={ () => this.props.logout() }>Logout</Nav.Link>
                      </React.Fragment>
                    :
                      <React.Fragment>
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/signup">Signup</Nav.Link>
                      </React.Fragment>
                  }
              </Navbar.Collapse>
            </Navbar>
        </div>
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
