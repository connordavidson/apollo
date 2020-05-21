import React from 'react';
import {Spinner} from 'react-bootstrap';

//text is what gets passed in. should be used like : <RichText text={example_rich_text} />
function LoaderSpinner() {
  return  (

    <Spinner
      animation="border"
      role="status"
      style={{
        position: 'relative',
        left: '50%',
        top: '50%',
      }}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  )
}

export default LoaderSpinner ;
