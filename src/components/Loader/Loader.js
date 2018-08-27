import React from 'react'
import './Loader.css'

const Loader = ({mask}) => (
	<div className={`loader ${mask ? 'mask' : ''}`}>
		<div className="loader__animation">
			<span className="loader__icon loader__icon--1"></span>
			<span className="loader__icon loader__icon--2"></span>
			<span className="loader__icon loader__icon--3"></span>
			<span className="loader__icon loader__icon--4"></span>
		</div>
	</div>
)

export default Loader
