import React from 'react';


//text is what gets passed in. should be used like : <RichText text={example_rich_text} />
function RichText(props) {
  var classes = ""

  if(props.classes){
    classes = props.classes
  }

  return <div className={classes} dangerouslySetInnerHTML={{__html: props.text}} />
}

export default RichText ;
