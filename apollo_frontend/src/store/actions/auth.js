import axios from "axios";
import * as actionTypes from "./actionTypes";
import {
    signup_url ,
    login_url ,
    update_user_email_preferences_url ,

} from '../../backend-urls' ;
import { Event, PageView, initGA} from '../../containers/Misc/Tracking';

// import {
//   mergeCartOnLogin,
//   removeCartOnLogout,
// } from "./cart";


export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token , username , user_id, success_message) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username : username,
    user_id : user_id ,
    success_message : success_message ,
  };
};

export const authFail = error => {
  return {
    success_message : null ,
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};


export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};


export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(login_url, {
        username: username,
        password: password
      })
      .then(res => {
        const token = res.data.key;
        const user_id = res.data.user_id;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        Event("Login" , "Login SUCCESS" , "Login SUCCESS") ;

        dispatch(authSuccess(token , username , user_id));
        dispatch(checkAuthTimeout(10000));


        //merges the cart when the user logs in. mergeCartOnLogin is located in actions/cart.js
        // dispatch( mergeCartOnLogin(token) )

      })
      .catch(err => {
        console.log("error logging in: " )
        console.log(err.response.data)
        // console.log(err.response.data.non_field_errors)
        Event("Login" , "Login FAIL" , "Login FAIL") ;
        dispatch(authFail(err.response.data));
      });
  };
};


export const authSignup = (username, email, password1, password2) => {
  return dispatch => {

    dispatch(authStart());
    axios
      .post(signup_url, {
        username: username,
        email: email,
        password1: password1,
        password2: password2
      })
      .then(res => {

        /***
        *
        *COMMENTED THIS OUT BECAUSE THE BACKEND DOESN'T WANT YOU TO SIGN IN AUTOMATICALLY AFTER ACCOUNT CREATION.
        * ie. user has to confirm their email address before they're able to sign in
        *
        */
        // console.log("response data from creating user object object vv")
        // console.log(res.data)
        // const auth_token = 'Token ' + res.data.key;
        // console.log("auth_token : " + auth_token )
        // const user_id = res.data.user;
        // console.log("user_id : " + user_id )
        // var changed_prefs_data = { "user_id" : user_id}
        // axios
        //   .put( update_user_email_preferences_url( user_id ) , changed_prefs_data ,
        //       {
        //         headers: { Authorization: auth_token} //DRF requires the token in the header to retrieve user's info
        //       }
        //     )
        //   .then(response => {
        //     console.log("response data from creating email_preferenes object vv")
        //     console.log(response)
        //     console.log(response.data)
        //     // this.setState({
        //     //   loading : false ,
        //     //   updated : true ,
        //     //   update_loading : false
        //     // })
        //     // Event("Change Email Preferences", "Submit New Email Preferences SUCCESS", "From Profile Page") ;
        //   })
        //   .catch(error => {
        //     console.log("error vv ")
        //     console.log(error)
        //     // this.setState({
        //     //   loading : false ,
        //     //   error : error.data ,
        //     //   update_loading : false
        //     // })
        //     // Event("Change Email Preferences", "Submit New Email Preferences FAIL", "From Profile Page") ;
        //   })



        // console.log("res.data.user; user_id -> " + res.data.user + " ; " + user_id )
        // const expirationDate = new Date(new Date().getTime() + 86400 * 1000);
        // localStorage.setItem("user_id", user_id);
        // localStorage.setItem("username", username);
        // localStorage.setItem("token", token);
        // localStorage.setItem("expirationDate", expirationDate);
        Event("Signup" , "Signup SUCCESS" , "Signup SUCCESS") ;
        dispatch(authSuccess(null , null , null , res.data));
        dispatch(checkAuthTimeout(3600));

      })
      .catch(err => {
        console.log("err: " + err)
        console.log("err.data: " + err.data) ;

        Event("Signup" , "Signup FAIL" , "Signup FAIL: " + err) ;
        dispatch(authFail(err));
      });
  };
};

//added username to the authSuccess part and in the parameters of the function on 11/5/19
export const authCheckState = (username) => {
  return dispatch => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const user_id = localStorage.getItem("user_id") ;
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token , username , user_id));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};




export const logoutUser = () => {
    return dispatch => {
      //removes the user token, expiration date, staff status, and username from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("expirationDate");
      localStorage.removeItem("username");
      localStorage.removeItem("staff");
      localStorage.removeItem("user_id");
      Event("Logout" , "Logout SUCESS" , "Logout SUCESS") ;

      dispatch( logout() )
    }
}




//deprecated (from other apollo code)
export const logoutRemoveCart = () => {
  const token = localStorage.getItem('token')
  //removes the token and expiration date from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");

  console.log('TOKEN: ', token)
  return dispatch => {
    //calls removeCartOnLogout() from actions/cart.js
    // dispatch( removeCartOnLogout(token) )
    dispatch( logout() )
  }
}
