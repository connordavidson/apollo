import React from 'react';
import {BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css' ;
import {
  Container ,
  Col ,
  Row ,

} from 'react-bootstrap';
import {PageView, initGA} from './containers/GlobalMisc/Tracking';

import * as actions from "./store/actions/auth";
import NavigationBar from "./containers/Layout/NavigationBar";
import Footer from "./containers/Layout/Footer";
import BaseRouter from "./routes";
import StarsSVG from './containers/GlobalMisc/RocketToMoon/StarsSVG' ;

// import {PageView, initGA} from './containers/Misc/Tracking';

class App extends React.Component {
  state = {
    window_width : null , // stores the width of the window. used to determine if the left sidebar should be hidden
    window_height : null , // stores the height of the window. used to draw up the stars on the left/right margins
    window_width_over_992 : null // determines if the width of the window is over 992 px
  }
  componentDidMount() {
    //keeps the token in redux state from getting erased on page reload
    this.props.checkState();
    initGA('UA-163650811-1');
    PageView();

  }


  render() {
    const {
      window_width_over_992 ,
      window_height ,

    } = this.state



    return(
      <div className="bg-app " >
        <Router >
          <NavigationBar/>
            <Container  className=" main-app-container " >
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
