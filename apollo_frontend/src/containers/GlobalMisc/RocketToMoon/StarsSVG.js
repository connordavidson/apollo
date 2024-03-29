import React from 'react';

/*
* GOT FROM -> https://www.svgrepo.com/svg/187750/star-galaxy
*/
function StarsSVG(props) {


  return (


    <svg id="stars" x={props.x} y={props.y} viewBox= {"0 0 " + props.viewBoxX + " " + props.viewBoxY} style={{overflow : "visible"}}  >
      <g transform={"rotate("+props.rotate+")"} >
        <g>
        	<g>
        		<circle cx="339.301" cy="42.584" r="16.694"/>
        	</g>
        </g>
        <g>
        	<g>
        		<circle cx="40.877" cy="285.184" r="16.694"/>
        	</g>
        </g>
        <g>
        	<g>
        		<circle cx="454.43" cy="476.386" r="16.694"/>
        	</g>
        </g>
        <g>
        	<g>
        		<circle cx="167.543" cy="495.306" r="16.694"/>
        	</g>
        </g>
        <g>
        	<g>
        		<circle cx="55.344" cy="16.694" r="16.694"/>
        	</g>
        </g>
        <g>
        	<g>
        		<circle cx="471.123" cy="213.837" r="16.694"/>
        	</g>
        </g>
        <g>
        	<g>
        		<polygon points="292.944,132.252 217.173,132.252 239.559,109.866 214.301,84.607 191.914,106.994 191.914,31.224 156.193,31.224
        			156.193,106.994 133.807,84.607 108.549,109.866 130.936,132.252 55.165,132.252 55.165,167.973 130.935,167.973 108.549,190.36
        			133.807,215.617 156.193,193.231 156.193,269.002 191.914,269.002 191.914,193.231 214.301,215.617 239.559,190.36
        			217.173,167.973 292.944,167.973 		"/>
        	</g>
        </g>
        <g>
        	<g>
        		<polygon points="458.19,348.308 382.419,348.308 404.805,325.92 379.547,300.662 357.161,323.049 357.161,247.278 321.44,247.278
        			321.44,323.049 299.053,300.662 273.795,325.92 296.181,348.308 220.41,348.308 220.41,384.029 296.181,384.029 273.795,406.415
        			299.053,431.673 321.44,409.287 321.44,485.058 357.161,485.058 357.161,409.287 379.547,431.673 404.805,406.415
        			382.419,384.029 458.19,384.029 		"  />
        	</g>
        </g>
      </g>
    </svg>

  )
}

export default StarsSVG
