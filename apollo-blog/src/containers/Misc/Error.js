import React from "react" ;


//should get triggered if the user enteres a URL that is nonexistant..
//if they enter "apollo.com/buystuff" it'll redirect here. try something with wildcards?? idk
// or with something like this.  <Route exact path="*" component={Error} />

function Error() {
  return(
    <h1>error four-oh-four lol you typed in the wrong url </h1>
  )
}

export default Error ;
