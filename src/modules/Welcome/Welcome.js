import React from 'react'
import './Welcome.css'
import SearchContainer from '../Search/SearchContainer'

const Welcome = () => (
	<div className="welcome">
		<h1>Hi! Write below what should I find for you ;)</h1>
		<SearchContainer />
		<button className="welcome__hide" onClick={(e) => e.target.parentNode.style.display = 'none'}>
			See the results
		</button>
	</div>
)

export default Welcome
