import React from "react";
import {Route, Redirect} from "react-router-dom";
import Hoc from "./hoc/hoc";

import ArticlePage          from "./containers/Blog/ArticlePage";
import Home                 from './containers/Blog/Home' ;
import StoreLandingPage     from './containers/Blog/StoreLandingPage' ;

import CreateArticle        from './containers/Admin/CreateArticle';
import SendEmail            from './containers/Admin/Misc/SendEmail';

import Login                from './containers/Account/Login';
import Signup               from './containers/Account/Signup';
import Profile              from './containers/Account/Profile';
import ForgotPassword       from './containers/Account/ForgotPassword';
import SetNewPassword       from './containers/Account/SetNewPassword';
import Careers              from './containers/Careers';
import VerifyEmail          from './containers/Account/VerifyEmail';

import UserEmailPreferences from './containers/Account/Misc/UserEmailPreferences';


const BaseRouter = () => (
  <Hoc>
    <Route exact path="/store" component={StoreLandingPage}/>
    <Route exact path="/" >
        <Redirect to="/blog" />
    </Route >

    <Route exact path="/blog" component={Home} />

    <Route exact path="/profile" component={Profile} />
    <Route exact path="/blog/article/:article_id" component={ArticlePage} />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/create-article" component={CreateArticle} />
    <Route exact path="/send-email" component={SendEmail} />
    <Route exact path="/reset" component={ForgotPassword} />
    <Route exact path="/reset/:uid/:token" component={SetNewPassword}/>
    <Route exact path="/careers" component={Careers} />
    <Route exact path="/verify-email/:key" component={VerifyEmail}/>

    <Route exact path="/email-prefs" component={UserEmailPreferences}/>

  </Hoc>
);

export default BaseRouter;
