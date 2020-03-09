import React from "react";
import {Route, Redirect} from "react-router-dom";
import Hoc from "./hoc/hoc";

import ArticlePage from "./containers/ArticlePage";
import Home from './containers/Home' ;
import CreateArticle from './containers/CreateArticle';


import Login from './containers/Account/Login';
import Signup from './containers/Account/Signup';
import Profile from './containers/Account/Profile';
import ForgotPassword from './containers/Account/ForgotPassword';
import SetNewPassword from './containers/Account/SetNewPassword';





const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" >
      <Redirect to="/blog" />
    </Route >
    <Route exact path="/blog" component={Home} />

    <Route exact path="/profile" component={Profile} />
    <Route exact path="/blog/article/:article_id" component={ArticlePage} />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/create-article" component={CreateArticle} />
    <Route exact path="/reset-password" component={ForgotPassword} />
    <Route exact path="/reset-password/:uid/:token" component={SetNewPassword}/>

  </Hoc>
);

export default BaseRouter;