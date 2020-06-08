import React from 'react';
import {BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css' ;
import {
  Container ,

} from 'react-bootstrap';
import {PageView, initGA} from './containers/Misc/Tracking';

import * as actions from "./store/actions/auth";
import NavigationBar from "./containers/Layout/NavigationBar";
import Footer from "./containers/Layout/Footer";
import BaseRouter from "./routes";
// import ReactGA from 'react-ga';
// import {PageView, initGA} from './containers/Misc/Tracking';


class App extends React.Component {

  componentDidMount() {
    //keeps the token in redux state from getting erased on page reload
    this.props.checkState();
    initGA('UA-163650811-1');
    PageView();
  }

  render() {
    return(
      <div className="bg-app" >
        <Router >

            <NavigationBar/>
              <Container >
                <BaseRouter/>
              </Container>
            <Footer />

        </Router>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkState: () => dispatch(actions.authCheckState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);