import React from 'react';
import MoonSVG from 'containers/GlobalMisc/RocketToMoon/MoonSVG' ;
import StarsSVG from 'containers/GlobalMisc/RocketToMoon/StarsSVG' ;
import EarthSVG from 'containers/GlobalMisc/RocketToMoon/EarthSVG' ;
import RocketSVG from 'containers/GlobalMisc/RocketToMoon/RocketSVG' ;


function RocketToMoon() {
  return (

    <svg x="0px" y="0px"  style={{overflow : "visible"}} >

      {/*(leftmost) star over earth*/}
      {/*<StarsSVG x="-100" y="120" viewBoxX="2560" viewBoxY="2560" rotate="45" />*/}
      {/*(bottom right) star to right of earth*/}
      {/*<StarsSVG x="150" y="450" viewBoxX="3072" viewBoxY="3072" rotate="0" />*/}
      {/*(rightmost) star near earth*/}
      {/*<StarsSVG x="250" y="280" viewBoxX="3584" viewBoxY="3584" rotate="330" />*/}
      {/*(bottom rightmost) star near earth*/}
      {/*<StarsSVG x="325" y="750" viewBoxX="3584" viewBoxY="3584" rotate="310" />*/}

      <MoonSVG x="320" y="10" viewBoxX="768" viewBoxY="768" />

      <EarthSVG x="-400" y="550" width="128" height="128" viewBoxX="128" viewBoxY="128" />

      {/*<RocketSVG x="-85" y="256" viewBoxX="1124" viewBoxY="1124" />*/}

  </svg>




  )
}

export default RocketToMoon
